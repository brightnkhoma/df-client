"use client";

import { DbRef} from "@/app/lib/types/dbref";
import { useState, useCallback, useRef } from "react";
import { 
  Database, Plus, Save, X, ArrowLeft, Edit3, Trash2, 
  Check, Tag, Calendar, User, GripVertical, Hash, MapPin,
  Type, ToggleLeft, AlertCircle, Info, Shield, Zap, RefreshCw,
  MoveUp, MoveDown, ArrowUp, ArrowDown
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Cell } from "@/app/lib/types/cell";
import { FieldDataType } from "@/app/lib/types/farmer";
import { Row } from "@/app/lib/types/row";

const generateId = () => `cell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const mockDb: DbRef = {
  id: "db_123",
  name: "Farmers Registry 2024",
  dateCreated: "2024-01-15T10:30:00Z",
  dateUpdated: "2024-03-20T14:45:00Z",
  tags: ["agriculture", "farmers", "2024"],
  createdBy: "user_456",
  description: "Comprehensive database of registered farmers and their agricultural activities",
  header: {
    id: "header_789",
    name: "Farmers Registry 2024 - Header",
    dateCreated: "2024-01-15T10:30:00Z",
    dateUpdated: "2024-03-20T14:45:00Z",
    tags: ["primary"],
    createdBy: "user_456",
    cells: {
      0: {
        id: "cell_001",
        colNumber: 0,
        value: "Farmer ID",
        type: "number",
        rowId: "header_789"
      },
      1: {
        id: "cell_002",
        colNumber: 1,
        value: "Full Name",
        type: "string",
        rowId: "header_789"
      },
      2: {
        id: "cell_003",
        colNumber: 2,
        value: "Farm Location",
        type: "Coordinates",
        rowId: "header_789"
      },
      3: {
        id: "cell_004",
        colNumber: 3,
        value: "Is Active",
        type: "yes",
        rowId: "header_789"
      },
      4: {
        id: "cell_005",
        colNumber: 4,
        value: "Has Insurance",
        type: "no",
        rowId: "header_789"
      }
    }
  }
};

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
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", 
    icon: <Type className="w-4 h-4" />,
    description: "For names, descriptions, and general text data",
    examples: "John Doe, Wheat Field A"
  },
  { 
    value: "number", 
    label: "Number", 
    color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100", 
    icon: <Hash className="w-4 h-4" />,
    description: "For quantities, IDs, and numerical values",
    examples: "42, 150.5, 1000"
  },
  { 
    value: "boolean", 
    label: "True/False", 
    color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100", 
    icon: <ToggleLeft className="w-4 h-4" />,
    description: "For binary true/false conditions",
    examples: "true, false"
  },
  { 
    value: "yes", 
    label: "Yes/No", 
    color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100", 
    icon: <Check className="w-4 h-4" />,
    description: "For affirmative/negative responses",
    examples: "yes, no"
  },
  { 
    value: "no", 
    label: "No/Yes", 
    color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100", 
    icon: <X className="w-4 h-4" />,
    description: "For negative/affirmative responses",
    examples: "no, yes"
  },
  { 
    value: "Coordinates", 
    label: "Location", 
    color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100", 
    icon: <MapPin className="w-4 h-4" />,
    description: "For geographic coordinates and map locations",
    examples: "40.7128° N, 74.0060° W"
  },
  { 
    value: "null", 
    label: "Empty", 
    color: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100", 
    icon: <AlertCircle className="w-4 h-4" />,
    description: "For optional fields that may be empty",
    examples: "null"
  },
];

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
    toast.success(`Column "${editValue}" updated successfully`);
  };

  const handleCancel = () => {
    setEditValue(cell.value);
    setEditType(cell.type);
    setIsEditing(false);
  };

  const selectedType = fieldTypes.find(t => t.value === editType);

  const renderValue = (value: Cell['value']) => {
    if (value === null) return <span className="italic text-gray-400">Empty</span>;
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
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Column?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{`${cell.value}`}"? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 
                           hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowDeleteConfirm(false);
                    toast.success(`Column "${cell.value}" deleted`);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white 
                           hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-xl border-2 border-emerald-200 shadow-lg p-5 space-y-4 
                      animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                Column {cell.colNumber + 1}
              </span>
              <span className="text-xs text-gray-400 font-mono">ID: {cell.id.slice(-8)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Column Name
            </label>
            <input
              type="text"
              value={typeof editValue === 'string' ? editValue : String(editValue)}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Enter column name..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 
                       focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 
                       outline-none text-sm transition-all"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Data Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fieldTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEditType(type.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
                           transition-all ${
                             editType === type.value
                               ? `${type.color} border-2 ring-2 ring-offset-1 ring-emerald-400`
                               : 'border-gray-200 text-gray-600 hover:border-gray-300'
                           }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
            
            {selectedType && (
              <div className={`mt-2 p-3 rounded-lg ${selectedType.color.replace('hover:bg-', 'bg-').split(' ')[0]} border`}>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium">{selectedType.description}</p>
                    <p className="text-xs mt-1 opacity-75">Example: {selectedType.examples}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl 
                       hover:bg-emerald-700 transition-colors text-sm font-medium 
                       flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl 
                       transition-colors text-sm font-medium border border-gray-200"
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
          className={`bg-white rounded-xl border-2 p-5 
                    hover:shadow-md transition-all duration-200
                    cursor-pointer group/cell relative overflow-hidden
                    ${isDragging ? 'opacity-50 border-emerald-400 shadow-lg scale-95' : 'border-gray-200'}
                    ${dragOverIndex === cell.colNumber ? 'border-emerald-400 bg-emerald-50/30 shadow-lg scale-105' : ''}
                    ${dragOverIndex !== null && dragOverIndex !== cell.colNumber ? 'scale-95' : ''}`}
        >
          {/* Drop Indicator */}
          {dragOverIndex === cell.colNumber && (
            <div className="absolute -left-1 top-0 bottom-0 w-1 bg-emerald-500 rounded-full animate-pulse" />
          )}
          
          {/* Hover Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 
                        group-hover/cell:from-emerald-50/50 group-hover/cell:to-emerald-50/30 
                        transition-all duration-300 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header with Drag Handle */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* Drag Handle */}
                <div 
                  className="p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing
                           opacity-0 group-hover/cell:opacity-100 transition-all"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>
                
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  Col {cell.colNumber + 1}
                </span>
                
                {/* Position Arrows */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover/cell:opacity-100 transition-all">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveLeft();
                        }}
                        disabled={cell.colNumber === 0}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp className="w-3 h-3 text-gray-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Move left</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveRight();
                        }}
                        disabled={cell.colNumber === totalCells - 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown className="w-3 h-3 text-gray-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Move right</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover/cell:opacity-100 
                            transition-all duration-200 transform translate-x-2 group-hover/cell:translate-x-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate();
                      }}
                      className="p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Duplicate column</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Edit column</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Delete column</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            {/* Column Content */}
            <div className="space-y-2" onClick={() => setIsEditing(true)}>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 text-lg truncate">
                  {renderValue(cell.value)}
                </h4>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                              text-xs font-medium border ${fieldTypes.find(t => t.value === cell.type)?.color}`}>
                  {fieldTypes.find(t => t.value === cell.type)?.icon}
                  {fieldTypes.find(t => t.value === cell.type)?.label}
                </span>
                <span className="text-xs text-gray-400 font-mono">
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
    toast.success(`Column "${name}" added`);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full min-h-[200px] rounded-xl border-2 border-dashed border-gray-300 
                 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-200
                 flex flex-col items-center justify-center gap-3 group"
      >
        <div className="p-4 rounded-full bg-gray-100 group-hover:bg-emerald-100 
                      group-hover:scale-110 transition-all duration-200">
          <Plus className="w-8 h-8 text-gray-400 group-hover:text-emerald-600 transition-colors" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 group-hover:text-emerald-700">
            Add New Column
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Define a new data field for your table
          </p>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-emerald-300 shadow-lg p-5 space-y-4 
                  animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">New Column</h4>
          <p className="text-xs text-gray-500">Column {nextColNumber + 1}</p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Column Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({});
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
            if (e.key === 'Escape') setIsAdding(false);
          }}
          placeholder="e.g., Phone Number, Crop Type..."
          className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all
                   ${errors.name 
                     ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                     : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                   }`}
          autoFocus
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.name}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Data Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {fieldTypes.map((fieldType) => (
            <button
              key={fieldType.value}
              onClick={() => setType(fieldType.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
                       transition-all ${
                         type === fieldType.value
                           ? `${fieldType.color} border-2 ring-2 ring-offset-1 ring-emerald-400`
                           : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
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
          className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl 
                   hover:bg-emerald-700 transition-colors text-sm font-medium 
                   flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Column
        </button>
        <button
          onClick={() => {
            setIsAdding(false);
            setErrors({});
          }}
          className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl 
                   transition-colors text-sm font-medium border border-gray-200"
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
    toast.success("Header updated successfully");
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          Header Details
        </h3>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditName(header.name);
              setEditTags(header.tags);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Header Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => {
                setEditName(e.target.value);
                if (errors.name) setErrors({});
              }}
              className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all
                       ${errors.name 
                         ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                         : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                       }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {editTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 
                                           rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium
                                           border border-emerald-200">
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button 
                    onClick={() => setEditTags(editTags.filter(t => t !== tag))}
                    className="hover:text-emerald-900 transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
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
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 
                       focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 
                       outline-none text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl 
                       hover:bg-emerald-700 transition-colors text-sm font-medium 
                       flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setErrors({});
              }}
              className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl 
                       transition-colors text-sm font-medium border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-gray-50">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Name</label>
            <p className="text-sm font-semibold text-gray-900">{header.name}</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Tag className="w-3.5 h-3.5" />
            <div className="flex flex-wrap gap-1">
              {header.tags.length > 0 ? header.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 
                                        border border-emerald-200 text-xs">
                  {tag}
                </span>
              )) : (
                <span className="italic text-gray-400">No tags</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {new Date(header.dateUpdated).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="w-3.5 h-3.5" />
            <span>Created by: {header.createdBy}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Page Component with drag and drop
export const HeaderRowEditor = () => {
  const [db, setDb] = useState<DbRef>(mockDb);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FieldDataType | "all">("all");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Get sorted cells
  const sortedCells = Object.values(db.header.cells).sort((a, b) => a.colNumber - b.colNumber);
  
  // Reorder function
  const reorderCells = useCallback((cells: Cell[], fromIndex: number, toIndex: number): Cell[] => {
    const result = [...cells];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    
    // Reassign colNumbers
    return result.map((cell, index) => ({
      ...cell,
      colNumber: index
    }));
  }, []);

  // Apply reordering to db state
  const applyReordering = useCallback((reorderedCells: Cell[]) => {
    const updatedCells: Record<number, Cell> = {};
    reorderedCells.forEach(cell => {
      updatedCells[cell.colNumber] = cell;
    });
    
    setDb(prev => ({
      ...prev,
      header: {
        ...prev.header,
        cells: updatedCells,
        dateUpdated: new Date().toISOString()
      },
      dateUpdated: new Date().toISOString()
    }));
    setHasChanges(true);
  }, []);

  // Drag and Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, colNumber: number) => {
    setDraggedIndex(colNumber);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', colNumber.toString());
    
    // Create drag image
    if (e.target instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.target, 50, 50);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, colNumber: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(colNumber);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColNumber: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === targetColNumber) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    const currentCells = Object.values(db.header.cells).sort((a, b) => a.colNumber - b.colNumber);
    const reorderedCells = reorderCells(currentCells, draggedIndex, targetColNumber);
    
    applyReordering(reorderedCells);
    setDraggedIndex(null);
    setDragOverIndex(null);
    toast.success("Column order updated");
  }, [draggedIndex, db.header.cells, reorderCells, applyReordering]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // Move column left/right by one position
  const moveColumn = useCallback((colNumber: number, direction: 'left' | 'right') => {
    const currentCells = Object.values(db.header.cells).sort((a, b) => a.colNumber - b.colNumber);
    const targetIndex = direction === 'left' ? colNumber - 1 : colNumber + 1;
    
    if (targetIndex < 0 || targetIndex >= currentCells.length) return;
    
    const reorderedCells = reorderCells(currentCells, colNumber, targetIndex);
    applyReordering(reorderedCells);
  }, [db.header.cells, reorderCells, applyReordering]);

  // Cell CRUD operations
  const handleCellUpdate = useCallback((colId: string, updatedCell: Cell) => {
    const updatedCells = {
      ...db.header.cells,
      [colId]: updatedCell
    };
    
    setDb(prev => ({
      ...prev,
      header: {
        ...prev.header,
        cells: updatedCells,
        dateUpdated: new Date().toISOString()
      },
      dateUpdated: new Date().toISOString()
    }));
    setHasChanges(true);
  }, [db.header.cells]);

  const handleCellDelete = useCallback((colNumber: number) => {
    const updatedCells = { ...db.header.cells };
    delete updatedCells[colNumber];
    
    // Re-index remaining cells
    const sortedRemaining = Object.values(updatedCells).sort((a, b) => a.colNumber - b.colNumber);
    const reindexedCells: Record<number, Cell> = {};
    sortedRemaining.forEach((cell, index) => {
      reindexedCells[index] = { ...cell, colNumber: index };
    });
    
    setDb(prev => ({
      ...prev,
      header: {
        ...prev.header,
        cells: reindexedCells,
        dateUpdated: new Date().toISOString()
      },
      dateUpdated: new Date().toISOString()
    }));
    setHasChanges(true);
  }, [db.header.cells]);

  const handleDuplicateCell = useCallback((cell: Cell) => {
    const sortedAll = Object.values(db.header.cells).sort((a, b) => a.colNumber - b.colNumber);
    const newColNumber = sortedAll.length;
    
    const duplicatedCell: Cell = {
      ...cell,
      id: generateId(),
      colNumber: newColNumber,
      value: `${cell.value} (Copy)`,
      rowId: db.header.id
    };
    
    const updatedCells = {
      ...db.header.cells,
      [newColNumber]: duplicatedCell
    };
    
    setDb(prev => ({
      ...prev,
      header: {
        ...prev.header,
        cells: updatedCells,
        dateUpdated: new Date().toISOString()
      },
      dateUpdated: new Date().toISOString()
    }));
    setHasChanges(true);
    toast.success(`Column "${cell.value}" duplicated`);
  }, [db.header.cells, db.header.id]);

  const handleAddCell = useCallback((newCell: Cell) => {
    const updatedCells = {
      ...db.header.cells,
      [newCell.colNumber]: newCell
    };
    
    setDb(prev => ({
      ...prev,
      header: {
        ...prev.header,
        cells: updatedCells,
        dateUpdated: new Date().toISOString()
      },
      dateUpdated: new Date().toISOString()
    }));
    setHasChanges(true);
  }, [db.header.cells]);

  const handleHeaderUpdate = useCallback((updatedHeader: Row) => {
    setDb(prev => ({
      ...prev,
      header: updatedHeader,
      dateUpdated: new Date().toISOString()
    }));
    setHasChanges(true);
  }, []);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Saving database:", db);
      setHasChanges(false);
      toast.success("All changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (hasChanges) {
      setDb(mockDb);
      setHasChanges(false);
      setDraggedIndex(null);
      setDragOverIndex(null);
      toast.info("Changes have been reset");
    }
  };

  // Filter cells
  const filteredCells = sortedCells.filter(cell => {
    const matchesSearch = String(cell.value).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || cell.type === filterType;
    return matchesSearch && matchesType;
  });

  // Type statistics
  const typeStats = fieldTypes.map(type => ({
    ...type,
    count: sortedCells.filter(cell => cell.type === type.value).length
  })).filter(stat => stat.count > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors group">
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{db.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium 
                                border border-emerald-200 flex items-center gap-1.5">
                    <Database className="w-3 h-3" />
                    Editing Header
                  </span>
                </div>
                {db.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{db.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {hasChanges && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full 
                              bg-amber-50 border border-amber-200">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-sm font-medium text-amber-700">Unsaved changes</span>
                </div>
              )}
              
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 
                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all text-sm font-medium flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
              
              <button
                onClick={handleSaveAll}
                disabled={!hasChanges || isSaving}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white 
                         hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition-all text-sm font-medium flex items-center gap-2 shadow-sm
                         hover:shadow-md"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Drag Instructions */}
        <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
            <GripVertical className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-1">Column Reordering</h3>
            <p className="text-xs text-emerald-700">
              Drag and drop columns using the grip handles to rearrange their order. 
              You can also use the arrow buttons or move columns left/right.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <HeaderDetails header={db.header} onUpdate={handleHeaderUpdate} />
              
              {/* Column Stats */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Column Analytics</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-xs text-gray-600">Total Columns</span>
                    <span className="text-sm font-bold text-gray-900">{sortedCells.length}</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    {typeStats.map((type) => (
                      <div key={type.value} className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full 
                                      text-xs font-medium border ${type.color}`}>
                          {type.icon}
                          {type.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${(type.count / sortedCells.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 w-4 text-right">
                            {type.count}
                          </span>
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
            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search columns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 
                             focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 
                             outline-none text-sm transition-all"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FieldDataType | "all")}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 
                           focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 
                           outline-none text-sm font-medium bg-white"
                >
                  <option value="all">All Types</option>
                  {fieldTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {(searchTerm || filterType !== "all") && (
                <p className="text-xs text-gray-500 mt-3">
                  Showing {filteredCells.length} of {sortedCells.length} columns
                </p>
              )}
            </div>
            
            {/* Columns Grid */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                {filteredCells.length} Column{filteredCells.length !== 1 ? 's' : ''}
              </h2>
              
              <div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                onDragEnd={handleDragEnd}
              >
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
                    <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No columns found</p>
                    {(searchTerm || filterType !== "all") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterType("all");
                        }}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-2"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
                
                {/* Add New Column Card */}
                {(!searchTerm && filterType === "all") && (
                  <NewColumnForm 
                    nextColNumber={sortedCells.length} 
                    headerId={db.header.id}
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