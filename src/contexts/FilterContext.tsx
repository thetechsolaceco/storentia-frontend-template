"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleFilterSidebar: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const toggleFilterSidebar = () => setIsFilterSidebarOpen((prev) => !prev);

  return (
    <FilterContext.Provider
      value={{
        selectedFilters,
        setSelectedFilters,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
        toggleFilterSidebar,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
