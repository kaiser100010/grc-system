import React, { useMemo, useState } from "react";
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, Trash2, Check, Plus } from "lucide-react";
import { useAppStore } from "../../../store/appStore";

type Filter = "all" | "unread" | "info" | "warning" | "success" | "error";

const typeMeta: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
  info: { icon: <Info className="h-4 w-4" />, cls: "bg-blue-100 text-blue-800", label: "Info" },
  warning: { icon: <AlertTriangle className="h-4 w-4" />, cls: "bg-yellow-100 text-yellow-800", label: "Aviso" },
  success: { icon: <CheckCircle className="h-4 w-4" />, cls: "bg-green-100 text-green-800", label: "Éxito" },
  error: { icon: <XCircle className="h-4 w-4" />, cls: "bg-red-100 text-red-800", label: "Error" },
};

const NotificationsPage: React.FC = () => {
  const { notifications, addNotification, markNotificationAsRead, deleteNotification, clearNotifications } =
    useAppStore();

  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    return [...notifications]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .filter((n) => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.read;
        return n.type === filter;
      });
  }, [notifications, filter]);

  const addSamples = () => {
    const now = new Date().toISOString();
    const base = [
      { type: "info", title: "Bienvenido", message: "Has iniciado sesión correctamente." },
      { type: "warning", title: "Vencimiento próximo", message: "Una política está por vencer." },
      { type: "success", title: "Control verificado", message: "El test del control CA-01 fue exitoso." },
      { type: "error", title: "Incidente crítico", message: "Se detectó alerta en servidor de BBDD." },
    ] as const;

    base.forEach((b, i) =>
      addNotification({
        id: `${Date.now()}_${i}`,
        type: b.type as any,
        title: b.title,
        message: b.message,
        userId: "system",
        read: false,
        createdAt: new Date(now),
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
          <p className="mt-2 text-gray-600">Mensajes del sistema y alertas de cumplimiento.</p>
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
            onClick={() => clearNotifications()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-50"
          >
            <Trash2 className="h-4 w-4" />
            Vaciar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-2">
        {(["all", "unread", "info", "warning", "success", "error"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm border ${
              filter === f ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f === "all"
              ? "Todas"
              : f === "unread"
              ? "No leídas"
              : typeMeta[f].label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-white rounded-lg shadow divide-y">
        {list.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No hay notificaciones.</div>
        ) : (
          list.map((n) => (
            <div key={n.id} className="p-4 flex items-start gap-4">
              <div className="pt-1">
                <Bell className={`h-5 w-5 ${n.read ? "text-gray-400" : "text-blue-500"}`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeMeta[n.type].cls}`}>
                    {typeMeta[n.type].icon}
                    {typeMeta[n.type].label}
                  </span>
                  {!n.read && <span className="text-xs text-blue-600">● nuevo</span>}
                </div>
                <h3 className="mt-1 font-semibold text-gray-900">{n.title}</h3>
                <p className="text-gray-700">{n.message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!n.read && (
                  <button
                    onClick={() => markNotificationAsRead(n.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-sm text-gray-700 hover:bg-gray-50"
                    title="Marcar como leída"
                  >
                    <Check className="h-4 w-4" />
                    Leer
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-sm text-red-700 hover:bg-red-50"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
