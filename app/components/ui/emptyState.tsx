"use client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Database, ArrowRight, Plus, Sparkles, FolderOpen, LayoutGrid, Search } from "lucide-react";
import { useState } from "react";

export const NewDB = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
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
            Start Fresh Project
          </span>
          
          {/* CTA */}
          <div className={`flex items-center gap-1 text-xs font-medium text-emerald-600 
                        transition-all duration-300 ${
                          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                        }`}>
            <span>Create Now</span>
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
            Create a new database from scratch
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Set up tables, fields, and start adding your data
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

// Empty State Page
export const DatabaseEmptyState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
     
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Empty State Container */}
        <div className="flex flex-col items-center justify-center">
          {/* Illustration Section */}
          <div className="relative mb-8">
            {/* Background circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-emerald-50 animate-pulse" />
              <div className="absolute w-24 h-24 rounded-full bg-emerald-100/50" />
            </div>
            
            {/* Main Icon */}
            <div className="relative p-6 rounded-full bg-white shadow-lg border border-gray-100">
              <FolderOpen className="w-16 h-16 text-gray-300" strokeWidth={1} />
              {/* Small decorative elements */}
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
            <NewDB />
          </div>
          
          {/* Quick Tips Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="p-2 rounded-lg bg-blue-50 flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Flexible Structure</h3>
                <p className="text-xs text-gray-500">Define your own fields and customize data types</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="p-2 rounded-lg bg-purple-50 flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Secure Storage</h3>
                <p className="text-xs text-gray-500">Your data is encrypted and backed up automatically</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="p-2 rounded-lg bg-orange-50 flex-shrink-0">
                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Quick Setup</h3>
                <p className="text-xs text-gray-500">Get started in minutes with intuitive setup process</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Optional: Bottom spacing for better scroll experience */}
      <div className="h-8" />
    </div>
  );
};

// Export the page component
export default DatabaseEmptyState;