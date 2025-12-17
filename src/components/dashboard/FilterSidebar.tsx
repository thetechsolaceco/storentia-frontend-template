"use client";

import React from "react";
import { X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilters } from "@/contexts/FilterContext";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSection {
  id: string;
  title: string;
  type: "checkbox";
  options: FilterOption[];
}

interface FilterSidebarProps {
  filters: FilterSection[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (sectionId: string, optionId: string) => void;
  onClearAll: () => void;
  title?: string;
}

export default function FilterSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  title = "Filters",
}: FilterSidebarProps) {
  const { toggleFilterSidebar } = useFilters();

  return (
    <div className="w-80 h-full bg-white border-l border-slate-200 shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <h2 className="font-semibold text-slate-900">{title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFilterSidebar}
          className="h-8 w-8 hover:bg-slate-100"
        >
          <X className="w-4 h-4 text-slate-500" />
        </Button>
      </div>

      {/* Filter Content */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-8">
          {filters.map((section) => (
            <div key={section.id} className="space-y-3">
              <h3 className="text-sm font-medium text-slate-900">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.options.map((option) => {
                  const isChecked =
                    selectedFilters[section.id]?.includes(option.id) || false;
                  return (
                    <div
                      key={option.id}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${section.id}-${option.id}`}
                          checked={isChecked}
                          onCheckedChange={() =>
                            onFilterChange(section.id, option.id)
                          }
                        />
                        <Label
                          htmlFor={`${section.id}-${option.id}`}
                          className={cn(
                            "text-sm cursor-pointer transition-colors",
                            isChecked
                              ? "text-slate-900 font-medium"
                              : "text-slate-600 group-hover:text-slate-900"
                          )}
                        >
                          {option.label}
                        </Label>
                      </div>
                      {option.count !== undefined && (
                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                          {option.count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <Button
          variant="outline"
          className="w-full text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-white"
          onClick={onClearAll}
        >
          Clear all filters
        </Button>
      </div>
    </div>
  );
}
