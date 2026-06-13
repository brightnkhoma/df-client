"use client";

import { DbRef } from "@/app/lib/types/dbref";
import { useState } from "react";
import { 
  Database, ArrowRight, Plus, Sparkles, FolderOpen, 
  Search, Info, Shield, Zap, Loader2, X, Tag,
  Building2, Globe, ArrowLeft
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApp } from "@/app/lib/hooks/useApp";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/lib/toast/toast";

const defaultDbRef: DbRef = {
    id: "",
    name: "",
    dateCreated: new Date().toISOString(),
    dateUpdated: new Date().toISOString(),
    tags: [],
    createdBy: "",
    description: "",
    header: {
        id: "",
        name: "",
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        tags: [],
        createdBy: "",
        cells: {}
    }
};

// New Database Card Component
const NewDBCard = ({ onClick }: { onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    className="group relative flex flex-col items-center p-8 
                             bg-gray-900 border-2 border-dashed border-white/[0.06]
                             hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]
                             active:scale-[0.98]
                             transition-all duration-500 ease-out
                             focus:outline-none focus:border-emerald-500/40
                             w-full"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    aria-label="Create New Database"
                >
                    {/* Icon Container */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-emerald-500/5 blur-xl transition-all duration-500
                                      group-hover:bg-emerald-500/10" />
                        <div className="relative p-5 bg-white/[0.02] border border-white/[0.04]
                                      group-hover:border-emerald-500/20 group-hover:bg-emerald-500/[0.02]
                                      transition-all duration-500">
                            <Database 
                                className="w-10 h-10 text-gray-500 group-hover:text-emerald-400/60 
                                         transition-colors duration-500" 
                                strokeWidth={1.5}
                            />
                        </div>
                        
                        {/* Plus indicator */}
                        <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500/20 border border-emerald-500/30
                                      group-hover:bg-emerald-500/30 group-hover:border-emerald-500/40 
                                      transition-all duration-500">
                            <Plus className="w-3.5 h-3.5 text-emerald-400/70" strokeWidth={1.5} />
                        </div>
                        
                        {/* Sparkle on hover */}
                        <Sparkles 
                            className={`absolute -top-2 -left-2 w-4 h-4 text-emerald-400/40 
                                     transition-all duration-500 ${
                                         isHovered ? 'opacity-100 scale-100 rotate-12' : 'opacity-0 scale-50 rotate-0'
                                     }`} 
                            strokeWidth={1.5}
                        />
                    </div>
                    
                    {/* Label */}
                    <span className="text-lg font-light text-gray-300 tracking-wide mb-2
                                   group-hover:text-gray-200 transition-colors duration-500">
                        New Database
                    </span>
                    
                    {/* Subtitle */}
                    <span className="text-xs text-gray-600 font-light tracking-wide mb-4">
                        Create a new collection
                    </span>
                    
                    {/* CTA */}
                    <div className={`flex items-center gap-2 text-xs font-light tracking-wide text-emerald-400/60 
                                  transition-all duration-500 ${
                                      isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                                  }`}>
                        <span>Get Started</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={1.5} />
                    </div>
                    
                    {/* Hover overlay effect */}
                    <div className={`absolute inset-0 bg-emerald-500/[0.01]
                                  transition-opacity duration-500 ${
                                      isHovered ? 'opacity-100' : 'opacity-0'
                                  }`} />
                </button>
            </TooltipTrigger>
            
            <TooltipContent 
                side="bottom" 
                align="center"
                sideOffset={8}
                className="bg-gray-900 border border-white/[0.08] p-0 overflow-hidden"
            >
                <div className="bg-emerald-500/5 border-b border-emerald-500/10 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-400/60" strokeWidth={1.5} />
                        <span className="font-light text-gray-200 text-sm tracking-wide">Create New Database</span>
                    </div>
                </div>
                <div className="px-4 py-3">
                    <p className="text-gray-400 text-sm font-light">
                        Start a fresh database from scratch
                    </p>
                    <p className="text-gray-600 text-xs font-light mt-1 tracking-wide">
                        Define tables, fields, and begin managing your data
                    </p>
                </div>
            </TooltipContent>
        </Tooltip>
    );
};

// Database Creation Modal
const CreateDatabaseModal = ({ 
    isOpen, 
    onClose, 
    onCreate,
    loading
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onCreate: (db: DbRef) => void;
    loading: boolean;
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ name?: string }>({});

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tag.trim()) {
            e.preventDefault();
            if (!tags.includes(tag.trim())) {
                setTags([...tags, tag.trim()]);
                setTag("");
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleCreate = () => {
        if (!name.trim()) {
            setErrors({ name: "Database name is required" });
            return;
        }

        const newDb: DbRef = {
            ...defaultDbRef,
            id: `db_${Date.now()}`,
            name: name.trim(),
            description: description.trim(),
            tags,
            createdBy: "current_user",
            header: {
                ...defaultDbRef.header,
                id: `header_${Date.now()}`,
                name: `${name.trim()} - Header`,
            }
        };
        
        onCreate(newDb);
        setName("");
        setDescription("");
        setTags([]);
        setErrors({});
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        setTags([]);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="relative bg-gray-900 border border-white/[0.06] w-full max-w-md mx-4 
                          animate-in slide-in-from-bottom-4 duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/5 border border-emerald-500/10">
                            <Database className="w-4 h-4 text-emerald-400/60" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-base font-light text-gray-200 tracking-wide">New Database</h2>
                            <p className="text-xs text-gray-600 font-light mt-0.5">Create a new data collection</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/[0.02] transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-2">
                            Database Name <span className="text-red-400/60">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({});
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                                if (e.key === 'Escape') handleClose();
                            }}
                            placeholder="e.g., Farmers Registry, Crop Data..."
                            className={`w-full px-4 py-2.5 bg-white/[0.02] border text-sm font-light
                                     placeholder:text-gray-600 outline-none transition-all
                                     ${errors.name 
                                       ? 'border-red-500/30 focus:border-red-500/50 text-red-300' 
                                       : 'border-white/[0.06] focus:border-emerald-500/30 text-gray-200 hover:border-white/[0.1]'
                                     }`}
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-xs text-red-400/60 mt-1.5 font-light tracking-wide">{errors.name}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-2">
                            Description <span className="text-gray-600">(Optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What kind of data will this database contain?"
                            rows={3}
                            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] text-sm
                                     text-gray-200 placeholder:text-gray-600 font-light
                                     focus:border-emerald-500/30 focus:outline-none 
                                     hover:border-white/[0.1] transition-all resize-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-2">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {tags.map((tagItem, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 
                                             bg-emerald-500/5 text-emerald-400/60 text-xs font-light
                                             border border-emerald-500/10"
                                >
                                    <Tag className="w-3 h-3" strokeWidth={1.5} />
                                    {tagItem}
                                    <button
                                        onClick={() => removeTag(tagItem)}
                                        className="hover:text-emerald-300 transition-colors ml-0.5"
                                    >
                                        <X className="w-3 h-3" strokeWidth={1.5} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Add a tag and press Enter..."
                            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] text-sm
                                     text-gray-200 placeholder:text-gray-600 font-light
                                     focus:border-emerald-500/30 focus:outline-none 
                                     hover:border-white/[0.1] transition-all"
                        />
                    </div>
                </div>
                
                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/[0.04]">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2.5 border border-white/[0.06] text-gray-500 
                                 hover:text-gray-300 hover:border-white/[0.1]
                                 transition-all text-sm font-light tracking-wide"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!name.trim() || loading}
                        className="px-6 py-2.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20
                                 hover:bg-emerald-500/20 
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all text-sm font-light tracking-wide
                                 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" strokeWidth={1.5} />
                                Create Database
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const NewDbPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { api } = useApp();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const handleCreateDatabase = async (newDb: DbRef) => {
        try {
            setLoading(true);
            const ref = api.getDb<DbRef>("db");
            const id = await ref.create(newDb);
            
            if (id) {
                showToast("success",{description:"Database created successfully"});
                setIsModalOpen(false);
                router.push(`/dbref/${id}`);
                return;
            }
            
            showToast("error",{description:"Failed to create database"});
        } catch (error) {
            console.log(error);
            showToast("error",{description:"An error occurred while creating the database"});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <header className="bg-gray-950/80 backdrop-blur-md border-b border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => router.back()}
                                className="p-2 hover:bg-white/[0.02] transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" strokeWidth={1.5} />
                            </button>
                            
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/5 border border-emerald-500/10">
                                    <Database className="w-5 h-5 text-emerald-400/60" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h1 className="text-xl font-light text-white tracking-tight">Databases</h1>
                                    <p className="text-sm text-gray-500 font-light tracking-wide">Manage your data collections</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right side info */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" strokeWidth={1.5} />
                                <input
                                    type="text"
                                    placeholder="Search databases..."
                                    disabled
                                    className="pl-10 pr-4 py-2.5 w-64 bg-white/[0.01] border border-white/[0.04] 
                                             text-gray-600 cursor-not-allowed text-sm font-light
                                             focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2.5 border border-white/[0.04] bg-white/[0.01]">
                                <FolderOpen className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                                <span className="text-sm text-gray-600 font-light">0 items</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Empty State Container */}
                <div className="flex flex-col items-center justify-center">
                    {/* Illustration Section */}
                    <div className="relative mb-10">
                        {/* Background glows */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-40 h-40 bg-emerald-500/5 blur-3xl animate-pulse" />
                            <div className="absolute w-32 h-32 bg-emerald-500/[0.02] blur-2xl" />
                        </div>
                        
                        {/* Main Icon */}
                        <div className="relative p-8 bg-gray-900 border border-white/[0.04]">
                            <FolderOpen className="w-16 h-16 text-gray-700" strokeWidth={1} />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500/30" />
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-500/20" />
                        </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="text-center mb-12 max-w-lg">
                        <h2 className="text-2xl font-light text-gray-200 tracking-tight mb-4">
                            No Databases Yet
                        </h2>
                        <p className="text-gray-500 font-light leading-relaxed mb-2 tracking-wide">
                            Get started by creating your first database. 
                            Organize your farmer data, track records, and manage information efficiently.
                        </p>
                        <p className="text-sm text-gray-600 font-light tracking-wide">
                            Create a database to begin adding and managing your data collections.
                        </p>
                    </div>
                    
                    {/* New Database Card */}
                    <div className="w-full max-w-sm mb-12">
                        <NewDBCard onClick={() => setIsModalOpen(true)} />
                    </div>
                    
                    {/* Quick Tips Section */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
                        <div className="flex items-start gap-3 p-4 bg-gray-900 border border-white/[0.04]">
                            <div className="p-2 bg-blue-500/5 border border-blue-500/10 flex-shrink-0">
                                <Info className="w-4 h-4 text-blue-400/60" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-light text-gray-300 mb-1">Flexible Structure</h3>
                                <p className="text-xs text-gray-500 font-light tracking-wide">
                                    Define your own fields and customize data types
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-gray-900 border border-white/[0.04]">
                            <div className="p-2 bg-purple-500/5 border border-purple-500/10 flex-shrink-0">
                                <Shield className="w-4 h-4 text-purple-400/60" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-light text-gray-300 mb-1">Secure Storage</h3>
                                <p className="text-xs text-gray-500 font-light tracking-wide">
                                    Your data is encrypted and backed up automatically
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-gray-900 border border-white/[0.04]">
                            <div className="p-2 bg-orange-500/5 border border-orange-500/10 flex-shrink-0">
                                <Zap className="w-4 h-4 text-orange-400/60" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-light text-gray-300 mb-1">Quick Setup</h3>
                                <p className="text-xs text-gray-500 font-light tracking-wide">
                                    Get started in minutes with intuitive setup process
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-16 flex items-center gap-6 text-[10px] tracking-widest uppercase text-gray-700">
                        <Building2 className="w-3 h-3" strokeWidth={1.5} />
                        <span>Development Fund of Norway</span>
                        <span className="w-0.5 h-0.5 bg-gray-700" />
                        <Globe className="w-3 h-3" strokeWidth={1.5} />
                        <span>Republic of Malawi</span>
                    </div>
                </div>
            </main>

            {/* Create Database Modal */}
            <CreateDatabaseModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateDatabase}
                loading={loading}
            />
        </div>
    );
};

export default NewDbPage;