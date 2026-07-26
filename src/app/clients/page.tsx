'use client';

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { Footer } from "@/components/layout/dashboard/Footer";
import { useLayoutStore } from "@/store/layoutStore";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Edit3,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Globe,
  Phone,
  Building2,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Maximize2,
  UserPlus,
  Users,
  Mail,
  Trash2,
  Copy,
  Check
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
import Restricted from "@/components/shared/layout/Restricted";

interface ClientItem {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  status: 'active' | 'inactive' | 'disabled';
  notes?: string;
  systemPrompt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface AssignedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface PendingInvite {
  _id: string;
  email: string;
  token: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export default function ClientsPage() {
  const { isSidebarCollapsed } = useLayoutStore();
  const { data: session, status: sessionStatus } = useSession();
  const isSuperUser = (session?.user as any)?.role === 'super user';

  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Add Client Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [addName, setAddName] = useState("");
  const [addCompany, setAddCompany] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addWebsite, setAddWebsite] = useState("");
  const [addStatus, setAddStatus] = useState<'active' | 'inactive' | 'disabled'>("active");
  const [addNotes, setAddNotes] = useState("");
  const [addSystemPrompt, setAddSystemPrompt] = useState("");

  // Edit Client Modal State
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'disabled'>("active");
  const [editNotes, setEditNotes] = useState("");
  const [editSystemPrompt, setEditSystemPrompt] = useState("");

  // Enlarged Prompt Editor Modal State
  const [enlargedPromptState, setEnlargedPromptState] = useState<{
    isOpen: boolean;
    type: 'add' | 'edit';
    value: string;
  }>({ isOpen: false, type: 'add', value: '' });

  // Manage Client Users & Invites Modal State
  const [selectedClientForUsers, setSelectedClientForUsers] = useState<ClientItem | null>(null);
  const [clientUsers, setClientUsers] = useState<AssignedUser[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<'user' | 'manager'>("user");
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isInvitingUser, setIsInvitingUser] = useState(false);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  // Disable (Soft Delete) Confirmation Modal State
  const [disablingClient, setDisablingClient] = useState<ClientItem | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);

  // Action Loading Id for Quick Re-enable
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Fetch Clients
  const fetchClients = useCallback(async () => {
    if (!isSuperUser) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: search.trim(),
        status: statusFilter,
        page: page.toString(),
        limit: "10"
      });

