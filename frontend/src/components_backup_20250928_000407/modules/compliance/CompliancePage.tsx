import React, { useMemo } from "react";
import { useAppStore } from "../../../store/appStore";
import { Shield, CheckCircle, FileText, AlertTriangle, TrendingUp } from "lucide-react";

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; sub?: string }> = ({
  icon,
  title,
  value,
  sub,
}) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-full bg-blue-50 text-blue-600">{icon}</div>
      <div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
      </div>
    </div>
  </div>
);

const CompliancePage: React.FC = () => {
  const { controls, policies, incidents, risks } = useAppStore();

  const stats = useMemo(() => {
    const ctrlTotal = controls.length;
    const ctrlImpl = controls.filter((c) => c.status === "implemented" || c.status === "effective").length;
    const ctrlEff = controls.filter((c) => c.status === "effective").length;

    const polPublished = policies.filter((p) => p.status === "published" || p.status === "approved").length;

    const incOpen = incidents.filter((i) => i.status === "open" || i.status === "investigating").length;

    const riskAvg = risks.length
      ? (risks.reduce((acc, r) => acc + (r.score ?? r.probability * r.impact), 0) / risks.length).toFixed(1)
      : "0.0";

    return { ctrlTotal, ctrlImpl, ctrlEff, polPublished, incOpen, riskAvg };
  }, [controls, policies, incidents, risks]);

  const controlRows = useMemo(() => {
    const mapColor: Record<string, string> = {
      not_implemented: "bg-gray-100 text-gray-800",
      partially_implemented: "bg-yellow-100 text-yellow-800",
      implemented: "bg-blue-100 text-blue-800",
      effective: "bg-green-100 text-green-800",
    };
    return controls.slice(0, 10).map((c) => ({
      ...c,
      pill: mapColor[c.status],
      statusLabel:
        c.status === "not_implemented"
          ? "No implementado"
          : c.status === "partially_implemented"
          ? "Parcial"
          : c.status === "implemented"
          ? "Implementado"
          : "Efectivo",
    }));
  }, [controls]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cumplimiento</h1>
        <p className="mt-2 text-gray-600">
          Resumen de estado de controles, políticas, incidentes y nivel de riesgo.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon={<Shield className="h-6 w-6" />} title="Controles" value={stats.ctrlTotal} sub={`${stats.ctrlImpl} implementados`} />
        <StatCard icon={<CheckCircle className="h-6 w-6" />} title="Efectivos" value={stats.ctrlEff} sub="Controles efectivos" />
        <StatCard icon={<FileText className="h-6 w-6" />} title="Políticas publicadas" value={stats.polPublished} />
        <StatCard icon={<AlertTriangle className="h-6 w-6" />} title="Incidentes abiertos" value={stats.incOpen} />
        <StatCard icon={<TrendingUp className="h-6 w-6" />} title="Riesgo promedio" value={stats.riskAvg} />
      </div>

      {/* Tabla de controles (Top 10) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Controles (Top 10)</h2>
          <span className="text-sm text-gray-500">Total: {controls.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Título</Th>
                <Th>Framework</Th>
                <Th>Categoría</Th>
                <Th>Responsable</Th>
                <Th>Estado</Th>
                <Th>Próx. test</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {controlRows.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.framework}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.ownerName ?? c.owner}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${c.pill}`}>{c.statusLabel}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {c.nextTestDate ? new Date(c.nextTestDate).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
              {controlRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    Sin controles por mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Th: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className ?? ""}`}>
    {children}
  </th>
);

export default CompliancePage;
