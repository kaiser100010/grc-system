import React, { useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
  FileText,
  Image as ImageIcon,
  Upload,
  Save,
} from "lucide-react";
import { useAppStore } from "../../../store/appStore";

// ===== Helpers =====
const fmtDate = (d?: Date | string) => {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("es-ES");
};
const fmtSize = (bytes?: number) =>
  typeof bytes === "number"
    ? (bytes / 1024).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + " KB"
    : "—";
const isImage = (t: string) => /^image\//.test(t);
const isPdf = (t: string) => t === "application/pdf";

const statusBadge = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-rose-100 text-rose-700",
} as const;

type RelatedType = "control" | "incident" | "risk" | "";

const EvidencePage: React.FC = () => {
  const {
    evidence,
    controls,
    incidents,
    risks,
    addEvidence,
    updateEvidence,
    deleteEvidence,
    addAuditLog,
    user,
  } = useAppStore();

  // ------- Filtros / búsqueda -------
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [type, setType] = useState<"all" | "image" | "pdf" | "other">("all");
  const [relFilterType, setRelFilterType] = useState<RelatedType>(""); // filtro por tipo de relación
  const [relFilterId, setRelFilterId] = useState<string>(""); // filtro por id de relación

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (evidence ?? []).filter((e) => {
      const matchesSearch =
        !term ||
        [e.title, e.description, e.fileName, e.uploadedByName]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term));

      const matchesStatus = status === "all" || e.status === status;

      const t = e.type || "";
      const group = isImage(t) ? "image" : isPdf(t) ? "pdf" : "other";
      const matchesType = type === "all" || type === group;

      const matchesRelType = !relFilterType || e.relatedType === relFilterType;
      const matchesRelId = !relFilterId || e.relatedId === relFilterId;

      return matchesSearch && matchesStatus && matchesType && matchesRelType && matchesRelId;
    });
  }, [evidence, search, status, type, relFilterType, relFilterId]);

  // ------- Vista previa -------
  const [preview, setPreview] = useState<any | null>(null);

  // ============================================================
  // FORMULARIO (tipo Assets): subir evidencias con asociación
  // ============================================================
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relatedType, setRelatedType] = useState<RelatedType>("");
  const [relatedId, setRelatedId] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openForm = () => {
    setShowForm(true);
    setTitle("");
    setDescription("");
    setRelatedType("");
    setRelatedId("");
    setSelectedFiles([]);
  };

  const onFilesSelected = (files: FileList | null) => {
    if (!files) return;
    setSelectedFiles(Array.from(files));
    // Sugerimos título con el primer archivo si no hay título
    if (!title && files.length > 0) setTitle(files[0].name);
  };

  const relatedNameByTypeId = (type?: RelatedType | null, id?: string | null) => {
    if (!type || !id) return "—";
    if (type === "control") return controls.find((c) => c.id === id)?.title ?? "—";
    if (type === "incident") return incidents.find((i) => i.id === id)?.title ?? "—";
    if (type === "risk") return risks.find((r) => r.id === id)?.title ?? "—";
    return "—";
  };

  const submitForm: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Selecciona al menos un archivo.");
      return;
    }

    const uploaderId = user?.id ?? "local-user";
    const uploaderName = user?.name ?? "Usuario";
    const now = new Date();

    selectedFiles.forEach((f, i) => {
      const id = (Date.now() + i).toString();
      const url = URL.createObjectURL(f);

      addEvidence({
        id,
        title: title || f.name,
        description,
        type: f.type || "application/octet-stream",
        controlId: relatedType === "control" ? relatedId : undefined, // compatibilidad legacy
        relatedType: relatedType || undefined,
        relatedId: relatedId || undefined,
        uploadedBy: uploaderId,
        uploadedByName: uploaderName,
        fileName: f.name,
        fileSize: f.size,
        fileUrl: url, // blob URL (no persiste tras recargar)
        tags: [],
        period: undefined,
        status: "pending",
        reviewer: undefined,
        reviewerComments: undefined,
        createdAt: now,
        updatedAt: now,
      });

      addAuditLog({
        id: `audit-${id}`,
        userId: uploaderId,
        userName: uploaderName,
        action: "UPLOAD",
        entity: "EVIDENCE",
        entityId: id,
        changes: {
          fileName: f.name,
          relatedType: relatedType || null,
          relatedId: relatedId || null,
        },
        timestamp: now,
      });
    });

    setShowForm(false);
  };

  // ------- Acciones tabla -------
  const approve = (id: string) => {
    const reviewerName = user?.name ?? "Usuario";
    const ev = evidence.find((e) => e.id === id);
    updateEvidence(id, {
      status: "approved",
      reviewer: reviewerName,
      updatedAt: new Date(),
    });
    addAuditLog({
      id: `audit-approve-${Date.now()}`,
      userId: user?.id ?? "local-user",
      userName: reviewerName,
      action: "APPROVE",
      entity: "EVIDENCE",
      entityId: id,
      changes: { from: ev?.status ?? "pending", to: "approved", relatedType: ev?.relatedType ?? null, relatedId: ev?.relatedId ?? null },
      timestamp: new Date(),
    });
  };

  const reject = (id: string) => {
    const reviewerName = user?.name ?? "Usuario";
    const ev = evidence.find((e) => e.id === id);
    updateEvidence(id, {
      status: "rejected",
      reviewer: reviewerName,
      updatedAt: new Date(),
    });
    addAuditLog({
      id: `audit-reject-${Date.now()}`,
      userId: user?.id ?? "local-user",
      userName: reviewerName,
      action: "REJECT",
      entity: "EVIDENCE",
      entityId: id,
      changes: { from: ev?.status ?? "pending", to: "rejected", relatedType: ev?.relatedType ?? null, relatedId: ev?.relatedId ?? null },
      timestamp: new Date(),
    });
  };

  const remove = (id: string) => {
    if (!confirm("¿Eliminar esta evidencia?")) return;
    deleteEvidence(id);
    addAuditLog({
      id: `audit-delete-${Date.now()}`,
      userId: user?.id ?? "local-user",
      userName: user?.name ?? "Usuario",
      action: "DELETE",
      entity: "EVIDENCE",
      entityId: id,
      timestamp: new Date(),
    });
  };

  // ------- UI -------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Evidencia</h1>
          <p className="text-gray-600">
            Sube y gestiona evidencia de cumplimiento. Asóciala a Controles, Incidentes o Riesgos.
          </p>
        </div>
        <button
          onClick={openForm}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          Subir evidencia
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, archivo, autor…"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobada</option>
              <option value="rejected">Rechazada</option>
            </select>
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="px-3 py-2 rounded-md border border-gray-300"
          >
            <option value="all">Todos los tipos</option>
            <option value="image">Imágenes</option>
            <option value="pdf">PDF</option>
            <option value="other">Otros</option>
          </select>

          {/* Filtro por relación */}
          <select
            value={relFilterType}
            onChange={(e) => {
              setRelFilterType(e.target.value as RelatedType);
              setRelFilterId("");
            }}
            className="px-3 py-2 rounded-md border border-gray-300"
            title="Filtrar por tipo de relación"
          >
            <option value="">Todos (relación)</option>
            <option value="control">Controles</option>
            <option value="incident">Incidentes</option>
            <option value="risk">Riesgos</option>
          </select>

          <select
            value={relFilterId}
            onChange={(e) => setRelFilterId(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300"
            disabled={!relFilterType}
            title="Filtrar por entidad relacionada"
          >
            <option value="">Todas las entidades</option>
            {relFilterType === "control" &&
              controls.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            {relFilterType === "incident" &&
              incidents.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title}
                </option>
              ))}
            {relFilterType === "risk" &&
              risks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th> Archivo </Th>
              <Th> Tamaño </Th>
              <Th> Tipo </Th>
              <Th> Relación </Th>
              <Th> Subido por </Th>
              <Th> Estado </Th>
              <Th> Fecha </Th>
              <Th className="text-right"> Acciones </Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((e) => {
              const t = e.type || "";
              const isImg = isImage(t);
              const rel =
                e.relatedType && e.relatedId
                  ? `${e.relatedType === "control" ? "Control" : e.relatedType === "incident" ? "Incidente" : "Riesgo"} · ${relatedNameByTypeId(e.relatedType as any, e.relatedId)}`
                  : e.controlId
                  ? `Control · ${controls.find((c) => c.id === e.controlId)?.title ?? "—"}`
                  : "—";

              return (
                <tr key={e.id} className="hover:bg-gray-50">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-md ${
                          isImg
                            ? "bg-fuchsia-50 text-fuchsia-600"
                            : isPdf(t)
                            ? "bg-rose-50 text-rose-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {isImg ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{e.title || e.fileName}</div>
                        <div className="text-xs text-gray-500">{e.fileName}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{fmtSize(e.fileSize)}</Td>
                  <Td className="uppercase text-xs text-gray-500">{t || "—"}</Td>
                  <Td>{rel}</Td>
                  <Td>{e.uploadedByName || e.uploadedBy || "—"}</Td>
                  <Td>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusBadge[e.status]}`}>
                      {e.status === "pending" ? "Pendiente" : e.status === "approved" ? "Aprobada" : "Rechazada"}
                    </span>
                  </Td>
                  <Td>{fmtDate(e.createdAt)}</Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      {e.fileUrl && (
                        <>
                          <button
                            onClick={() => setPreview(e)}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Vista previa"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <a
                            href={e.fileUrl}
                            download={e.fileName}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-600 hover:text-slate-800"
                            title="Abrir/Descargar"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </>
                      )}
                      {e.status !== "approved" && (
                        <button
                          onClick={() => approve(e.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Aprobar"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      {e.status !== "rejected" && (
                        <button
                          onClick={() => reject(e.id)}
                          className="text-rose-600 hover:text-rose-800"
                          title="Rechazar"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => remove(e.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            No hay evidencias que coincidan con los filtros.
          </div>
        )}
      </div>

      {/* Modal de vista previa */}
      {preview && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPreview(null)} />
          <div className="relative mx-auto mt-8 w-[95%] max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <div>
                <div className="font-semibold">{preview.title || preview.fileName}</div>
                <div className="text-xs text-gray-500">{preview.fileName}</div>
              </div>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setPreview(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 max-h-[75vh] overflow-auto">
              {preview.fileUrl ? (
                isImage(preview.type || "") ? (
                  <img src={preview.fileUrl} alt={preview.fileName} className="max-w-full mx-auto rounded" />
                ) : isPdf(preview.type || "") ? (
                  <iframe src={preview.fileUrl} title="preview" className="w-full h-[70vh] border rounded" />
                ) : (
                  <div className="text-center text-gray-600">
                    No se puede previsualizar este tipo.{" "}
                    <a className="text-blue-600 underline" href={preview.fileUrl} target="_blank" rel="noreferrer">
                      Abrir/descargar
                    </a>
                  </div>
                )
              ) : (
                <div className="text-center text-gray-500">No hay archivo disponible.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario (tipo Assets) */}
      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative mx-auto mt-10 w-[95%] max-w-3xl bg-white rounded-lg shadow-xl">
            <form onSubmit={submitForm}>
              {/* Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Subir evidencia</h3>
                <button type="button" className="text-gray-500 hover:text-gray-700" onClick={() => setShowForm(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título de la evidencia (opcional, por defecto usa el archivo)"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Descripción o notas (opcional)"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Relación a entidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de relación</label>
                    <select
                      value={relatedType}
                      onChange={(e) => {
                        const v = e.target.value as RelatedType;
                        setRelatedType(v);
                        setRelatedId("");
                      }}
                      className="w-full px-3 py-2 rounded-md border border-gray-300"
                    >
                      <option value="">Ninguna</option>
                      <option value="control">Control</option>
                      <option value="incident">Incidente</option>
                      <option value="risk">Riesgo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entidad relacionada</label>
                    <select
                      value={relatedId}
                      onChange={(e) => setRelatedId(e.target.value)}
                      disabled={!relatedType}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 disabled:bg-gray-100"
                    >
                      <option value="">Seleccionar…</option>
                      {relatedType === "control" &&
                        controls.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      {relatedType === "incident" &&
                        incidents.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.title}
                          </option>
                        ))}
                      {relatedType === "risk" &&
                        risks.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Archivos */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Archivos</label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={(e) => onFilesSelected(e.target.files)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4" />
                        Elegir archivos
                      </button>
                      <span className="text-sm text-gray-500">
                        {selectedFiles.length === 0
                          ? "Ningún archivo seleccionado"
                          : `${selectedFiles.length} archivo(s) seleccionados`}
                      </span>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mt-3 border rounded-md overflow-hidden">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50 text-gray-500">
                            <tr>
                              <th className="px-3 py-2 text-left">Nombre</th>
                              <th className="px-3 py-2 text-left">Tipo</th>
                              <th className="px-3 py-2 text-left">Tamaño</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedFiles.map((f, idx) => (
                              <tr key={idx}>
                                <td className="px-3 py-2">{f.name}</td>
                                <td className="px-3 py-2 text-xs text-gray-500">{f.type || "—"}</td>
                                <td className="px-3 py-2">{fmtSize(f.size)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  Subir evidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Pequeños helpers de tabla ---
const Th: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase ${className ?? ""}`}>{children}</th>
);
const Td: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <td className={`px-4 py-3 text-sm text-gray-900 ${className ?? ""}`}>{children}</td>
);

export default EvidencePage;
