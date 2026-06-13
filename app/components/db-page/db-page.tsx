"use client";

import { useApp } from "@/app/lib/hooks/useApp";
import { DbRef } from "@/app/lib/types/dbref";
import { RouterQuery } from "@/app/lib/types/routerQuery";
import { useCallback, useEffect, useState } from "react";
import { NewDB } from "../ui/emptyState";
import { DB } from "../ui/db";
import { 
  Database, Plus, Search, Loader2, LayoutGrid, List, 
  ArrowUpDown, Filter, RefreshCw, FolderOpen
} from "lucide-react";
import { useRouter } from "next/navigation";
import NewDbPage from "../newdbpage/newdbpage";

export const DBPage = () => {
  const [dbs, setDbs] = useState<DbRef[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "updated">("updated");
  const [error, setError] = useState<string>("");
  
  const { api } = useApp();
  const router = useRouter();

  const onGetDbs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const db = api.getDb<DbRef>("db");
      const q: RouterQuery<DbRef> = { 
        queries: [],
        // orderBy: sortBy === "name" ? "name" : sortBy === "date" ? "dateCreated" : "dateUpdated",
        // orderDirection: "desc"
      };
      
      const _dbs = await db.query(q, true);
      setDbs(_dbs);
    } catch (error) {
      console.log(error);
      setError("Failed to load databases. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [api, sortBy]);

  useEffect(() => {
    onGetDbs();
  }, [onGetDbs]);

  const handleRefresh = () => {
    onGetDbs();
  };

  const handleCreateNew = () => {
    router.push("/databases/new");
  };

  // Filter and sort databases
  const filteredDbs = dbs
    .filter(db => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        db.name.toLowerCase().includes(term) ||
        db.description?.toLowerCase().includes(term) ||
        db.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case "updated":
        default:
          return new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime();
      }
    });

  // Loading State
  if (loading && dbs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-emerald-400/60 animate-spin" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-light tracking-wide">Loading databases...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && dbs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/5 border border-red-500/10 flex items-center justify-center mx-auto">
            <Database className="w-8 h-8 text-red-400/40" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-light text-gray-300">Unable to Load Databases</h3>
            <p className="text-sm text-gray-500 font-light tracking-wide">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/[0.03] text-gray-300 rounded-lg
                     border border-white/[0.06] hover:border-emerald-500/20 hover:bg-emerald-500/[0.02]
                     transition-all duration-300 text-sm font-light tracking-wide"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!loading && dbs.length === 0) {
    return <NewDbPage />;
  }

  // Databases View
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 space-y-6">
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                  <Database className="w-5 h-5 text-emerald-400/60" strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl font-light text-white tracking-tight">Databases</h1>
              </div>
              <p className="text-sm text-gray-500 font-light tracking-wide pl-12">
                Manage your agricultural data collections
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2.5 rounded-lg border border-white/[0.06] text-gray-500 
                         hover:text-gray-300 hover:border-white/[0.1] transition-all duration-300
                         disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
              </button>
              
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-300 
                         rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 
                         transition-all duration-300 text-sm font-light tracking-wide"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                New Database
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" strokeWidth={1.5} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search databases..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] rounded-lg border border-white/[0.06]
                         text-sm text-gray-300 placeholder:text-gray-600 font-light
                         focus:border-emerald-500/30 focus:outline-none
                         hover:border-white/[0.1] transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "date" | "updated")}
                className="px-4 py-2.5 bg-white/[0.02] rounded-lg border border-white/[0.06]
                         text-sm text-gray-400 font-light tracking-wide
                         focus:border-emerald-500/30 focus:outline-none
                         hover:border-white/[0.1] transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="updated">Recently Updated</option>
                <option value="date">Date Created</option>
                <option value="name">Name</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center border border-white/[0.06] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-all duration-300 ${
                    viewMode === "grid"
                      ? 'bg-white/[0.03] text-emerald-400/60'
                      : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-all duration-300 ${
                    viewMode === "list"
                      ? 'bg-white/[0.03] text-emerald-400/60'
                      : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  <List className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {(searchTerm || filteredDbs.length !== dbs.length) && (
            <p className="text-xs text-gray-600 font-light tracking-wide">
              Showing {filteredDbs.length} of {dbs.length} database{filteredDbs.length !== 1 ? 's' : ''}
              {searchTerm && <span> matching "{searchTerm}"</span>}
            </p>
          )}
        </div>

        {/* Database Grid/List */}
        {filteredDbs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/[0.01] border border-white/[0.04] flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-light text-gray-400 mb-2">No databases found</h3>
            <p className="text-sm text-gray-600 font-light tracking-wide">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first database to get started'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-xs text-emerald-400/60 hover:text-emerald-400/80 transition-colors font-light tracking-wide"
              >
                Clear search
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDbs.map((db, i) => (
              <DB {...db} key={db.id || i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-medium tracking-wider uppercase text-gray-600">
              <div className="col-span-4">Database Name</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2">Tags</div>
              <div className="col-span-2">Last Updated</div>
              <div className="col-span-1">Columns</div>
            </div>
            
            {/* List Items */}
            {filteredDbs.map((db, i) => (
              <DB {...db} key={db.id || i}  />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DBPage;