import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft, Users, Calendar, ShieldCheck, Mail,
  FileText, Database, Cpu, Wifi, WifiOff, Trash2,
  CheckCircle, XCircle, RefreshCw, Search, ChevronUp, ChevronDown
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface ServerHealth {
  status: string;
  model_loaded: boolean;
  semantic_search_ready: boolean;
  document_count: number;
}

interface IndexedDoc {
  id: string;
  text: string;
  category: string;
  snippet: string;
}

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [health, setHealth] = useState<ServerHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"users" | "docs">("users");
  const [docsSearch, setDocsSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetched indexed documents from /admin/documents
  const [indexedDocs, setIndexedDocs] = useState<IndexedDoc[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<"id" | "category" | "snippet">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch("/health");
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const res = await fetch("/admin/users");
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users);
      } else {
        setUsersError(data.error || "Failed to load users");
      }
    } catch {
      setUsersError("Network error. Make sure server is running.");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchIndexedDocs = async () => {
    setDocsLoading(true);
    try {
      const res = await fetch("/admin/documents");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.documents) {
          setIndexedDocs(data.documents);
        }
      }
    } catch {
      // silently fail
    } finally {
      setDocsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchUsers();
    fetchIndexedDocs();
  }, []);

  const handleDeleteDoc = async (docId: string) => {
    if (!window.confirm(`Remove document "${docId}" from the semantic search index?`)) return;
    setDeletingId(docId);
    try {
      await fetch("/delete-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId })
      });
      setIndexedDocs(prev => prev.filter(d => d.id !== docId));
      // Refresh health to get updated doc count
      fetchHealth();
    } catch {
      alert("Failed to delete document. Make sure server is running.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDocs = indexedDocs.filter(doc => {
    if (!docsSearch) return true;
    const q = docsSearch.toLowerCase();
    return (
      doc.id.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.snippet.toLowerCase().includes(q) ||
      doc.text.toLowerCase().includes(q)
    );
  });

  const sortedDocs = useMemo(() => {
    const docs = [...filteredDocs];
    docs.sort((a, b) => {
      const valA = (a[sortField] || "").toLowerCase();
      const valB = (b[sortField] || "").toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return docs;
  }, [filteredDocs, sortField, sortDirection]);

  const handleSort = (field: "id" | "category" | "snippet") => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    HR: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    IT: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    Finance: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    General: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
  };

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage users, documents, and system health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchHealth(); fetchUsers(); fetchIndexedDocs(); }}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors shadow-sm text-muted-foreground"
          >
            <RefreshCw className="size-3.5" />
            Refresh
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors shadow-sm"
          >
            <ArrowLeft className="size-4" />
            Back to App
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="size-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="size-4 text-blue-600" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Users</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {usersLoading ? "—" : users.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
        </div>

        {/* Indexed Documents */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="size-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Database className="size-4 text-emerald-600" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Docs</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {healthLoading ? "—" : (health?.document_count ?? "—")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Indexed in semantic search</p>
        </div>

        {/* ML Model Status */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="size-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <Cpu className="size-4 text-purple-600" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">ML Model</span>
          </div>
          {healthLoading ? (
            <p className="text-2xl font-bold text-muted-foreground">—</p>
          ) : health?.model_loaded ? (
            <div className="flex items-center gap-1.5">
              <CheckCircle className="size-5 text-emerald-500" />
              <p className="text-base font-semibold text-emerald-600">Ready</p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <XCircle className="size-5 text-red-500" />
              <p className="text-base font-semibold text-red-600">Offline</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Auto-classification</p>
        </div>

        {/* Semantic Search Status */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className={`size-9 rounded-xl flex items-center justify-center ${health?.semantic_search_ready ? "bg-emerald-50" : "bg-red-50"}`}>
              {health?.semantic_search_ready
                ? <Wifi className="size-4 text-emerald-600" />
                : <WifiOff className="size-4 text-red-500" />
              }
            </div>
            <span className="text-xs text-muted-foreground font-medium">Semantic</span>
          </div>
          {healthLoading ? (
            <p className="text-2xl font-bold text-muted-foreground">—</p>
          ) : health?.semantic_search_ready ? (
            <div className="flex items-center gap-1.5">
              <CheckCircle className="size-5 text-emerald-500" />
              <p className="text-base font-semibold text-emerald-600">Active</p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <XCircle className="size-5 text-red-500" />
              <p className="text-base font-semibold text-red-600">Inactive</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Vector search engine</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 bg-muted/40 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "users"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-3.5" />
          Registered Users
          <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeTab === "users" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
            {users.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("docs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "docs"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="size-3.5" />
          Indexed Documents
          <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeTab === "docs" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
            {health?.document_count ?? indexedDocs.length}
          </span>
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Registered Users</h2>
              <p className="text-xs text-muted-foreground">All accounts with access to SmartDoc</p>
            </div>
          </div>

          {usersLoading ? (
            <div className="p-12 text-center">
              <RefreshCw className="size-6 text-muted-foreground mx-auto mb-3 animate-spin" />
              <p className="text-muted-foreground text-sm">Loading users...</p>
            </div>
          ) : usersError ? (
            <div className="p-12 text-center">
              <XCircle className="size-8 text-red-400 mx-auto mb-3" />
              <p className="text-red-600 font-medium text-sm">{usersError}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="size-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No users registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined At</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 text-sm font-medium text-muted-foreground">#{user.id}</td>
                      <td className="p-4 text-sm text-foreground font-medium">
                        <div className="flex items-center gap-2">
                          <div className="size-7 bg-accent/10 rounded-full flex items-center justify-center text-accent text-xs font-bold shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          {user.name}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail className="size-3.5 shrink-0" />
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 shrink-0" />
                          {new Date(user.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                          <ShieldCheck className="size-3" />
                          User
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "docs" && (
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Database className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Semantic Search Index</h2>
                <p className="text-xs text-muted-foreground">Documents available for AI-powered search</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Filter documents..."
                value={docsSearch}
                onChange={(e) => setDocsSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white border border-border rounded-xl outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all w-56"
              />
            </div>
          </div>

          {docsLoading ? (
            <div className="p-12 text-center">
              <RefreshCw className="size-6 text-muted-foreground mx-auto mb-3 animate-spin" />
              <p className="text-muted-foreground text-sm">Loading indexed documents...</p>
            </div>
          ) : sortedDocs.length === 0 ? (
            <div className="p-12 text-center">
              <Database className="size-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {docsSearch ? "No documents match your search." : "No documents in the semantic index."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th 
                      onClick={() => handleSort("id")}
                      className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/30 select-none transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Document ID
                        {sortField === "id" && (
                          sortDirection === "asc" ? <ChevronUp className="size-3.5 text-accent" /> : <ChevronDown className="size-3.5 text-accent" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("category")}
                      className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/30 select-none transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Category
                        {sortField === "category" && (
                          sortDirection === "asc" ? <ChevronUp className="size-3.5 text-accent" /> : <ChevronDown className="size-3.5 text-accent" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("snippet")}
                      className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/30 select-none transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Snippet
                        {sortField === "snippet" && (
                          sortDirection === "asc" ? <ChevronUp className="size-3.5 text-accent" /> : <ChevronDown className="size-3.5 text-accent" />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedDocs.map((doc) => {
                    const colorCfg = categoryColors[doc.category] || categoryColors.General;
                    return (
                      <tr key={doc.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 text-sm font-mono text-foreground font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="size-3.5 text-muted-foreground shrink-0" />
                            {doc.id}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorCfg.bg} ${colorCfg.text} ${colorCfg.border}`}>
                            {doc.category}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground max-w-sm">
                          <p className="line-clamp-2 leading-relaxed">{doc.snippet || doc.text}</p>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            disabled={deletingId === doc.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === doc.id
                              ? <RefreshCw className="size-3 animate-spin" />
                              : <Trash2 className="size-3" />
                            }
                            {deletingId === doc.id ? "Removing..." : "Remove"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
