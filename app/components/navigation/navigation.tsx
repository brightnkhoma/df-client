"use client"

import { Database, Search, LayoutGrid } from "lucide-react"


export const Navigation = ()=>{


    return(
        <div className="flex w-full sticky top-0">
             {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm w-full">
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

        </div>
    )
}