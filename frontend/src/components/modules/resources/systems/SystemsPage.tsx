import React, { useMemo, useState, useEffect } from "react";
import {
  Server,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Shield,
  Activity,
  X,
  Save,
} from "lucide-react";
import { useAppStore } from "../../../../store/appStore";
import type { System } from "../../../../store/appStore";

// ===== Helpers seguros =====
const fmtDate = (d?: string | Date | null) => {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("es-ES");
};

const badgeByCriticality: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-700",
};

const badgeByStatus: Record<string, string> = {
  operational: "bg-green-100 text-green-700",
  maintenance: "bg-yellow-100 text-yellow-800",
  deprecated: "bg-gray-100 text-gray-700",
  decommissioned: "bg-gray-200 text-gray-600",
};

const labelCriticality = (v?: string) =>
  v === "low"
    ? "Baja"
    : v === "medium"
    ? "Media"
    : v === "high"
    ? "Alta"
    : v === "critical"
    ? "Crítica"
    : "—";

const labelStatus = (v?: string) =>
  v === "operational"
    ? "Operativo"
    : v === "maintenance"
    ? "Mantenimiento"
    : v === "deprecated"
    ? "Obsoleto"
    : v === "decommissioned"
    ? "Retirado"
    : "—";

// ===== Componente principal =====
const SystemsPage: React.FC = () => {
  const { systems, employees, addSystem, updateSystem, deleteSystem } = useAppStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "operational" | "maintenance" | "deprecated" | "decommissioned"
  >("all");
  const [critFilter, setCritFilter] = useState<"all" | "low" | "medium" | "high" | "critical">("all");

  // Modal
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<System | null>(null);

  // Datos del formulario
  type FormShape = {
    name: string;
    description: string;
    type: string;
    owner: string;
    criticality: "low" | "medium" | "high" | "critical";
    status: "operational" | "maintenance" | "deprecated" | "decommissioned";
    dataClassification: string;
    hosting: "on-premise" | "cloud" | "hybrid";
    vendor?: string;
  };

  const blankForm: FormShape = {
    name: "",
    description: "",
    type: "",
    owner: "",
    criticality: "medium",
    status: "operational",
    dataClassification: "Interna",
    hosting: "cloud",
    vendor: "",
  };

  const [form, setForm] = useState<FormShape>(blankForm);

  // Si edita, precargar datos; si crea, limpiar
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        description: editing.description || "",
        type: editing.type || "",
        owner: editing.owner || "",
        criticality: (editing.criticality as any) || "medium",
        status: (editing.status as any) || "operational",
        dataClassification: editing.dataClassification || "Interna",
        hosting: (editing.hosting as any) || "cloud",
        vendor: editing.vendor || "",
      });
    } else if (showForm) {
      setForm(blankForm);
    }
  }, [editing, showForm]);

  // Filtrado defensivo
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (systems ?? []).filter((s) => {
      const matchesSearch =
        !term ||
        [s.name, s.description, s.type, s.dataClassification]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term));

      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesCrit = critFilter === "all" || s.criticality === critFilter;

      return matchesSearch && matchesStatus && matchesCrit;
    });
  }, [systems, search, statusFilter, critFilter]);

  // === Handlers ===
  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (sys: System) => {
    setEditing(sys);
    setShowForm(true);
  };

  const onDelete = (id: string) => {
    if (confirm("¿Eliminar este sistema?")) deleteSystem(id);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones mínimas
    if (!form.name.trim()) return alert("El nombre es obligatorio.");
    if (!form.type.trim()) return alert("El tipo es obligatorio.");
    if (!form.owner.trim()) return alert("Debes seleccionar un propietario.");

    const ownerName =
      employees.find((x) => x.id === form.owner)?.name ||
      employees.find((x) => x.id === form.owner)?.firstName && (employees.find((x)=>x.id===form.owner) as any)?.lastName
        ? `${(employees.find((x)=>x.id===form.owner) as any)?.firstName} ${(employees.find((x)=>x.id===form.owner) as any)?.lastName}`
        : undefined;

    const now = new Date();

    if (editing) {
      const updates: Partial<System> = {
        ...form,
        ownerName,
        updatedAt: now,
      };
      updateSystem(editing.id, updates);
    } else {
      const newSystem: System = {
        id: String(Date.now()),
        name: form.name,
        description: form.description,
        type: form.type,
        owner: form.owner,
        ownerName,
        criticality: form.criticality,
        status: form.status,
        dataClassification: form.dataClassification,
        hosting: form.hosting,
        vendor: form.vendor || undefined,
        relatedRisks: [],
        relatedControls: [],
        createdAt: now,
        updatedAt: now,
      };
      addSystem(newSystem);
    }

    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sistemas</h1>
          <p className="text-gray-600">Inventario de sistemas y aplicaciones de la organización</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nuevo Sistema
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, tipo o clasificación…"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="all">Todos los estados</option>
              <option value="operational">Operativo</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="deprecated">Obsoleto</option>
              <option value="decommissioned">Retirado</option>
            </select>
          </div>
          <select
            value={critFilter}
            onChange={(e) => setCritFilter(e.target.value as any)}
            className="px-3 py-2 rounded-md border border-gray-300"
          >
            <option value="all">Toda criticidad</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th> Sistema </Th>
              <Th> Tipo </Th>
              <Th> Propietario </Th>
              <Th> Criticidad </Th>
              <Th> Estado </Th>
              <Th> Clasificación de Datos </Th>
              <Th> Hosting </Th>
              <Th> Actualizado </Th>
              <Th className="text-right"> Acciones </Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                      <Server className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{s.name || "—"}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{s.description || "—"}</div>
                    </div>
                  </div>
                </Td>
                <Td>{s.type || "—"}</Td>
                <Td>{s.ownerName || s.owner || "—"}</Td>
                <Td>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      badgeByCriticality[s.criticality] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {labelCriticality(s.criticality)}
                  </span>
                </Td>
                <Td>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      badgeByStatus[s.status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    {labelStatus(s.status)}
                  </span>
                </Td>
                <Td>{s.dataClassification || "—"}</Td>
                <Td>{s.hosting || "—"}</Td>
                <Td>{fmtDate(s.updatedAt)}</Td>
                <Td className="text-right">
                  <button
                    onClick={() => openEdit(s)}
                    className="text-indigo-600 hover:text-indigo-800 mr-3"
                    title="Editar"
                  >
                    <Edit3 className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => onDelete(s.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            No hay sistemas que coincidan con los filtros.
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative mx-auto mt-10 w-[95%] max-w-3xl bg-white rounded-lg shadow-xl">
            <form onSubmit={onSubmit}>
              {/* Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editing ? "Editar Sistema" : "Nuevo Sistema"}
                </h3>
                <button type="button" className="text-gray-500 hover:text-gray-700" onClick={() => setShowForm(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Nombre *"
                    value={form.name}
                    onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                    placeholder="ERP Principal, CRM, Data Lake…"
                    required
                  />
                  <TextField
                    label="Tipo *"
                    value={form.type}
                    onChange={(v) => setForm((p) => ({ ...p, type: v }))}
                    placeholder="Aplicación, ERP, Base de Datos…"
                    required
                  />
                  <SelectField
                    label="Propietario *"
                    value={form.owner}
                    onChange={(v) => setForm((p) => ({ ...p, owner: v }))}
                    required
                    options={[
                      { value: "", label: "Seleccionar…" },
                      ...employees.map((e: any) => ({
                        value: e.id,
                        label: e.name ?? `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim(),
                      })),
                    ]}
                  />
                  <SelectField
                    label="Criticidad *"
                    value={form.criticality}
                    onChange={(v) => setForm((p) => ({ ...p, criticality: v as any }))}
                    required
                    options={[
                      { value: "low", label: "Baja" },
                      { value: "medium", label: "Media" },
                      { value: "high", label: "Alta" },
                      { value: "critical", label: "Crítica" },
                    ]}
                  />
                  <SelectField
                    label="Estado *"
                    value={form.status}
                    onChange={(v) => setForm((p) => ({ ...p, status: v as any }))}
                    required
                    options={[
                      { value: "operational", label: "Operativo" },
                      { value: "maintenance", label: "Mantenimiento" },
                      { value: "deprecated", label: "Obsoleto" },
                      { value: "decommissioned", label: "Retirado" },
                    ]}
                  />
                  <TextField
                    label="Clasificación de Datos *"
                    value={form.dataClassification}
                    onChange={(v) => setForm((p) => ({ ...p, dataClassification: v }))}
                    placeholder="Interna, Confidencial, Pública…"
                    required
                  />
                  <SelectField
                    label="Hosting *"
                    value={form.hosting}
                    onChange={(v) => setForm((p) => ({ ...p, hosting: v as any }))}
                    required
                    options={[
                      { value: "on-premise", label: "On-premise" },
                      { value: "cloud", label: "Cloud" },
                      { value: "hybrid", label: "Híbrido" },
                    ]}
                  />
                  <TextField
                    label="Proveedor (opcional)"
                    value={form.vendor ?? ""}
                    onChange={(v) => setForm((p) => ({ ...p, vendor: v }))}
                    placeholder="Nombre del proveedor"
                  />
                </div>

                <TextArea
                  label="Descripción"
                  value={form.description}
                  onChange={(v) => setForm((p) => ({ ...p, description: v }))}
                  placeholder="Descripción general, propósito, alcance…"
                  rows={3}
                />
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
                  {editing ? "Guardar cambios" : "Crear sistema"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ====== UI helpers ======
const Th: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase ${className ?? ""}`}>{children}</th>
);
const Td: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <td className={`px-4 py-3 text-sm text-gray-900 ${className ?? ""}`}>{children}</td>
);
const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  </div>
);
const TextArea: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}> = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  </div>
);
const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}> = ({ label, value, onChange, options, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default SystemsPage;
