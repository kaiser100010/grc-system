import React, { useEffect, useState } from "react";
import { User, Mail, Shield, LogOut, Save, Moon, Sun } from "lucide-react";
import { useAppStore } from "../../../store/appStore";
import { Link } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser, logout, theme, setTheme } = useAppStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">No hay sesión activa</h2>
          <p className="text-gray-600 mt-2">Inicia sesión para ver tu perfil.</p>
          <Link
            to="/login"
            className="inline-block mt-6 px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(form);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="mt-2 text-gray-600">Gestiona tus datos de usuario y preferencias.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-50"
            title="Cambiar tema"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            Tema: {theme === "light" ? "Claro" : "Oscuro"}
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-50"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                  <User className="h-4 w-4 text-gray-500" />
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                  <Mail className="h-4 w-4 text-gray-500" />
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                  <Shield className="h-4 w-4 text-gray-500" />
                </span>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Administrador, Auditor, etc."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
