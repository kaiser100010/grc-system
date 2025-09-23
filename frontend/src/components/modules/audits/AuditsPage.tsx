import React, { useMemo, useState } from "react";
import { useAppStore } from "../../../store/appStore";
import type { AuditLog } from "../../../store/appStore";
import {
  History,
  Filter,
  Search,
  Plus,
  Download,
  Eye,
  X,
  FileText,
  User,
  Database,
  Activity,
  Edit,
  Trash2,
  Inbox,
  Save,
} from "lucide-react";

/** Utilidades */
const fmt = (d: Date | string) => {
  const dd = typeof d === "string" ? new Date(d) : d;
  return dd.toLocaleString();
};

const toCsv = (rows: any[]) => {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: any) => {
    const s = String(v ?? "");
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = cols.map(esc).join(",");
  const body = rows.map((r) => cols.map((c) => esc((r as any)[c])).join(",")).join("\n");
  return `${head}\n${body}`;
};

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

/** Página */
const AuditsPage: React.FC = () => {
  const { auditLogs, addAuditLog, updateAuditLog, deleteAuditLog, clearAuditLogs, user } = useAppStore();

  /* ===================
     Filtros de búsqueda
     =================== */
  const [filters, setFilters] = useState({
    search: "",
    action: "all",
    entity: "all",
    userId: "all",
    from: "",
    to: "",
  });

  const actions = useMemo(() => uniq(auditLogs.map((l) => l.action)).sort(), [auditLogs]);
  const entities = useMemo(() => uniq(auditLogs.map((l) => l.entity)).sort(), [auditLogs]);
  const users = useMemo(
    () =>
      uniq(auditLogs.map((l) => `${l.userId}||${l.userName}`))
        .map((s) => {
          const [id, name] = s.split("||");
          return { id, name };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [auditLogs]
  );

  const filtered = useMemo(() => {
    const fText = filters.search.trim().toLowerCase();
    const fromTs = filters.from ? new Date(filters.from).getTime() : -Infinity;
    const toTs = filters.to ? new Date(filters.to).getTime() : Infinity;

    return [...auditLogs]
      .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
      .filter((l) => {
        if (filters.action !== "all" && l.action !== filters.action) return false;
        if (filters.entity !== "all" && l.entity !== filters.entity) return false;
        if (filters.userId !== "all" && l.userId !== filters.userId) return false;

        const ts = new Date(l.timestamp).getTime();
        if (!(ts >= fromTs && ts <= toTs)) return false;

        if (fText) {
          const haystack = `${l.userName} ${l.userId} ${l.action} ${l.entity} ${l.entityId} ${l.ipAddress ?? ""} ${l.userAgent ?? ""} ${JSON.stringify(l.changes ?? {})}`.toLowerCase();
          if (!haystack.includes(fText)) return false;
        }

        return true;
      });
  }, [auditLogs, filters]);

  /* ===========
     Estadísticas
     =========== */
  const stats = useMemo(() => {
    const total = auditLogs.length;
    const last24 = auditLogs.filter((l) => Date.now() - new Date(l.timestamp).getTime() <= 24 * 3600 * 1000).length;
    const uniqUsers = uniq(auditLogs.map((l) => l.userId)).length;
    const uniqEntities = uniq(auditLogs.map((l) => l.entity)).length;
    return { total, last24, uniqUsers, uniqEntities };
  }, [auditLogs]);

  /* ==================
     Funciones de página
     ================== */
  const addSamples = () => {
    const uid = user?.id ?? "system";
    const uname = user?.name ?? "Sistema";
    const now = new Date();

    const samples: AuditLog[] = [
      { id: `${Date.now()}_1`, userId: uid, userName: uname, action: "LOGIN", entity: "AUTH", entityId: "-", timestamp: now },
      { id: `${Date.now()}_2`, userId: uid, userName: uname, action: "CREATE", entity: "RISK", entityId: "R-001", changes: { title: "Riesgo crítico" }, timestamp: now },
      { id: `${Date.now()}_3`, userId: uid, userName: uname, action: "UPDATE", entity: "CONTROL", entityId: "C-100", changes: { status: "implemented" }, timestamp: now },
      { id: `${Date.now()}_4`, userId: uid, userName: uname, action: "DELETE", entity: "TASK", entityId: "T-55", timestamp: now },
      { id: `${Date.now()}_5`, userId: uid, userName: uname, action: "READ", entity: "POLICY", entityId: "P-20", timestamp: now },
    ];
    samples.forEach(addAuditLog);
  };

  const exportCsv = () => {
    const csv = toCsv(
      filtered.map((l) => ({
        id: l.id,
        timestamp: new Date(l.timestamp).toISOString(),
        userId: l.userId,
        userName: l.userName,
        action: l.action,
        entity: l.entity,
        entityId: l.entityId,
        ipAddress: l.ipAddress ?? "",
        userAgent: l.userAgent ?? "",
        changes: l.changes ? JSON.stringify(l.changes) : "",
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* =========
     UI Cambio
     ========= */
  const [showJson, setShowJson] = useState<AuditLog | null>(null);

  /* =========
     UI Editar
     ========= */
  const [editRow, setEditRow] = useState<AuditLog | null>(null);
  const [editForm, setEditForm] = useState({
    action: "",
    entity: "",
    entityId: "",
    userName: "",
    userId: "",
    ipAddress: "",
    userAgent: "",
    timestamp: "",
    changesText: "",
  });

  const openEdit = (row: AuditLog) => {
    setEditRow(row);
    setEditForm({
      action: row.action,
      entity: row.entity,
      entityId: row.entityId,
      userName: row.userName,
      userId: row.userId,
      ipAddress: row.ipAddress ?? "",
      userAgent: row.userAgent ?? "",
      timestamp: new Date(row.timestamp).toISOString().slice(0, 19),
      changesText: row.changes ? JSON.stringify(row.changes, null, 2) : "",
    });
  };

  const saveEdit = () => {
    if (!editRow) return;
    let parsed: any = undefined;
    if (editForm.changesText.trim()) {
      try {
        parsed = JSON.parse(editForm.changesText);
      } catch {
        alert("El JSON de 'changes' no es válido.");
        return;
      }
    }
    updateAuditLog(editRow.id, {
      action: editForm.action,
      entity: editForm.entity,
      entityId: editForm.entityId,
      userName: editForm.userName,
      userId: editForm.userId,
      ipAddress: editForm.ipAddress || undefined,
      userAgent: editForm.userAgent || undefined,
      timestamp: new Date(editForm.timestamp),
      changes: parsed,
    });
    setEditRow(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auditorías</h1>
          <p className="mt-2 text-gray-600">Registro de actividades y cambios en el sistema.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addSamples}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            Demo
          </button>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => {
              if (confirm("¿Vaciar todos los registros de auditoría?")) clearAuditLogs();
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-red-700 hover:bg-red-50"
          >
            <Inbox className="h-4 w-4" />
            Vaciar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<History className="h-6 w-6" />} title="Eventos totales" value={stats.total} />
        <StatCard icon={<Activity className="h-6 w-6" />} title="Últimas 24h" value={stats.last24} />
        <StatCard icon={<User className="h-6 w-6" />} title="Usuarios únicos" value={stats.uniqUsers} />
        <StatCard icon={<Database className="h-6 w-6" />} title="Entidades" value={stats.uniqEntities} />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por usuario, entidad, ID, IP, agente o cambios..."
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="h-4 w-4" /> Filtros
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            value={filters.action}
            onChange={(e) => setFilters((p) => ({ ...p, action: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Todas las acciones</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={filters.entity}
            onChange={(e) => setFilters((p) => ({ ...p, entity: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Todas las entidades</option>
            {entities.map((en) => (
              <option key={en} value={en}>
                {en}
              </option>
            ))}
          </select>

          <select
            value={filters.userId}
            onChange={(e) => setFilters((p) => ({ ...p, userId: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Todos los usuarios</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.id})
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={filters.from}
            onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Desde"
          />
          <input
            type="datetime-local"
            value={filters.to}
            onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Hasta"
          />
        </div>

        <div>
          <button
            onClick={() => setFilters({ search: "", action: "all", entity: "all", userId: "all", from: "", to: "" })}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Fecha/Hora</Th>
                <Th>Usuario</Th>
                <Th>Acción</Th>
                <Th>Entidad</Th>
                <Th>Entidad ID</Th>
                <Th>IP</Th>
                <Th>Agente</Th>
                <Th className="text-right">Cambios</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{fmt(l.timestamp)}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                    {l.userName} <span className="text-gray-500">({l.userId})</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{l.action}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{l.entity}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{l.entityId}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{l.ipAddress ?? "—"}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 truncate max-w-[240px]" title={l.userAgent}>
                    {l.userAgent ?? "—"}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm">
                    {l.changes ? (
                      <button
                        onClick={() => setShowJson(l)}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900"
                        title="Ver cambios"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => openEdit(l)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 mr-3"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("¿Eliminar este registro de auditoría?")) deleteAuditLog(l.id);
                      }}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-600">
                    No hay registros que coincidan con el filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal JSON cambios */}
      {showJson && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowJson(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Cambios del evento</h3>
                </div>
                <button onClick={() => setShowJson(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5 max-h-[70vh] overflow-auto">
                <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-auto">
                  {JSON.stringify(showJson.changes ?? {}, null, 2)}
                </pre>
                <div className="mt-3 text-xs text-gray-500">
                  Evento: <strong>{showJson.action}</strong> sobre <strong>{showJson.entity}</strong> (
                  {showJson.entityId}) • {fmt(showJson.timestamp)}
                </div>
              </div>
              <div className="px-5 py-3 bg-gray-50 text-right">
                <button
                  onClick={() => setShowJson(null)}
                  className="inline-flex items-center px-4 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal EDITAR */}
      {editRow && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditRow(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Editar registro</h3>
                </div>
                <button onClick={() => setEditRow(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Text label="Acción" value={editForm.action} onChange={(v) => setEditForm((p) => ({ ...p, action: v }))} />
                  <Text label="Entidad" value={editForm.entity} onChange={(v) => setEditForm((p) => ({ ...p, entity: v }))} />
                  <Text label="Entidad ID" value={editForm.entityId} onChange={(v) => setEditForm((p) => ({ ...p, entityId: v }))} />
                  <Text label="Usuario" value={editForm.userName} onChange={(v) => setEditForm((p) => ({ ...p, userName: v }))} />
                  <Text label="Usuario ID" value={editForm.userId} onChange={(v) => setEditForm((p) => ({ ...p, userId: v }))} />
                  <Text label="IP" value={editForm.ipAddress} onChange={(v) => setEditForm((p) => ({ ...p, ipAddress: v }))} />
                  <Text label="Agente" value={editForm.userAgent} onChange={(v) => setEditForm((p) => ({ ...p, userAgent: v }))} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha/Hora (local)</label>
                    <input
                      type="datetime-local"
                      value={editForm.timestamp}
                      onChange={(e) => setEditForm((p) => ({ ...p, timestamp: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">changes (JSON)</label>
                  <textarea
                    rows={8}
                    value={editForm.changesText}
                    onChange={(e) => setEditForm((p) => ({ ...p, changesText: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                    placeholder='{"campo":"valor"}'
                  />
                </div>
              </div>
              <div className="px-5 py-3 bg-gray-50 text-right">
                <button
                  onClick={saveEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ======== Componentes auxiliares ======== */
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string }> = ({
  icon,
  title,
  value,
}) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-full bg-blue-50 text-blue-600">{icon}</div>
      <div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  </div>
);

const Th: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className ?? ""}`}>
    {children}
  </th>
);

const Text: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    />
  </div>
);

export default AuditsPage;
