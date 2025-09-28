import React, { useMemo, useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Search,
  Filter,
  Wrench,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  X,
  Save,
  FileCheck2,
  Layers3,
} from "lucide-react";
import { useAppStore } from "../../../store/appStore";

// Config estática local (evita depender de otros .ts)
const CONTROL_STATUSES = [
  { value: "not_implemented", label: "No implementado", color: "bg-gray-100 text-gray-700" },
  { value: "partially_implemented", label: "Parcialmente implementado", color: "bg-yellow-100 text-yellow-800" },
  { value: "implemented", label: "Implementado", color: "bg-blue-100 text-blue-800" },
  { value: "effective", label: "Efectivo", color: "bg-green-100 text-green-800" },
] as const;

const CONTROL_CATEGORIES = [
  { value: "organizational", label: "Organizativo", color: "bg-indigo-100 text-indigo-800" },
  { value: "technical", label: "Técnico", color: "bg-purple-100 text-purple-800" },
  { value: "physical", label: "Físico", color: "bg-rose-100 text-rose-800" },
  { value: "legal", label: "Legal/Regulatorio", color: "bg-sky-100 text-sky-800" },
] as const;

const FRAMEWORKS = [
  "ISO 27001",
  "NIST CSF",
  "SOC 2",
  "PCI DSS",
  "CIS Controls",
  "NIS2",
  "DORA",
];

const TEST_FREQUENCIES = [
  { value: "monthly", label: "Mensual", months: 1 },
  { value: "quarterly", label: "Trimestral", months: 3 },
  { value: "semiannual", label: "Semestral", months: 6 },
  { value: "annual", label: "Anual", months: 12 },
];

type ControlStatus = typeof CONTROL_STATUSES[number]["value"];
type ControlCategory = typeof CONTROL_CATEGORIES[number]["value"];

