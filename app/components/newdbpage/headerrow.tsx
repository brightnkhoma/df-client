"use client";

import { DbRef } from "@/app/lib/types/dbref";
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { 
  Database, Plus, Save, X, ArrowLeft, Edit3, Trash2, 
  Check, Tag, Calendar, User, GripVertical, Hash, MapPin,
  Type, ToggleLeft, AlertCircle, Info, Shield, RefreshCw,
  ArrowUp, ArrowDown, Search, Loader2, Building2, Globe
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Cell } from "@/app/lib/types/cell";
import { FieldDataType } from "@/app/lib/types/farmer";
import { Row } from "@/app/lib/types/row";
import { useApp } from "@/app/lib/hooks/useApp";
import { useParams, useRouter } from "next/navigation";
import { RouterQuery } from "@/app/lib/types/routerQuery";

const generateId = () => `cell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const fieldTypes: { 
  value: FieldDataType; 
  label: string; 
  color: string; 
  icon: React.ReactNode;
  description: string;
  examples: string;
}[] = [
  { 
    value: "string", 
    label: "Text", 
    color: "bg-blue-950/50 text-blue-400/70 border-blue-500/20", 
    icon: <Type className="w-4 h-4" strokeWidth={1.5} />,
    description: "For names, descriptions, and general text data",
    examples: "John Doe, Wheat Field A"
  },
  { 
    value: "number", 
    label: "Number", 
    color: "bg-purple-950/50 text-purple-400/70 border-purple-500/20", 
    icon: <Hash className="w-4 h-4" strokeWidth={1.5} />,
    description: "For quantities, IDs, and numerical values",
    examples: "42, 150.5, 1000"
  },
  { 
    value: "boolean", 
    label: "True/False", 
    color: "bg-orange-950/50 text-orange-400/70 border-orange-500/20", 
    icon: <ToggleLeft className="w-4 h-4" strokeWidth={1.5} />,
    description: "For binary true/false conditions",
    examples: "true, false"
  },
  { 
    value: "yes", 
    label: "Yes/No", 
    color: "bg-emerald-950/50 text-emerald-400/70 border-emerald-500/20", 
    icon: <Check className="w-4 h-4" strokeWidth={1.5} />,
    description: "For affirmative/negative responses",
    examples: "yes, no"
  },
  { 
    value: "no", 
    label: "No/Yes", 
    color: "bg-red-950/50 text-red-400/70 border-red-500/20", 
    icon: <X className="w-4 h-4" strokeWidth={1.5} />,
    description: "For negative/affirmative responses",
    examples: "no, yes"
  },
  { 
    value: "Coordinates", 
    label: "Location", 
    color: "bg-indigo-950/50 text-indigo-400/70 border-indigo-500/20", 
    icon: <MapPin className="w-4 h-4" strokeWidth={1.5} />,
    description: "For geographic coordinates and map locations",
    examples: "40.7128° N, 74.0060° W"
  },
  { 
    value: "null", 
    label: "Empty", 
    color: "bg-gray-900/50 text-gray-500/70 border-gray-700/20", 
    icon: <AlertCircle className="w-4 h-4" strokeWidth={1.5} />,
    description: "For optional fields that may be empty",
    examples: "null"
  },
];

// Draggable Cell Component
const DraggableCell = ({ 
  cell, 
  totalCells,
  onUpdate, 
  onDelete,
  onDuplicate,
  onMoveLeft,
  onMoveRight,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  dragOverIndex
}: { 
  cell: Cell;
  totalCells: number;
  onUpdate: (updatedCell: Cell) => void; 
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDragStart: (e: React.DragEvent, colNumber: number) => void;
  onDragOver: (e: React.DragEvent, colNumber: number) => void;
  onDrop: (e: React.DragEvent, colNumber: number) => void;
  isDragging: boolean;
  dragOverIndex: number | null;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<Cell["value"]>(cell.value);
  const [editType, setEditType] = useState<FieldDataType>(cell.type);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (!editValue && editValue !== 0 && editValue !== false) {
      toast.error("Column name cannot be empty");
      return;
    }
    
    onUpdate({
      ...cell,
      value: editValue,
      type: editType,
    });
    setIsEditing(false);
    toast.success("Column updated successfully");
  };

  const handleCancel = () => {
    setEditValue(cell.value);
    setEditType(cell.type);
    setIsEditing(false);
  };

  const selectedType = fieldTypes.find(t => t.value === editType);

  const renderValue = (value: Cell['value']) => {
    if (value === null) return <span className="italic text-gray-600">Empty</span>;
    if (typeof value === 'boolean') return value ? 'True' : 'False';
    if (value === 'yes') return 'Yes';
    if (value === 'no') return 'No';
    if (typeof value === 'object' && value !== null) {
      return `${(value as any).lat?.toFixed(4)}, ${(value as any).lng?.toFixed(4)}`;
    }
    return String(value);
  };

  return (
    <>
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/[0.06] p-6 max-w-sm mx-4 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-400/60" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-light text-gray-200 mb-2">Delete Column?</h3>
              <p className="text-sm text-gray-500 font-light mb-4">
                Are you sure you want to delete "{String(cell.value)}"? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-white/[0.06] text-gray-400 
                           hover:text-gray-200 hover:border-white/[0.1] transition-all text-sm font-light"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowDeleteConfirm(false);
                    toast.success("Column deleted");
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-500/10 text-red-300 border border-red-500/20
                           hover:bg-red-500/20 transition-all text-sm font-light"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="bg-gray-900 border border-emerald-500/20 p-5 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 bg-white/[0.02] px-2 py-1 border border-white/[0.04]">
                Col {cell.colNumber + 1}
              </span>
              <span className="text-xs text-gray-600 font-mono">ID: {cell.id.slice(-8)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-1.5">
              Column Name
            </label>
            <input
              type="text"
              value={typeof editValue === 'string' ? editValue : String(editValue)}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Enter column name..."
              className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] text-sm
                       text-gray-200 placeholder:text-gray-600 font-light
                       focus:border-emerald-500/30 focus:outline-none transition-all"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-1.5">
              Data Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fieldTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEditType(type.value)}
                  className={`flex items-center gap-2 px-3 py-2 border text-sm font-light
                           transition-all ${
                             editType === type.value
                               ? `${type.color} ring-1 ring-emerald-500/30`
                               : 'border-white/[0.04] text-gray-500 hover:border-white/[0.08] hover:text-gray-400'
                           }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
            
            {selectedType && (
              <div className={`mt-2 p-3 border ${selectedType.color}`}>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-light">{selectedType.description}</p>
                    <p className="text-xs mt-1 opacity-60">Example: {selectedType.examples}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20
                       hover:bg-emerald-500/20 transition-all text-sm font-light 
                       flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" strokeWidth={1.5} />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 text-gray-500 hover:text-gray-300 border border-white/[0.06]
                       transition-all text-sm font-light"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div 
          ref={dragRef}
          draggable
          onDragStart={(e) => onDragStart(e, cell.colNumber)}
          onDragOver={(e) => onDragOver(e, cell.colNumber)}
          onDrop={(e) => onDrop(e, cell.colNumber)}
          className={`bg-gray-900 border p-5 
                    hover:border-emerald-500/20 transition-all duration-300
                    cursor-pointer group/cell relative overflow-hidden
                    ${isDragging ? 'opacity-50 border-emerald-500/30 scale-95' : 'border-white/[0.04]'}
                    ${dragOverIndex === cell.colNumber ? 'border-emerald-500/30 bg-emerald-500/[0.02] scale-105' : ''}
                    ${dragOverIndex !== null && dragOverIndex !== cell.colNumber ? 'scale-95' : ''}`}
        >
          {dragOverIndex === cell.colNumber && (
            <div className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-emerald-500/50 animate-pulse" />
          )}
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="p-1 hover:bg-white/[0.02] cursor-grab active:cursor-grabbing
                           opacity-0 group-hover/cell:opacity-100 transition-all"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                </div>
                
                <span className="text-xs font-medium text-gray-600 bg-white/[0.02] px-2 py-0.5 border border-white/[0.04]">
                  Col {cell.colNumber + 1}
                </span>
                
                <div className="flex items-center gap-0.5 opacity-0 group-hover/cell:opacity-100 transition-all">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => { e.stopPropagation(); onMoveLeft(); }}
                        disabled={cell.colNumber === 0}
                        className="p-1 hover:bg-white/[0.02] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp className="w-3 h-3 text-gray-500" strokeWidth={1.5} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-900 border-white/[0.06] text-gray-400 text-xs">
                      Move left
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => { e.stopPropagation(); onMoveRight(); }}
                        disabled={cell.colNumber === totalCells - 1}
                        className="p-1 hover:bg-white/[0.02] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown className="w-3 h-3 text-gray-500" strokeWidth={1.5} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-900 border-white/[0.06] text-gray-400 text-xs">
                      Move right
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex items-center gap-0.5 opacity-0 group-hover/cell:opacity-100 
                            transition-all duration-200 translate-x-2 group-hover/cell:translate-x-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                      className="p-1.5 hover:bg-purple-500/10 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-purple-400/60" strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-900 border-white/[0.06] text-gray-400 text-xs">
                    Duplicate column
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                      className="p-1.5 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-400/60" strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-900 border-white/[0.06] text-gray-400 text-xs">
                    Edit column
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                      className="p-1.5 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400/60" strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-900 border-white/[0.06] text-gray-400 text-xs">
                    Delete column
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="space-y-2" onClick={() => setIsEditing(true)}>
              <h4 className="font-light text-gray-200 text-lg truncate">
                {renderValue(cell.value)}
              </h4>
              
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-light border ${fieldTypes.find(t => t.value === cell.type)?.color}`}>
                  {fieldTypes.find(t => t.value === cell.type)?.icon}
                  {fieldTypes.find(t => t.value === cell.type)?.label}
                </span>
                <span className="text-xs text-gray-600 font-mono">
                  ID: {cell.id.slice(-8)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// New Column Form
const NewColumnForm = ({ 
  nextColNumber, 
  headerId,
  onAdd 
}: { 
  nextColNumber: number;
  headerId: string;
  onAdd: (cell: Cell) => void;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<FieldDataType>("string");
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleAdd = () => {
    if (!name.trim()) {
      setErrors({ name: "Column name is required" });
      return;
    }
    
    const newCell: Cell = {
      id: generateId(),
      colNumber: nextColNumber,
      value: name.trim(),
      type: type,
      rowId: headerId
    };
    
    onAdd(newCell);
    setName("");
    setType("string");
    setErrors({});
    setIsAdding(false);
    toast.success("Column added");
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full min-h-[200px] border-2 border-dashed border-white/[0.04] 
                 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-300
                 flex flex-col items-center justify-center gap-3 group"
      >
        <div className="p-4 bg-white/[0.02] border border-white/[0.04] group-hover:border-emerald-500/20 group-hover:scale-110 transition-all duration-300">
          <Plus className="w-8 h-8 text-gray-600 group-hover:text-emerald-400/60 transition-colors" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-sm font-light text-gray-500 group-hover:text-emerald-400/60">
            Add New Column
          </p>
          <p className="text-xs text-gray-600 font-light mt-1">
            Define a new data field
          </p>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-gray-900 border-2 border-emerald-500/30 p-5 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-light text-gray-300">New Column</h4>
          <p className="text-xs text-gray-600">Column {nextColNumber + 1}</p>
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-1.5">
          Column Name <span className="text-red-400/60">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({}); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setIsAdding(false); }}
          placeholder="e.g., Phone Number, Crop Type..."
          className={`w-full px-4 py-2.5 bg-white/[0.02] border text-sm font-light
                   placeholder:text-gray-600 outline-none transition-all
                   ${errors.name 
                     ? 'border-red-500/30 focus:border-red-500/50 text-red-300' 
                     : 'border-white/[0.06] focus:border-emerald-500/30 text-gray-200'
                   }`}
          autoFocus
        />
        {errors.name && (
          <p className="text-xs text-red-400/60 mt-1 flex items-center gap-1 font-light">
            <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
            {errors.name}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-1.5">
          Data Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {fieldTypes.map((fieldType) => (
            <button
              key={fieldType.value}
              onClick={() => setType(fieldType.value)}
              className={`flex items-center gap-2 px-3 py-2 border text-sm font-light transition-all
                       ${type === fieldType.value
                         ? `${fieldType.color} ring-1 ring-emerald-500/30`
                         : 'border-white/[0.04] text-gray-500 hover:border-white/[0.08] hover:text-gray-400'
                       }`}
            >
              {fieldType.icon}
              {fieldType.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={handleAdd}
          className="flex-1 px-4 py-2.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20
                   hover:bg-emerald-500/20 transition-all text-sm font-light 
                   flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add Column
        </button>
        <button
          onClick={() => { setIsAdding(false); setErrors({}); }}
          className="px-4 py-2.5 text-gray-500 hover:text-gray-300 border border-white/[0.06]
                   transition-all text-sm font-light"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Header Details Component
const HeaderDetails = ({ header, onUpdate }: { header: Row; onUpdate: (header: Row) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(header.name);
  const [editTag, setEditTag] = useState("");
  const [editTags, setEditTags] = useState(header.tags);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSave = () => {
    if (!editName.trim()) {
      setErrors({ name: "Header name is required" });
      return;
    }
    
    onUpdate({
      ...header,
      name: editName.trim(),
      tags: editTags,
      dateUpdated: new Date().toISOString()
    });
    setIsEditing(false);
    setErrors({});
    toast.success("Header updated");
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editTag.trim()) {
      e.preventDefault();
      if (!editTags.includes(editTag.trim())) {
        setEditTags([...editTags, editTag.trim()]);
        setEditTag("");
      }
    }
  };

  return (
    <div className="bg-gray-900 border border-white/[0.04] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-light text-gray-300 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400/60" strokeWidth={1.5} />
          Header Details
        </h3>
        {!isEditing && (
          <button onClick={() => { setIsEditing(true); setEditName(header.name); setEditTags(header.tags); }}
            className="p-2 hover:bg-white/[0.02] transition-colors">
            <Edit3 className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-1.5">
              Header Name <span className="text-red-400/60">*</span>
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => { setEditName(e.target.value); if (errors.name) setErrors({}); }}
              className={`w-full px-4 py-2.5 bg-white/[0.02] border text-sm font-light
                       outline-none transition-all
                       ${errors.name 
                         ? 'border-red-500/30 focus:border-red-500/50 text-red-300' 
                         : 'border-white/[0.06] focus:border-emerald-500/30 text-gray-200'
                       }`}
            />
            {errors.name && (
              <p className="text-xs text-red-400/60 mt-1 flex items-center gap-1 font-light">
                <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                {errors.name}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {editTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 
                                           bg-emerald-500/5 text-emerald-400/60 text-xs font-light
                                           border border-emerald-500/10">
                  <Tag className="w-3 h-3" strokeWidth={1.5} />
                  {tag}
                  <button onClick={() => setEditTags(editTags.filter(t => t !== tag))}
                    className="hover:text-emerald-300 transition-colors ml-0.5">
                    <X className="w-3 h-3" strokeWidth={1.5} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add tag and press Enter..."
              className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] text-sm
                       text-gray-200 placeholder:text-gray-600 font-light
                       focus:border-emerald-500/30 focus:outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <button onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20
                       hover:bg-emerald-500/20 transition-all text-sm font-light 
                       flex items-center justify-center gap-2">
              <Check className="w-4 h-4" strokeWidth={1.5} />
              Save Changes
            </button>
            <button onClick={() => { setIsEditing(false); setErrors({}); }}
              className="px-4 py-2.5 text-gray-500 hover:text-gray-300 border border-white/[0.06]
                       transition-all text-sm font-light">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-white/[0.01] border border-white/[0.04]">
            <label className="text-xs font-medium text-gray-600 tracking-wider uppercase mb-1 block">Name</label>
            <p className="text-sm font-light text-gray-300">{header.name}</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 font-light">
            <Tag className="w-3.5 h-3.5" strokeWidth={1.5} />
            <div className="flex flex-wrap gap-1">
              {header.tags.length > 0 ? header.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-emerald-500/5 text-emerald-400/60 border border-emerald-500/10 text-xs">
                  {tag}
                </span>
              )) : (
                <span className="italic text-gray-600">No tags</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-600 font-light">
            <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Updated: {new Date(header.dateUpdated).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-600 font-light">
            <User className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Created by: {header.createdBy}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Page Component
export const HeaderRowEditor = () => {
  const { api } = useApp();
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [dbref, setDbref] = useState<DbRef | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FieldDataType | "all">("all");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const db = useMemo(() => api.getDb<DbRef>("db"), [api]);

  // Load database
  const onLoadDb = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const ref = await db.get(id, true);
      setDbref(ref);
    } catch (error) {
      console.log(error);
      setError("Failed to load database");
    } finally {
      setLoading(false);
    }
  }, [db, id]);

  useEffect(() => {
    onLoadDb();
  }, [onLoadDb]);

  // Update database
  const updateRef = useCallback(async (updates: Partial<DbRef>) => {
    try {
      await db.update(id, updates);
      setHasChanges(false);
      toast.success("Changes saved");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save changes");
    }
  }, [db, id]);

  const sortedCells = dbref ? Object.values(dbref.header.cells).sort((a, b) => a.colNumber - b.colNumber) : [];

  const reorderCells = useCallback((cells: Cell[], fromIndex: number, toIndex: number): Cell[] => {
    const result = [...cells];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result.map((cell, index) => ({ ...cell, colNumber: index }));
  }, []);

  const applyReordering = useCallback((reorderedCells: Cell[]) => {
    if (!dbref) return;
    const updatedCells: Record<number, Cell> = {};
    reorderedCells.forEach(cell => { updatedCells[cell.colNumber] = cell; });
    
    setDbref(prev => prev ? {
      ...prev,
      header: { ...prev.header, cells: updatedCells, dateUpdated: new Date().toISOString() },
      dateUpdated: new Date().toISOString()
    } : null);
    setHasChanges(true);
  }, [dbref]);

  const handleDragStart = useCallback((e: React.DragEvent, colNumber: number) => {
    setDraggedIndex(colNumber);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, colNumber: number) => {
    e.preventDefault();
    setDragOverIndex(colNumber);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColNumber: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetColNumber) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    const currentCells = dbref ? Object.values(dbref.header.cells).sort((a, b) => a.colNumber - b.colNumber) : [];
    const reorderedCells = reorderCells(currentCells, draggedIndex, targetColNumber);
    applyReordering(reorderedCells);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, dbref, reorderCells, applyReordering]);

  const moveColumn = useCallback((colNumber: number, direction: 'left' | 'right') => {
    if (!dbref) return;
    const currentCells = Object.values(dbref.header.cells).sort((a, b) => a.colNumber - b.colNumber);
    const targetIndex = direction === 'left' ? colNumber - 1 : colNumber + 1;
    if (targetIndex < 0 || targetIndex >= currentCells.length) return;
    applyReordering(reorderCells(currentCells, colNumber, targetIndex));
  }, [dbref, reorderCells, applyReordering]);

  const handleCellUpdate = useCallback((cellId: string, updatedCell: Cell) => {
    if (!dbref) return;
    setDbref(prev => prev ? {
      ...prev,
      header: { ...prev.header, cells: { ...prev.header.cells, [cellId]: updatedCell }, dateUpdated: new Date().toISOString() },
      dateUpdated: new Date().toISOString()
    } : null);
    setHasChanges(true);
  }, [dbref]);

  const handleCellDelete = useCallback((colNumber: number) => {
    if (!dbref) return;
    const updatedCells = { ...dbref.header.cells };
    delete updatedCells[colNumber];
    
    const sortedRemaining = Object.values(updatedCells).sort((a, b) => a.colNumber - b.colNumber);
    const reindexedCells: Record<number, Cell> = {};
    sortedRemaining.forEach((cell, index) => { reindexedCells[index] = { ...cell, colNumber: index }; });
    
    setDbref(prev => prev ? {
      ...prev,
      header: { ...prev.header, cells: reindexedCells, dateUpdated: new Date().toISOString() },
      dateUpdated: new Date().toISOString()
    } : null);
    setHasChanges(true);
  }, [dbref]);

  const handleDuplicateCell = useCallback((cell: Cell) => {
    if (!dbref) return;
    const sortedAll = Object.values(dbref.header.cells).sort((a, b) => a.colNumber - b.colNumber);
    const newColNumber = sortedAll.length;
    
    const duplicatedCell: Cell = {
      ...cell,
      id: generateId(),
      colNumber: newColNumber,
      value: `${cell.value} (Copy)`,
      rowId: dbref.header.id
    };
    
    setDbref(prev => prev ? {
      ...prev,
      header: { ...prev.header, cells: { ...prev.header.cells, [newColNumber]: duplicatedCell }, dateUpdated: new Date().toISOString() },
      dateUpdated: new Date().toISOString()
    } : null);
    setHasChanges(true);
  }, [dbref]);

  const handleAddCell = useCallback((newCell: Cell) => {
    if (!dbref) return;
    setDbref(prev => prev ? {
      ...prev,
      header: { ...prev.header, cells: { ...prev.header.cells, [newCell.colNumber]: newCell }, dateUpdated: new Date().toISOString() },
      dateUpdated: new Date().toISOString()
    } : null);
    setHasChanges(true);
  }, [dbref]);

  const handleHeaderUpdate = useCallback((updatedHeader: Row) => {
    setDbref(prev => prev ? { ...prev, header: updatedHeader, dateUpdated: new Date().toISOString() } : null);
    setHasChanges(true);
  }, []);

  const handleSaveAll = async () => {
    if (!dbref) return;
    setIsSaving(true);
    await updateRef(dbref);
    setIsSaving(false);
  };

  const handleReset = async () => {
    if (hasChanges) {
      await onLoadDb();
      setHasChanges(false);
      setDraggedIndex(null);
      setDragOverIndex(null);
      toast.info("Changes reset");
    }
  };

  const filteredCells = sortedCells.filter(cell => {
    const matchesSearch = String(cell.value).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || cell.type === filterType;
    return matchesSearch && matchesType;
  });

  const typeStats = fieldTypes.map(type => ({
    ...type,
    count: sortedCells.filter(cell => cell.type === type.value).length
  })).filter(stat => stat.count > 0);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-400/60 animate-spin mx-auto" strokeWidth={1.5} />
          <p className="text-sm text-gray-500 font-light tracking-wide">Loading database...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !dbref) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md">
          <Database className="w-12 h-12 text-red-400/40 mx-auto" strokeWidth={1.5} />
          <p className="text-gray-400 font-light">{error || "Database not found"}</p>
          <button onClick={() => router.back()}
            className="px-6 py-2.5 border border-white/[0.06] text-gray-400 hover:text-gray-200 transition-all text-sm font-light">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-950/80 backdrop-blur-md border-b border-white/[0.04] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-white/[0.02] transition-colors group">
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" strokeWidth={1.5} />
              </button>
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-light text-white tracking-tight">{dbref.name}</h1>
                  <span className="px-3 py-1 bg-emerald-500/5 text-emerald-400/60 text-xs font-light border border-emerald-500/10 flex items-center gap-1.5">
                    <Database className="w-3 h-3" strokeWidth={1.5} />
                    Editing Header
                  </span>
                </div>
                {dbref.description && (
                  <p className="text-sm text-gray-500 font-light mt-0.5">{dbref.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {hasChanges && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-500/5 border border-amber-500/10">
                  <div className="w-1.5 h-1.5 bg-amber-500/50 animate-pulse" />
                  <span className="text-xs font-light text-amber-400/60">Unsaved changes</span>
                </div>
              )}
              
              <button onClick={handleReset} disabled={!hasChanges}
                className="px-4 py-2.5 border border-white/[0.06] text-gray-500 
                         hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all text-sm font-light flex items-center gap-2">
                <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                Reset
              </button>
              
              <button onClick={handleSaveAll} disabled={!hasChanges || isSaving}
                className="px-6 py-2.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20
                         hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all text-sm font-light flex items-center gap-2">
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" strokeWidth={1.5} /> Save All Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Drag Instructions */}
        <div className="mb-6 p-4 bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
          <GripVertical className="w-5 h-5 text-emerald-400/40 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <div>
            <h3 className="text-sm font-light text-emerald-300/80 mb-1">Column Reordering</h3>
            <p className="text-xs text-emerald-400/40 font-light">
              Drag and drop columns using the grip handles to rearrange their order.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <HeaderDetails header={dbref.header} onUpdate={handleHeaderUpdate} />
              
              <div className="bg-gray-900 border border-white/[0.04] p-5">
                <h4 className="text-sm font-light text-gray-300 mb-4">Column Analytics</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-white/[0.01] border border-white/[0.04]">
                    <span className="text-xs text-gray-500 font-light">Total Columns</span>
                    <span className="text-sm font-light text-gray-300">{sortedCells.length}</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    {typeStats.map((type) => (
                      <div key={type.value} className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-light border ${type.color}`}>
                          {type.icon}
                          {type.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-gray-800 overflow-hidden">
                            <div className="h-full bg-emerald-500/50" style={{ width: `${(type.count / sortedCells.length) * 100}%` }} />
                          </div>
                          <span className="text-xs font-light text-gray-500 w-4 text-right">{type.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 border border-white/[0.04] p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Search columns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/[0.06] text-sm
                             text-gray-200 placeholder:text-gray-600 font-light
                             focus:border-emerald-500/30 focus:outline-none transition-all"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FieldDataType | "all")}
                  className="px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] text-sm
                           text-gray-400 font-light focus:border-emerald-500/30 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  {fieldTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              {(searchTerm || filterType !== "all") && (
                <p className="text-xs text-gray-600 font-light mt-3">
                  Showing {filteredCells.length} of {sortedCells.length} columns
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-sm font-light text-gray-400 mb-4">
                {filteredCells.length} Column{filteredCells.length !== 1 ? 's' : ''}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                   onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}>
                {filteredCells.map((cell) => (
                  <DraggableCell
                    key={cell.id}
                    cell={cell}
                    totalCells={sortedCells.length}
                    onUpdate={(updatedCell) => handleCellUpdate(cell.id, updatedCell)}
                    onDelete={() => handleCellDelete(cell.colNumber)}
                    onDuplicate={() => handleDuplicateCell(cell)}
                    onMoveLeft={() => moveColumn(cell.colNumber, 'left')}
                    onMoveRight={() => moveColumn(cell.colNumber, 'right')}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragging={draggedIndex === cell.colNumber}
                    dragOverIndex={dragOverIndex}
                  />
                ))}
                
                {filteredCells.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <Database className="w-12 h-12 text-gray-700 mx-auto mb-3" strokeWidth={1.5} />
                    <p className="text-gray-600 text-sm font-light">No columns found</p>
                    {(searchTerm || filterType !== "all") && (
                      <button onClick={() => { setSearchTerm(""); setFilterType("all"); }}
                        className="text-emerald-400/60 hover:text-emerald-400/80 text-sm font-light mt-2">
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
                
                {(!searchTerm && filterType === "all") && (
                  <NewColumnForm 
                    nextColNumber={sortedCells.length} 
                    headerId={dbref.header.id}
                    onAdd={handleAddCell} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeaderRowEditor;