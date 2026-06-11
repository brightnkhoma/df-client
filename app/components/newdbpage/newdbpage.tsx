"use client";

import { DbRef } from "@/app/lib/types/dbref";
import { useState } from "react";
import { Database, ArrowRight, Plus, Sparkles, FolderOpen, LayoutGrid, Search, Info, Shield, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
}

// New Database Card Component
const NewDBCard = ({ onClick }: { onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    className="group relative flex flex-col items-center p-6 rounded-2xl 
                             bg-white border-2 border-dashed border-gray-300 shadow-sm
                             hover:shadow-lg hover:border-emerald-400 hover:border-solid
                             active:shadow-inner active:scale-[0.98]
                             transition-all duration-200 ease-in-out
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                             w-full"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    aria-label="Create New Database"
                >
                    {/* Icon Container */}
                    <div className="relative mb-4 p-4 rounded-full bg-emerald-50 
                                  group-hover:bg-emerald-100 transition-colors duration-200">
                        <Database 
                            className="w-12 h-12 text-emerald-600 group-hover:text-emerald-700 
                                     transition-colors duration-200" 
                            strokeWidth={1.5}
                        />
                        {/* Plus indicator */}
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 
                                      group-hover:bg-emerald-600 transition-colors duration-200">
                            <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        {/* Sparkle on hover */}
                        <Sparkles 
                            className={`absolute -top-2 -left-2 w-5 h-5 text-emerald-500 
                                     transition-all duration-300 ${
                                         isHovered ? 'opacity-100 scale-100 rotate-12' : 'opacity-0 scale-50 rotate-0'
                                     }`} 
                        />
                    </div>
                    
                    {/* Label */}
                    <span className="text-xl font-semibold text-gray-900 mb-2">
                        New Database
                    </span>
                    
                    {/* Subtitle */}
                    <span className="text-sm text-gray-500 mb-3">
                        Create a new collection
                    </span>
                    
                    {/* CTA */}
                    <div className={`flex items-center gap-1 text-xs font-medium text-emerald-600 
                                  transition-all duration-300 ${
                                      isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                                  }`}>
                        <span>Get Started</span>
                        <ArrowRight className="w-3 h-3" />
                    </div>
                    
                    {/* Hover overlay effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-emerald-50/30 
                                  transition-opacity duration-200 ${
                                      isHovered ? 'opacity-100' : 'opacity-0'
                                  }`} />
                </button>
            </TooltipTrigger>
            
            <TooltipContent 
                side="bottom" 
                align="center"
                sideOffset={8}
                className="bg-white border border-gray-200 shadow-xl rounded-xl p-0 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-200" />
                        <span className="font-semibold text-white text-sm">Create New Database</span>
                    </div>
                </div>
                <div className="px-4 py-3">
                    <p className="text-gray-700 text-sm">
                        Start a fresh database from scratch
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        Define tables, fields, and begin managing your data
                    </p>
                </div>
            </TooltipContent>
        </Tooltip>
    );
};

// Database Creation Modal (Simple Version)
const CreateDatabaseModal = ({ 
    isOpen, 
    onClose, 
    onCreate 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onCreate: (db: DbRef) => void;
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tag.trim()) {
            e.preventDefault();
            setTags([...tags, tag.trim()]);
            setTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleCreate = () => {
        const newDb: DbRef = {
            ...defaultDbRef,
            id: `db_${Date.now()}`,
            name: name || "Untitled Database",
            description,
            tags,
            createdBy: "current_user", // Replace with actual user ID
            header: {
                ...defaultDbRef.header,
                id: `header_${Date.now()}`,
                name: `${name || "Untitled Database"} - Header`,
            }
        };
        onCreate(newDb);
        onClose();
        // Reset form
        setName("");
        setDescription("");
        setTags([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 
                          animate-in slide-in-from-bottom-4 duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-50">
                            <Database className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">New Database</h2>
                            <p className="text-xs text-gray-500">Create a new data collection</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Database Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Farmers Registry, Crop Data..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 
                                     focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 
                                     transition-all outline-none text-sm"
                            autoFocus
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What kind of data will this database contain?"
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 
                                     focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 
                                     transition-all outline-none text-sm resize-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                                             bg-emerald-50 text-emerald-700 text-xs font-medium"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-emerald-900 transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
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
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 
                                     focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 
                                     transition-all outline-none text-sm"
                        />
                    </div>
                </div>
                
                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 
                                 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!name.trim()}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-white 
                                 bg-emerald-600 hover:bg-emerald-700 
                                 disabled:bg-gray-300 disabled:cursor-not-allowed
                                 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Database
                    </button>
                </div>
            </div>
        </div>
    );
};

export const NewDbPage = () => {
    const [db, setDb] = useState<DbRef>(defaultDbRef);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateDatabase = (newDb: DbRef) => {
        setDb(newDb);
        // Here you would typically:
        // 1. Save to backend
        // 2. Navigate to the new database view
        console.log("Created database:", newDb);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50">
                                <Database className="w-6 h-6 text-emerald-700" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Databases</h1>
                                <p className="text-sm text-gray-500">Manage your data collections</p>
                            </div>
                        </div>
                        
                        {/* Search Bar (Disabled State) */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search databases..."
                                    disabled
                                    className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 
                                             bg-gray-50 text-gray-400 cursor-not-allowed text-sm
                                             focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                                <LayoutGrid className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-400">0 items</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Empty State Container */}
                <div className="flex flex-col items-center justify-center">
                    {/* Illustration Section */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-emerald-50 animate-pulse" />
                            <div className="absolute w-24 h-24 rounded-full bg-emerald-100/50" />
                        </div>
                        
                        <div className="relative p-6 rounded-full bg-white shadow-lg border border-gray-100">
                            <FolderOpen className="w-16 h-16 text-gray-300" strokeWidth={1} />
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-200" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-emerald-300" />
                        </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="text-center mb-10 max-w-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            No Databases Yet
                        </h2>
                        <p className="text-gray-600 mb-2">
                            Get started by creating your first database. 
                            Organize your farmer data, track records, and manage information efficiently.
                        </p>
                        <p className="text-sm text-gray-400">
                            Create a database to begin adding and managing your data collections.
                        </p>
                    </div>
                    
                    {/* New Database Card */}
                    <div className="w-full max-w-sm mb-8">
                        <NewDBCard onClick={() => setIsModalOpen(true)} />
                    </div>
                    
                    {/* Quick Tips Section */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-2 rounded-lg bg-blue-50 flex-shrink-0">
                                <Info className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Flexible Structure</h3>
                                <p className="text-xs text-gray-500">Define your own fields and customize data types</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-2 rounded-lg bg-purple-50 flex-shrink-0">
                                <Shield className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Secure Storage</h3>
                                <p className="text-xs text-gray-500">Your data is encrypted and backed up automatically</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-2 rounded-lg bg-orange-50 flex-shrink-0">
                                <Zap className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Quick Setup</h3>
                                <p className="text-xs text-gray-500">Get started in minutes with intuitive setup process</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Database Modal */}
            <CreateDatabaseModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateDatabase}
            />
            
            {/* Bottom spacing */}
            <div className="h-8" />
        </div>
    );
};

export default NewDbPage;