const ControlsPage: React.FC = () => {
  const {
    controls,
    employees,
    addControl,
    updateControl,
    deleteControl,
  } = useAppStore();

  // Filtros UI
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    framework: string | "all";
    status: ControlStatus | "all";
    owner: string | "all";
    category: ControlCategory | "all";
  }>({
    search: "",
    framework: "all",
    status: "all",
    owner: "all",
    category: "all",
  });

  // Modal/Form
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedControl = useMemo(
    () => controls.find((c) => c.id === selectedId) || null,
    [controls, selectedId]
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    framework: "ISO 27001",
    category: "organizational" as ControlCategory,
    owner: "",
    status: "not_implemented" as ControlStatus,
    effectiveness: 0,
    testFrequency: "annual",
    lastTestDate: "",
    nextTestDate: "",
    evidence: [] as string[],
    relatedRisks: [] as string[],
  });

  // Inicializar/limpiar form
  useEffect(() => {
    if (selectedControl) {
      setForm({
        title: selectedControl.title,
        description: selectedControl.description,
        framework: selectedControl.framework || "ISO 27001",
        category: (selectedControl.category as ControlCategory) || "organizational",
        owner: selectedControl.owner || "",
        status: (selectedControl.status as ControlStatus) || "not_implemented",
        effectiveness: selectedControl.effectiveness ?? 0,
        testFrequency: selectedControl.testFrequency || "annual",
        lastTestDate: selectedControl.lastTestDate
          ? toISODate(selectedControl.lastTestDate)
          : "",
        nextTestDate: selectedControl.nextTestDate
          ? toISODate(selectedControl.nextTestDate)
          : "",
        evidence: selectedControl.evidence || [],
        relatedRisks: selectedControl.relatedRisks || [],
      });
      setShowForm(true);
    } else if (showForm) {
      setForm({
        title: "",
        description: "",
        framework: "ISO 27001",
        category: "organizational",
        owner: "",
        status: "not_implemented",
        effectiveness: 0,
        testFrequency: "annual",
        lastTestDate: "",
        nextTestDate: "",
        evidence: [],
        relatedRisks: [],
      });
    }
  }, [selectedControl, showForm]);

  // Helpers
  const toISODate = (d: string | Date) =>
    new Date(d).toISOString().split("T")[0];

  const getStatusPill = (status: string) =>
    CONTROL_STATUSES.find((s) => s.value === status)?.color ||
    "bg-gray-100 text-gray-800";

  const getCategoryPill = (category: string) =>
    CONTROL_CATEGORIES.find((c) => c.value === category)?.color ||
    "bg-gray-100 text-gray-800";

  const getOwnerName = (id: string) => {
    const e = employees.find((x) => x.id === id);
    // El store usa employee.name (no first/last), así que usamos name si existe.
    return e ? e.name || `${(e as any).firstName ?? ""} ${(e as any).lastName ?? ""}`.trim() : "No asignado";
  };

  const calcNextTest = (from: string, freqValue: string) => {
    const freq = TEST_FREQUENCIES.find((f) => f.value === freqValue);
    if (!from || !freq) return "";
    const base = new Date(from);
    const next = new Date(base);
    next.setMonth(next.getMonth() + freq.months);
    return toISODate(next);
  };

  // Datos filtrados
  const filtered = useMemo(() => {
    return controls.filter((c) => {
      const text = `${c.title} ${c.description} ${c.framework} ${c.category} ${getOwnerName(c.owner)}`.toLowerCase();
      if (filters.search && !text.includes(filters.search.toLowerCase())) return false;
      if (filters.framework !== "all" && c.framework !== filters.framework) return false;
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (filters.owner !== "all" && c.owner !== filters.owner) return false;
      if (filters.category !== "all" && c.category !== filters.category) return false;
      return true;
    });
  }, [controls, filters]);

  // Stats simples
  const stats = useMemo(() => {
    const total = controls.length;
    const effective = controls.filter((c) => c.status === "effective").length;
    const implemented = controls.filter((c) => c.status === "implemented").length;
    const pending = controls.filter(
      (c) => c.status === "not_implemented" || c.status === "partially_implemented"
    ).length;
    return { total, effective, implemented, pending };
  }, [controls]);

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const id = selectedControl?.id ?? `${Date.now()}`;

    const payload = {
      id,
      title: form.title.trim(),
      description: form.description.trim(),
      framework: form.framework,
      category: form.category,
      owner: form.owner,
      status: form.status,
      effectiveness: clamp(Number(form.effectiveness), 0, 100),
      testFrequency: form.testFrequency,
      lastTestDate: form.lastTestDate ? new Date(form.lastTestDate) : undefined,
      nextTestDate: form.nextTestDate ? new Date(form.nextTestDate) : undefined,
      evidence: form.evidence,
      relatedRisks: form.relatedRisks,
      // timestamps
      createdAt: selectedControl?.createdAt ?? now,
      updatedAt: now,
    };

    // Validaciones mínimas
    if (!payload.title) return alert("El título es obligatorio.");
    if (!payload.description) return alert("La descripción es obligatoria.");
    if (!payload.owner) return alert("Selecciona un responsable.");
    if (!employees.find((e) => e.id === payload.owner)) {
      return alert("El responsable seleccionado no existe.");
    }

    if (selectedControl) {
      updateControl(id, payload);
    } else {
      addControl(payload as any);
    }

    setShowForm(false);
    setSelectedId(null);
  };

  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, isNaN(n) ? min : n));

  const resetFilters = () =>
    setFilters({ search: "", framework: "all", status: "all", owner: "all", category: "all" });

  // UI
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Controles</h1>
          <p className="mt-2 text-gray-600">
            Define, implementa y verifica controles para tus marcos de cumplimiento
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedId(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Control
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Layers3 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Controles</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Efectivos</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.effective}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-sky-100 text-sky-600">
              <Wrench className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Implementados</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.implemented}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar controles..."
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${
            showFilters
              ? "border-blue-300 text-blue-700 bg-blue-50"
              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
              <select
                value={filters.framework}
                onChange={(e) => setFilters((p) => ({ ...p, framework: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                {FRAMEWORKS.map((fw) => (
                  <option key={fw} value={fw}>{fw}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                {CONTROL_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                {CONTROL_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
              <select
                value={filters.owner}
                onChange={(e) => setFilters((p) => ({ ...p, owner: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name || `${(e as any).firstName ?? ""} ${(e as any).lastName ?? ""}`.trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Table/List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Control</Th>
                <Th>Framework</Th>
                <Th>Estado</Th>
                <Th>Responsable</Th>
                <Th>Categoría</Th>
                <Th>Efectividad</Th>
                <Th>Próxima Prueba</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{c.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-2 max-w-md">{c.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.framework}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(c.status)}`}>
                      {CONTROL_STATUSES.find((s) => s.value === c.status)?.label ?? c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getOwnerName(c.owner)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryPill(c.category)}`}>
                      {CONTROL_CATEGORIES.find((x) => x.value === c.category)?.label ?? c.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-gray-200 rounded">
                        <div
                          className={`h-2 rounded ${c.effectiveness >= 75 ? "bg-green-500" : c.effectiveness >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${Math.max(0, Math.min(100, Number(c.effectiveness ?? 0)))}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(Number(c.effectiveness ?? 0))}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-gray-500" />
                      <span>
                        {c.nextTestDate ? new Date(c.nextTestDate).toLocaleDateString("es-ES") : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => alert("Ver detalles - Por implementar")}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("¿Eliminar este control?")) deleteControl(c.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileCheck2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron controles</h3>
            <p className="mt-1 text-sm text-gray-500">Crea tu primer control para comenzar.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSelectedId(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Control
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center">
            <div className="fixed inset-0 bg-black/40" onClick={() => { setShowForm(false); setSelectedId(null); }} />
            <div className="relative inline-block w-full max-w-3xl align-middle rounded-lg bg-white text-left shadow-xl">
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedControl ? "Editar Control" : "Nuevo Control"}
                    </h3>
                  </div>
                  <button type="button" onClick={() => { setShowForm(false); setSelectedId(null); }} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Control de acceso lógico"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                      <textarea
                        required
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe el objetivo, alcance y procedimiento del control..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
                      <select
                        value={form.framework}
                        onChange={(e) => setForm((p) => ({ ...p, framework: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {FRAMEWORKS.map((fw) => (
                          <option key={fw} value={fw}>{fw}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as ControlCategory }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CONTROL_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Responsable *</label>
                      <select
                        required
                        value={form.owner}
                        onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar empleado</option>
                        {employees.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name || `${(e as any).firstName ?? ""} ${(e as any).lastName ?? ""}`.trim()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ControlStatus }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CONTROL_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Efectividad (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={form.effectiveness}
                        onChange={(e) => setForm((p) => ({ ...p, effectiveness: clamp(Number(e.target.value), 0, 100) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia de prueba</label>
                      <select
                        value={form.testFrequency}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => {
                            const next = calcNextTest(p.lastTestDate || toISODate(new Date()), v);
                            return { ...p, testFrequency: v, nextTestDate: next || p.nextTestDate };
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {TEST_FREQUENCIES.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Última prueba</label>
                      <input
                        type="date"
                        value={form.lastTestDate}
                        onChange={(e) =>
                          setForm((p) => {
                            const v = e.target.value;
                            const next = calcNextTest(v, p.testFrequency);
                            return { ...p, lastTestDate: v, nextTestDate: next };
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Próxima prueba</label>
                      <input
                        type="date"
                        value={form.nextTestDate}
                        onChange={(e) => setForm((p) => ({ ...p, nextTestDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Evidencia (IDs/URLs separadas por coma)</label>
                      <input
                        type="text"
                        value={form.evidence.join(", ")}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            evidence: e.target.value
                              .split(",")
                              .map((x) => x.trim())
                              .filter(Boolean),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="evidence-123, https://repo/evidence/456"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setSelectedId(null); }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {selectedControl ? "Actualizar" : "Crear"} Control
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Pequeño helper para <th>
const Th: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className ?? ""}`}>
    {children}
  </th>
);

export default ControlsPage;
