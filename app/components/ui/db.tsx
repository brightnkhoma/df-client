"use client";
import { DbRef } from "@/app/lib/types/dbref";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Database, ArrowRight, Users } from "lucide-react";
import React, { useState } from "react";

export const DB : React.FC<DbRef>= ({id,name,description}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="group relative flex flex-col items-center p-6 rounded-2xl 
                     bg-white border border-gray-200 shadow-sm
                     hover:shadow-lg hover:border-emerald-300 
                     active:shadow-inner active:scale-[0.98]
                     transition-all duration-200 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="View Farmers Database"
          >
            {/* Icon Container */}
            <div className="relative mb-4 p-4 rounded-full bg-emerald-50 
                          group-hover:bg-emerald-100 transition-colors duration-200">
              <Database 
                className="w-12 h-12 text-emerald-700 group-hover:text-emerald-800 
                         transition-colors duration-200" 
                strokeWidth={1.5}
              />
              {/* Animated indicator */}
              <Users 
                className={`absolute -top-1 -right-1 w-5 h-5 text-emerald-600 
                         transition-all duration-300 ${
                           isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                         }`} 
              />
            </div>
            
            {/* Label */}
            <span className="text-xl font-semibold text-gray-900 mb-2">
              {name}
            </span>
            
            {/* Subtitle */}
            <span className="text-sm text-gray-500 mb-3">
              Database Management
            </span>
            
            {/* CTA */}
            <div className={`flex items-center gap-1 text-xs font-medium text-emerald-600 
                          transition-all duration-300 ${
                            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                          }`}>
              <span>View Database</span>
              <ArrowRight className="w-3 h-3" />
            </div>
            
            {/* Hover overlay effect */}
            <div className={`absolute inset-0 rounded-2xl bg-emerald-50/50 
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
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-200" />
              <span className="font-semibold text-white text-sm">{name} Database</span>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-gray-700 text-sm">
              Click to view and manage the complete {name} database
            </p>
            <p className="text-gray-500 text-xs mt-1">
              View records, update information, and manage {name} profiles
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};