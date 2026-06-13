"use client";
import { DbRef } from "@/app/lib/types/dbref";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Database, ArrowRight, Users, Calendar, Tag } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const DB: React.FC<DbRef> = ({ id, name, description, dateUpdated, tags, header }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const columnCount = header?.cells ? Object.keys(header.cells).length : 0;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    router.push(`/dbref/${id}`);
  };

  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className="group relative flex flex-col items-center p-6 w-full
                     bg-gray-900 border border-white/[0.04]
                     hover:border-emerald-500/20 hover:bg-emerald-500/[0.02]
                     active:scale-[0.98]
                     transition-all duration-500 ease-out
                     focus:outline-none focus:border-emerald-500/30"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`View ${name} Database`}
          >
            {/* Icon Container */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-emerald-500/5 blur-xl transition-all duration-500
                            group-hover:bg-emerald-500/10" />
              <div className="relative p-4 bg-white/[0.02] border border-white/[0.04]
                            group-hover:border-emerald-500/20 group-hover:bg-emerald-500/[0.02]
                            transition-all duration-500">
                <Database 
                  className="w-10 h-10 text-gray-500 group-hover:text-emerald-400/60 
                           transition-colors duration-500" 
                  strokeWidth={1.5}
                />
              </div>
              
              {/* Column count indicator */}
              <div className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-emerald-500/10 
                            border border-emerald-500/20 text-[10px] font-light text-emerald-400/60
                            transition-all duration-500 ${
                              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`}>
                {columnCount}
              </div>
            </div>
            
            {/* Database Name */}
            <h3 className="text-base font-light text-gray-300 mb-1.5 tracking-wide
                         group-hover:text-gray-200 transition-colors duration-500
                         truncate max-w-full">
              {name}
            </h3>
            
            {/* Description */}
            {description ? (
              <p className="text-xs text-gray-600 font-light mb-3 tracking-wide
                          line-clamp-2 text-center max-w-full">
                {description}
              </p>
            ) : (
              <span className="text-xs text-gray-700 font-light mb-3 italic tracking-wide">
                No description
              </span>
            )}
            
            {/* Meta Info */}
            <div className="flex items-center gap-3 mb-3">
              {dateUpdated && (
                <span className="flex items-center gap-1 text-[10px] text-gray-600 font-light">
                  <Calendar className="w-3 h-3" strokeWidth={1.5} />
                  {formatDate(dateUpdated)}
                </span>
              )}
              {columnCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-gray-600 font-light">
                  <Database className="w-3 h-3" strokeWidth={1.5} />
                  {columnCount} fields
                </span>
              )}
            </div>
            
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mb-3">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-emerald-500/5 text-emerald-400/50 
                             text-[10px] font-light border border-emerald-500/10"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-[10px] text-gray-600 font-light">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {/* CTA */}
            <div className={`flex items-center gap-2 text-xs font-light tracking-wide text-emerald-400/60 
                          transition-all duration-500 ${
                            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                          }`}>
              <span>View Database</span>
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
              <Database className="w-4 h-4 text-emerald-400/60" strokeWidth={1.5} />
              <span className="font-light text-gray-200 text-sm tracking-wide">{name}</span>
            </div>
          </div>
          <div className="px-4 py-3 space-y-1.5">
            {description && (
              <p className="text-gray-400 text-sm font-light">{description}</p>
            )}
            <p className="text-gray-600 text-xs font-light tracking-wide">
              {columnCount} field{columnCount !== 1 ? 's' : ''} defined · 
              {tags && tags.length > 0 ? ` ${tags.length} tag${tags.length !== 1 ? 's' : ''}` : ' No tags'}
            </p>
            {dateUpdated && (
              <p className="text-gray-600 text-xs font-light tracking-wide">
                Last updated: {formatDate(dateUpdated)}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

// List view variant for the database list page
export const DBListItem: React.FC<DbRef & { viewMode?: "grid" | "list" }> = ({ 
  id, name, description, dateUpdated, tags, header, viewMode 
}) => {
  const router = useRouter();
  const columnCount = header?.cells ? Object.keys(header.cells).length : 0;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === "list") {
    return (
      <button
        onClick={() => router.push(`/dbref/${id}`)}
        className="w-full grid grid-cols-12 gap-4 px-4 py-3 bg-gray-900 border border-white/[0.04]
                 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02]
                 transition-all duration-300 text-left group"
      >
        <div className="col-span-4 flex items-center gap-3">
          <div className="p-1.5 bg-emerald-500/5 border border-emerald-500/10 flex-shrink-0">
            <Database className="w-3.5 h-3.5 text-emerald-400/60" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-light text-gray-300 truncate group-hover:text-gray-200 transition-colors">
            {name}
          </span>
        </div>
        
        <div className="col-span-3 flex items-center">
          <p className="text-xs text-gray-500 font-light truncate">
            {description || <span className="italic text-gray-700">No description</span>}
          </p>
        </div>
        
        <div className="col-span-2 flex items-center gap-1">
          {tags && tags.length > 0 ? (
            <>
              <span className="px-1.5 py-0.5 bg-emerald-500/5 text-emerald-400/50 text-[10px] font-light border border-emerald-500/10">
                {tags[0]}
              </span>
              {tags.length > 1 && (
                <span className="text-[10px] text-gray-600 font-light">+{tags.length - 1}</span>
              )}
            </>
          ) : (
            <span className="text-[10px] text-gray-700 font-light italic">No tags</span>
          )}
        </div>
        
        <div className="col-span-2 flex items-center">
          <span className="text-xs text-gray-600 font-light">
            {dateUpdated ? formatDate(dateUpdated) : 'N/A'}
          </span>
        </div>
        
        <div className="col-span-1 flex items-center">
          <span className="text-xs text-gray-500 font-light">{columnCount}</span>
        </div>
      </button>
    );
  }

  return <DB id={id} name={name} description={description} dateUpdated={dateUpdated} tags={tags} header={header} dateCreated={""} createdBy={""} />;
};

export default DB;