import { useEffect, useState } from "react";
import { Users, Plus, Trash2, Shield, Eye, EyeOff } from "lucide-react";
import { Card, Button, Badge, Modal, Input, Select, EmptyState, LoadingSpinner } from "../components/ui";
import api from "../api/client";

// WHY USER MANAGEMENT?
// In a real organization, multiple people need access:
// - Admins: full control (create/delete everything)
// - Operators: can deploy policies but not delete devices
// - Viewers: read-only, can see dashboards and logs
// This is called RBAC — Role Based Access Control.
// Industry standard in every enterprise security product.

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  createdAt: string;
}

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "operator" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) return setError("All fields required");
    setSaving(true); setError("");
    try {
      await api.post("/auth/register", form);
      setModalOpen(false);
      setForm({ name: "", email: "", password: "", role: "operator" });
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    load();
  };

  const roleColor = (role: string) => {
    if (role === "admin") return "danger";
    if (role === "operator") return "info";
    return "neutral";
  };

  const roleIcon = (role: string) => {
    if (role === "admin") return "👑";
    if (role === "operator") return "⚙️";
    return "👁️";
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Control who has access and what they can do (RBAC)</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" />Add User</Button>
      </div>

      {/* Role explanation */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { role: "Admin", icon: "👑", color: "red", desc: "Full access — create, edit, delete everything" },
          { role: "Operator", icon: "⚙️", color: "blue", desc: "Can deploy policies and manage devices" },
          { role: "Viewer", icon: "👁️", color: "gray", desc: "Read-only access to dashboards and logs" },
        ].map((r) => (
          <Card key={r.role} className="text-center">
            <div className="text-2xl mb-2">{r.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{r.role}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.desc}</p>
          </Card>
        ))}
      </div>

      {users.length === 0 ? (
        <Card>
          <EmptyState icon={<Users className="w-12 h-12" />} title="No users yet"
            description="Add team members with specific roles to control access."
            action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" />Add User</Button>} />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">{users.length} Users</h2>
            <Shield className="w-4 h-4 text-gray-400" />
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{roleIcon(user.role)}</span>
                  <Badge variant={roleColor(user.role) as any}>{user.role}</Badge>
                  <p className="text-xs text-gray-400 hidden md:block">{new Date(user.createdAt).toLocaleDateString()}</p>
                  <button onClick={() => handleDelete(user.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setError(""); }} title="Add New User"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleCreate} loading={saving}>Create User</Button></>}>
        <div className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" placeholder="john@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 pr-10 rounded-lg border text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={[{ value: "admin", label: "👑 Admin — Full Access" }, { value: "operator", label: "⚙️ Operator — Deploy & Manage" }, { value: "viewer", label: "👁️ Viewer — Read Only" }]} />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </Modal>
    </div>
  );
};