      const res = await fetch(`/api/clients?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data = await res.json();
      setClients(data.clients || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not load clients list");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, isSuperUser]);

  useEffect(() => {
    if (isSuperUser) {
      fetchClients();
    }
  }, [fetchClients, isSuperUser]);

  // Submit New Client
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName,
          company: addCompany,
          email: addEmail,
          phone: addPhone,
          website: addWebsite,
          status: addStatus,
          notes: addNotes,
          systemPrompt: addSystemPrompt
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create client");
      }

      const created = await res.json();
      toast.success(`Client "${created.company}" created successfully!`);

      // Reset Form & Close
      setAddName("");
      setAddCompany("");
      setAddEmail("");
      setAddPhone("");
      setAddWebsite("");
      setAddStatus("active");
      setAddNotes("");
      setAddSystemPrompt("");
      setIsAddOpen(false);

      fetchClients();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create client");
    } finally {
      setIsCreating(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (client: ClientItem) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditCompany(client.company);
    setEditEmail(client.email);
    setEditPhone(client.phone || "");
    setEditWebsite(client.website || "");
    setEditStatus(client.status || "active");
    setEditNotes(client.notes || "");
    setEditSystemPrompt(client.systemPrompt || "");
    setIsEditOpen(true);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/clients/${editingClient._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          company: editCompany,
          email: editEmail,
          phone: editPhone,
          website: editWebsite,
          status: editStatus,
          notes: editNotes,
          systemPrompt: editSystemPrompt
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update client");
      }

      const updated = await res.json();
      toast.success(`Client "${updated.company}" updated successfully.`);

      setIsEditOpen(false);
      setEditingClient(null);
      fetchClients();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update client");
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch users & pending invitations for a specific client
  const fetchClientUsers = async (clientId: string) => {
    setIsFetchingUsers(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/users`);
      if (!res.ok) throw new Error("Failed to fetch client users");
      const data = await res.json();
      setClientUsers(data.users || []);
      setPendingInvitations(data.pendingInvitations || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not load client users");
    } finally {
      setIsFetchingUsers(false);
    }
  };

  // Open Users Modal
  const openUsersModal = (client: ClientItem) => {
    setSelectedClientForUsers(client);
    setInviteEmail("");
    fetchClientUsers(client._id);
  };

  // Send Email Invite or Direct Add
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForUsers || !inviteEmail.trim()) return;

    setIsInvitingUser(true);
    try {
      const res = await fetch(`/api/clients/${selectedClientForUsers._id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process invitation");
      }

      toast.success(data.message || "Invitation processed successfully!");
      setInviteEmail("");
      fetchClientUsers(selectedClientForUsers._id);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to invite user");
    } finally {
      setIsInvitingUser(false);
    }
  };

  // Remove assigned user from client
  const handleRemoveUserFromClient = async (userId: string) => {
    if (!selectedClientForUsers) return;
    try {
      const res = await fetch(`/api/clients/${selectedClientForUsers._id}/users?userId=${userId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to remove user");
      toast.success("User removed from client");
      fetchClientUsers(selectedClientForUsers._id);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to remove user");
    }
  };

  // Cancel pending invitation
  const handleCancelInvitation = async (invitationId: string) => {
    if (!selectedClientForUsers) return;
    try {
      const res = await fetch(`/api/clients/${selectedClientForUsers._id}/users?invitationId=${invitationId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to cancel invitation");
      toast.success("Invitation canceled");
      fetchClientUsers(selectedClientForUsers._id);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to cancel invitation");
    }
  };

  // Copy invitation link
  const handleCopyInviteLink = (token: string, id: string) => {
    const inviteUrl = `${window.location.origin}/auth/signup?inviteToken=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedTokenId(id);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  // Confirm Soft-Delete / Disable Client
  const handleDisableClient = async () => {
    if (!disablingClient) return;
    setIsDisabling(true);

    try {
      const res = await fetch(`/api/clients/${disablingClient._id}`, {
        method: "DELETE" // DELETE endpoint updates status to 'disabled'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to disable client");
      }

      toast.success(`Client "${disablingClient.company}" disabled successfully.`);
      setDisablingClient(null);
      fetchClients();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to disable client");
    } finally {
      setIsDisabling(false);
    }
  };

  // Quick Re-enable Client
  const handleReenableClient = async (client: ClientItem) => {
    setActionLoadingId(client._id);

    try {
      const res = await fetch(`/api/clients/${client._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 'active' })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to enable client");
      }

      toast.success(`Client "${client.company}" is now Active.`);
      fetchClients();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to enable client");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Initials Helper
  const getInitials = (text: string) => {
    if (!text) return "CL";
    const parts = text.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return text.substring(0, 2).toUpperCase();
  };

  // Metrics Count
  const activeCount = clients.filter(c => c.status === 'active').length;
  const disabledCount = clients.filter(c => c.status === 'disabled').length;
  const inactiveCount = clients.filter(c => c.status === 'inactive').length;

  // Access Guard check while checking session
  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // If Not Super User, render Access Denied guard
  if (!isSuperUser) {
    return (
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <Header />
        <Sidebar />
        <main className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16",
          isSidebarCollapsed ? "ml-20" : "ml-64"
        )}>
          <Restricted />
          <Footer />
        </main>
      </div>
    );
  }

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
                  <Briefcase className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Clients Directory</h1>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium ml-11">
                Manage registered client accounts, view details, add new clients, or disable client access.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Button
                onClick={fetchClients}
                variant="outline"
                className="gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                Refresh
              </Button>

              <Button
                onClick={() => setIsAddOpen(true)}
                className="gap-2 text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add New Client
              </Button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Clients</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">{total}</span>
                <Building2 className="w-5 h-5 text-primary opacity-80" />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Active Clients</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{activeCount}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-80" />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Inactive Clients</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{inactiveCount}</span>
                <AlertTriangle className="w-5 h-5 text-amber-500 opacity-80" />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Disabled Clients</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-rose-600 dark:text-rose-400">{disabledCount}</span>
                <Ban className="w-5 h-5 text-rose-500 opacity-80" />
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
                  placeholder="Search by client name, company, email..."
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

              {/* Status Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-xs cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {(search || statusFilter !== 'all') && (
                <button
                  onClick={() => { setSearch(""); setStatusFilter("all"); setPage(1); }}
                  className="text-xs text-primary font-bold hover:underline px-2 py-1"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Clients Table */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    <th className="p-4 pl-6 font-medium whitespace-nowrap">Company & Client</th>
                    <th className="p-4 font-medium whitespace-nowrap">Contact Details</th>
                    <th className="p-4 font-medium whitespace-nowrap">Website</th>
                    <th className="p-4 font-medium whitespace-nowrap">AI System Prompt</th>
                    <th className="p-4 font-medium whitespace-nowrap">Status</th>
                    <th className="p-4 font-medium whitespace-nowrap">Created Date</th>
                    <th className="p-4 pr-6 font-medium whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-zinc-500">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          <p className="text-sm font-medium">Loading clients list...</p>
                        </div>
                      </td>
                    </tr>
                  ) : clients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-zinc-500">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Briefcase className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                          <p className="text-base font-bold text-zinc-700 dark:text-zinc-300">No clients found</p>
                          <p className="text-xs text-zinc-400 max-w-sm">Try adjusting your search criteria or create a new client.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr
                        key={client._id}
                        className={cn(
                          "transition-colors group",
                          client.status === 'disabled'
                            ? "bg-zinc-50/50 dark:bg-zinc-900/40 opacity-75 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60"
                            : "hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                        )}
                      >

                        {/* Company & Client Column */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                              {getInitials(client.company || client.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className={cn(
                                "text-sm font-bold truncate",
                                client.status === 'disabled'
                                  ? "text-zinc-500 line-through"
                                  : "text-zinc-900 dark:text-white"
                              )}>
                                {client.company}
                              </span>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                Contact: {client.name}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact Details Column */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex flex-col text-xs">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{client.email}</span>
                            {client.phone && (
                              <span className="text-zinc-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-zinc-400" />
                                {client.phone}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Website Column */}
                        <td className="p-4 whitespace-nowrap text-xs">
                          {client.website ? (
                            <a
                              href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              {client.website.replace(/^https?:\/\//, '')}
                            </a>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>

                        {/* AI System Prompt Column */}
                        <td className="p-4 text-xs max-w-[200px]">
                          {client.systemPrompt ? (
                            <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-2.5 py-1 rounded-lg truncate" title={client.systemPrompt}>
                              <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                              <span className="truncate">{client.systemPrompt}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>

                        {/* Status Badge Column */}
                        <td className="p-4 whitespace-nowrap">
                          {client.status === 'active' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              Active
                            </span>
                          )}

                          {client.status === 'inactive' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              Inactive
                            </span>
                          )}

                          {client.status === 'disabled' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                              <Ban className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                              Disabled
                            </span>
                          )}
                        </td>

                        {/* Created Date Column */}
                        <td className="p-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          {client.createdAt ? new Date(client.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </td>

                        {/* Actions Column */}
                        <td className="p-4 pr-6 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">

                            {/* Manage Users Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openUsersModal(client)}
                              className="h-8 px-3 text-xs font-bold gap-1.5 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all shadow-xs"
                              title="Manage client team users & invites"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              Users
                            </Button>

                            {/* Edit Client Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(client)}
                              className="h-8 px-3 text-xs font-bold gap-1.5 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all shadow-xs"
                              title="Edit client details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit
                            </Button>

                            {/* Soft Delete / Disable Button OR Quick Re-enable */}
                            {client.status !== 'disabled' ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDisablingClient(client)}
                                className="h-8 px-3 text-xs font-bold gap-1 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                                title="Disable client account"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                Disable
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={actionLoadingId === client._id}
                                onClick={() => handleReenableClient(client)}
                                className="h-8 px-3 text-xs font-bold gap-1 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-all"
                                title="Re-enable client account"
                              >
                                {actionLoadingId === client._id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Enable
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
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
                  Showing <span className="text-zinc-900 dark:text-white font-bold">{clients.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to <span className="text-zinc-900 dark:text-white font-bold">{Math.min(page * 10, total)}</span> of <span className="text-zinc-900 dark:text-white font-bold">{total}</span> clients
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

      {/* ADD CLIENT DIALOG MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Client
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Create a new client record, contact details, account status, and custom Gemini AI prompt settings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="space-y-5 py-2">

            {/* Grid for basic contact fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Company Name *
                </label>
                <Input
                  type="text"
                  required
                  value={addCompany}
                  onChange={(e) => setAddCompany(e.target.value)}
                  placeholder="Acme Corporation"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Contact Person Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Contact Person Name *
                </label>
                <Input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="contact@acme.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Phone Number
                </label>
                <Input
                  type="text"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Website URL
                </label>
                <Input
                  type="text"
                  value={addWebsite}
                  onChange={(e) => setAddWebsite(e.target.value)}
                  placeholder="https://acme.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Account Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Account Status
                </label>
                <select
                  value={addStatus}
                  onChange={(e) => setAddStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Gemini AI Custom System Prompt Section */}
            <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Gemini AI Custom System Prompt</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEnlargedPromptState({ isOpen: true, type: 'add', value: addSystemPrompt })}
                  className="h-7 px-2.5 text-xs font-bold gap-1.5 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 shadow-2xs"
                  title="Enlarge prompt editor window"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Enlarge
                </Button>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300/80">
                Specify client-specific context or industry rules for Gemini AI responses. For instance, if this client handles food & restaurants, provide food industry guidelines.
              </p>
              <textarea
                value={addSystemPrompt}
                onChange={(e) => setAddSystemPrompt(e.target.value)}
                rows={4}
                placeholder="e.g. This client is in the food & restaurant industry. Tailor all content strategies, keywords, and tone of voice to culinary trends, restaurant dining, foodies, and local food marketing."
                className="w-full p-3 bg-white dark:bg-zinc-900 border border-purple-200 dark:border-purple-800/60 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans resize-y"
              />
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Internal Notes (Optional)
              </label>
              <textarea
                value={addNotes}
                onChange={(e) => setAddNotes(e.target.value)}
                rows={2}
                placeholder="Add any internal notes about this client..."
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary font-sans resize-y"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isCreating}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="text-xs font-bold gap-2 bg-primary hover:bg-primary/90 text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Client"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT CLIENT DIALOG MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Edit Client Details
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Update company information, contact details, account status, and custom Gemini AI prompt settings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-5 py-2">

            {/* Grid for basic contact fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Company Name *
                </label>
                <Input
                  type="text"
                  required
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  placeholder="Acme Corporation"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Contact Person Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Contact Person Name *
                </label>
                <Input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="contact@acme.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Phone Number
                </label>
                <Input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Website URL
                </label>
                <Input
                  type="text"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  placeholder="https://acme.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Account Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Account Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Gemini AI Custom System Prompt Section */}
            <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Gemini AI Custom System Prompt</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEnlargedPromptState({ isOpen: true, type: 'edit', value: editSystemPrompt })}
                  className="h-7 px-2.5 text-xs font-bold gap-1.5 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 shadow-2xs"
                  title="Enlarge prompt editor window"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Enlarge
                </Button>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300/80">
                Specify client-specific context or industry rules for Gemini AI responses. For instance, if this client handles food & restaurants, provide food industry guidelines.
              </p>
              <textarea
                value={editSystemPrompt}
                onChange={(e) => setEditSystemPrompt(e.target.value)}
                rows={4}
                placeholder="e.g. This client is in the food & restaurant industry. Tailor all content strategies, keywords, and tone of voice to culinary trends, restaurant dining, foodies, and local food marketing."
                className="w-full p-3 bg-white dark:bg-zinc-900 border border-purple-200 dark:border-purple-800/60 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans resize-y"
              />
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Internal Notes (Optional)
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                placeholder="Add any internal notes about this client..."
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary font-sans resize-y"
              />
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DISABLE CLIENT CONFIRMATION DIALOG (SOFT DELETE) */}
      <Dialog open={!!disablingClient} onOpenChange={(open) => !open && setDisablingClient(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Ban className="w-5 h-5" />
              Disable Client Account
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 pt-1">
              Disabling <span className="font-bold text-zinc-800 dark:text-zinc-200">{disablingClient?.company}</span> will deactivate their access without deleting historical records. You can re-enable this account at any time.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDisablingClient(null)}
              disabled={isDisabling}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDisableClient}
              disabled={isDisabling}
              className="text-xs font-bold gap-2 bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDisabling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Disabling...
                </>
              ) : (
                "Disable Client"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ENLARGED GEMINI AI PROMPT EDITOR DIALOG */}
      <Dialog
        open={enlargedPromptState.isOpen}
        onOpenChange={(open) => !open && setEnlargedPromptState(prev => ({ ...prev, isOpen: false }))}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Enlarged Gemini AI Prompt Editor
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Expand your view to write and edit comprehensive system prompt instructions, brand guidelines, or industry rules for Gemini AI.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 py-3">
            <textarea
              value={enlargedPromptState.value}
              onChange={(e) => setEnlargedPromptState(prev => ({ ...prev, value: e.target.value }))}
              rows={14}
              placeholder="e.g. This client is in the food & restaurant industry. Tailor all content strategies, keywords, and tone of voice to culinary trends, restaurant dining, foodies, and local food marketing..."
              className="w-full h-[400px] p-4 bg-zinc-50 dark:bg-zinc-950 border border-purple-200 dark:border-purple-900/70 rounded-xl text-sm font-sans text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed resize-none shadow-inner"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-zinc-100 dark:border-zinc-800 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEnlargedPromptState(prev => ({ ...prev, isOpen: false }))}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (enlargedPromptState.type === 'add') {
                  setAddSystemPrompt(enlargedPromptState.value);
                } else {
                  setEditSystemPrompt(enlargedPromptState.value);
                }
                setEnlargedPromptState(prev => ({ ...prev, isOpen: false }));
                toast.success("Prompt saved to client form!");
              }}
              className="text-xs font-bold gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
            >
              Save Prompt & Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MANAGE CLIENT USERS & EMAIL INVITATIONS DIALOG */}
      <Dialog
        open={!!selectedClientForUsers}
        onOpenChange={(open) => !open && setSelectedClientForUsers(null)}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Manage Users for {selectedClientForUsers?.company}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Attach existing users directly or send an email invitation link to new users for automatic registration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">

            {/* Invite User Box */}
            <div className="p-4 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-purple-950 dark:text-purple-300 font-bold text-sm">
                <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Invite / Add User to Client</span>
              </div>
              <p className="text-xs text-purple-800 dark:text-purple-300/80">
                Enter an email address. If the user is already registered with Butterscribe, they will be attached to <strong>{selectedClientForUsers?.company}</strong> immediately. Otherwise, a unique email link will be sent to complete registration.
              </p>

              <form onSubmit={handleInviteUser} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <div className="relative flex-1 w-full">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="pl-9 bg-white dark:bg-zinc-900 border-purple-200 dark:border-purple-800 text-sm"
                  />
                </div>
                
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'user' | 'manager')}
                  className="h-10 px-3 bg-white dark:bg-zinc-900 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-bold text-purple-900 dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shrink-0 w-full sm:w-auto"
                >
                  <option value="user">User Role</option>
                  <option value="manager">Manager Role</option>
                </select>

                <Button
                  type="submit"
                  disabled={isInvitingUser}
                  className="gap-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shrink-0 w-full sm:w-auto"
                >
                  {isInvitingUser ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      Add / Invite User
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Section 1: Assigned Users */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Assigned Team Members ({clientUsers.length})
                </h3>
                {isFetchingUsers && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              </div>

              {clientUsers.length === 0 ? (
                <div className="p-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-xs text-zinc-400">
                  No users currently assigned to this client. Use the field above to add or invite team members.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50/40 dark:bg-zinc-900/40">
                  {clientUsers.map((user) => (
                    <div key={user._id} className="p-3 px-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
                          {user.role || 'user'}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveUserFromClient(user._id)}
                          className="h-7 px-2 text-xs text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Remove user from client"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Pending Email Invitations */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                Pending Email Invitations ({pendingInvitations.length})
              </h3>

              {pendingInvitations.length === 0 ? (
                <div className="p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-xs text-zinc-400">
                  No pending email invitations.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-amber-50/20 dark:bg-amber-950/10">
                  {pendingInvitations.map((invite) => (
                    <div key={invite._id} className="p-3 px-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{invite.email}</p>
                        <p className="text-[11px] text-zinc-400">
                          Invited {new Date(invite.createdAt).toLocaleDateString()} • Unique link active
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyInviteLink(invite.token, invite._id)}
                          className="h-7 px-2.5 text-xs font-bold gap-1 border-amber-200 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40"
                          title="Copy unique registration URL"
                        >
                          {copiedTokenId === invite._id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy Link
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCancelInvitation(invite._id)}
                          className="h-7 px-2 text-xs text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Cancel invitation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedClientForUsers(null)}
              className="text-xs font-bold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
