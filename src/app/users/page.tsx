'use client';

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { Footer } from "@/components/layout/dashboard/Footer";
import { useLayoutStore } from "@/store/layoutStore";
import { cn } from "@/lib/utils";
import {
  Users as UsersIcon,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager' | 'super user';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function UsersPage() {
  const { isSidebarCollapsed } = useLayoutStore();
  const { data: session } = useSession();
  const isSuperUser = (session?.user as any)?.role === 'super user';

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Form Fields
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<'user' | 'admin' | 'manager' | 'super user'>("user");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editIsVerified, setEditIsVerified] = useState(true);

  // Delete Modal State
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Action Loading State (per user ID)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: search.trim(),
        role: roleFilter,
        page: page.toString(),
        limit: "10"
      });

      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not load users list");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Quick Toggle Verification Button
  const handleToggleVerified = async (user: UserItem) => {
    setActionLoadingId(user._id);
    const newVerifiedState = !user.isVerified;

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: newVerifiedState })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update verification state");
      }

      toast.success(
        newVerifiedState
          ? `User "${user.name}" marked as Verified!`
          : `User "${user.name}" marked as Unverified.`
      );

      // Update state locally
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isVerified: newVerifiedState } : u));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update verification status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role || "user");
    setEditIsActive(user.isActive !== false);
    setEditIsVerified(user.isVerified !== false);
    setIsEditOpen(true);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${editingUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          isActive: editIsActive,
          isVerified: editIsVerified
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      const updated = await res.json();
      toast.success(`User "${updated.name || editName}" updated successfully.`);

      setIsEditOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save user changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle User Deletion
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/users/${deletingUser._id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      toast.success(`User "${deletingUser.name}" was deleted.`);
      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // Role Badge Color Helper
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super user':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <ShieldAlert className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" />
            Super User
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <ShieldCheck className="w-3 h-3 mr-1 text-rose-600 dark:text-rose-400" />
            Admin
          </span>
        );
      case 'manager':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            User
          </span>
        );
    }
  };

  // Initials Avatar Helper
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // User Stats Calculation
  const verifiedCount = users.filter(u => u.isVerified).length;
  const adminManagerCount = users.filter(u => u.role === 'admin' || u.role === 'manager' || u.role === 'super user').length;
  const activeCount = users.filter(u => u.isActive !== false).length;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Header />
      <Sidebar />

      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="p-8 max-w-[1440px] mx-auto w-full flex-1 font-sans">

          {/* Header & Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">User Management</h1>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium ml-11">
                View, filter, edit roles, and manage verification status for registered users.
              </p>
            </div>

            <Button
              onClick={fetchUsers}
              variant="outline"
              className="self-start md:self-auto gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Refresh Users
            </Button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Users</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">{total}</span>
                <UsersIcon className="w-5 h-5 text-primary opacity-80" />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Verified Users</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{verifiedCount}</span>
                <UserCheck className="w-5 h-5 text-emerald-500 opacity-80" />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Admins & Managers</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400">{adminManagerCount}</span>
                <ShieldCheck className="w-5 h-5 text-purple-500 opacity-80" />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Active Accounts</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{activeCount}</span>
                <CheckCircle2 className="w-5 h-5 text-blue-500 opacity-80" />
              </div>
            </div>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

              {/* Search Bar */}
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-xs transition-all"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); setPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Role Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-xs cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super user">Super User</option>
                </select>
              </div>

              {(search || roleFilter !== 'all') && (
                <button
                  onClick={() => { setSearch(""); setRoleFilter("all"); setPage(1); }}
                  className="text-xs text-primary font-bold hover:underline px-2 py-1"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    <th className="p-4 pl-6 font-medium whitespace-nowrap">User</th>
                    <th className="p-4 font-medium whitespace-nowrap">Role</th>
                    <th className="p-4 font-medium whitespace-nowrap">Verification</th>
                    <th className="p-4 font-medium whitespace-nowrap">Status</th>
                    <th className="p-4 font-medium whitespace-nowrap">Joined Date</th>
                    {isSuperUser && (
                      <th className="p-4 pr-6 font-medium whitespace-nowrap text-right">Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {loading ? (
                    <tr>
                      <td colSpan={isSuperUser ? 6 : 5} className="p-12 text-center text-zinc-500">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          <p className="text-sm font-medium">Loading user list...</p>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={isSuperUser ? 6 : 5} className="p-12 text-center text-zinc-500">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <UserX className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                          <p className="text-base font-bold text-zinc-700 dark:text-zinc-300">No users found</p>
                          <p className="text-xs text-zinc-400 max-w-sm">Try adjusting your search criteria or role filter to find registered accounts.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors group">

                        {/* User Identity Column */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                              {getInitials(user.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                                {user.name}
                              </span>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td className="p-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>

                        {/* Verification Column */}
                        <td className="p-4 whitespace-nowrap">
                          {user.isVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              <XCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              Unverified
                            </span>
                          )}
                        </td>

                        {/* Account Status Column */}
                        <td className="p-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              user.isActive !== false ? "bg-emerald-500" : "bg-zinc-400"
                            )} />
                            <span className={user.isActive !== false ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400"}>
                              {user.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </span>
                        </td>

                        {/* Joined Date Column */}
                        <td className="p-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </td>

                        {/* Actions Column (Visible only for Super User) */}
                        {isSuperUser && (
                          <td className="p-4 pr-6 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit User Button */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditModal(user)}
                                className="h-8 px-3 text-xs font-bold gap-1.5 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-xs"
                                title="Edit user details and role"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit
                              </Button>

                              {/* Delete User Button */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeletingUser(user)}
                                className="h-8 px-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {!loading && total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-500 gap-4">
                <div>
                  Showing <span className="text-zinc-900 dark:text-white font-bold">{users.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to <span className="text-zinc-900 dark:text-white font-bold">{Math.min(page * 10, total)}</span> of <span className="text-zinc-900 dark:text-white font-bold">{total}</span> users
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="h-8 text-xs font-bold"
                  >
                    Previous
                  </Button>

                  <span className="px-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Page {page} of {totalPages}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="h-8 text-xs font-bold"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>

      {/* EDIT USER DIALOG MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Edit User Details
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Modify account details, assign role level, and update status flags.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Full Name
              </label>
              <Input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="User's full name"
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
              />
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Role Permission
              </label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="user">User (Standard Access)</option>
                <option value="manager">Manager (Content Approver)</option>
                <option value="admin">Admin (System Administrator)</option>
                <option value="super user">Super User (Full System Access)</option>
              </select>
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isSaving}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="text-xs font-bold gap-2 bg-primary hover:bg-primary/90 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save User Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Confirm User Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 pt-1">
              Are you sure you want to delete <span className="font-bold text-zinc-800 dark:text-zinc-200">{deletingUser?.name}</span> ({deletingUser?.email})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingUser(null)}
              disabled={isDeleting}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="text-xs font-bold gap-2 bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
