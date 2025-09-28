import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAppStore } from "../../../store/appStore";
import {
  Home,
  ShieldCheck,
  AlertTriangle,
  CheckSquare,
  ClipboardList,
  FileText,
  Bell,
  Users,
  Briefcase,
  Server,
  Box,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  History,
  FileCheck,   // ← Evidencia
  User,        // ← Perfil
} from "lucide-react";

const Layout: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const sidebarWidth = sidebarCollapsed ? 80 : 256; // 5rem / 16rem

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar (sticky, no solapa) */}
      <aside
        className="border-r bg-white flex flex-col"
        style={{
          width: sidebarWidth,
          transition: "width 200ms ease-in-out",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Header del sidebar */}
        <div className="h-14 border-b flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-blue-600" />
            {!sidebarCollapsed && <span className="font-semibold">Omnishield GRC Management tool</span>}
          </div>
        <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-gray-100"
            title={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navegación */}
        <nav className="p-2 space-y-1 overflow-y-auto flex-1">
          <Item to="/dashboard" icon={<Home />} title="Dashboard" collapsed={sidebarCollapsed} />

          {!sidebarCollapsed && <Section title="Gobernanza" />}
          <Item to="/risks" icon={<AlertTriangle />} title="Riesgos" collapsed={sidebarCollapsed} />
          <Item to="/controls" icon={<ShieldCheck />} title="Controles" collapsed={sidebarCollapsed} />
          <Item to="/policies" icon={<FileText />} title="Políticas" collapsed={sidebarCollapsed} />
          <Item to="/compliance" icon={<CheckSquare />} title="Cumplimiento" collapsed={sidebarCollapsed} />

          {!sidebarCollapsed && <Section title="Operaciones" />}
          <Item to="/tasks" icon={<ClipboardList />} title="Tareas" collapsed={sidebarCollapsed} />
          <Item to="/incidents" icon={<AlertTriangle />} title="Incidentes" collapsed={sidebarCollapsed} />
          <Item to="/evidence" icon={<FileCheck />} title="Evidencia" collapsed={sidebarCollapsed} /> {/* ← nuevo */}

          {!sidebarCollapsed && <Section title="Recursos" />}
          <Item to="/employees" icon={<Users />} title="Empleados" collapsed={sidebarCollapsed} />
          <Item to="/vendors" icon={<Briefcase />} title="Proveedores" collapsed={sidebarCollapsed} />
          <Item to="/systems" icon={<Server />} title="Sistemas" collapsed={sidebarCollapsed} />
          <Item to="/assets" icon={<Box />} title="Activos" collapsed={sidebarCollapsed} />

          {!sidebarCollapsed && <Section title="Otros" />}
          <Item to="/reports" icon={<BarChart3 />} title="Reportes" collapsed={sidebarCollapsed} />
          <Item to="/audits" icon={<History />} title="Auditorías" collapsed={sidebarCollapsed} />
          <Item to="/notifications" icon={<Bell />} title="Notificaciones" collapsed={sidebarCollapsed} />
          <Item to="/profile" icon={<User />} title="Perfil" collapsed={sidebarCollapsed} /> {/* ← nuevo */}
          <Item to="/settings" icon={<Settings />} title="Configuración" collapsed={sidebarCollapsed} />
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="font-medium text-gray-700">Panel de cumplimiento y riesgos</div>
          <div className="flex items-center gap-3" />
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const Item: React.FC<{ to: string; icon: React.ReactNode; title: string; collapsed: boolean }> = ({
  to,
  icon,
  title,
  collapsed,
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-sm ${
        isActive ? "bg-blue-50 text-blue-700" : "text-gray-700"
      }`
    }
  >
    <span className="shrink-0 text-gray-600">{icon}</span>
    {!collapsed && <span className="truncate">{title}</span>}
  </NavLink>
);

const Section: React.FC<{ title: string }> = ({ title }) => (
  <div className="px-3 pt-3 text-xs font-semibold uppercase text-gray-400">{title}</div>
);

export default Layout;
