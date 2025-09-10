"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

export function SchemeFilters({ onFilterChange, onSearchChange }) {
  const [activeFilters, setActiveFilters] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const filterOptions = [
    { id: "live", label: "Live Schemes", count: 15 },
    { id: "expiring", label: "Expiring Soon", count: 8 },
    { id: "expired", label: "Expired", count: 12 },
    { id: "high-subsidy", label: "High Subsidy (₹50L+)", count: 6 },
    { id: "quick-approval", label: "Quick Approval", count: 10 },
    { id: "infrastructure", label: "Infrastructure", count: 7 },
    { id: "equipment", label: "Equipment", count: 9 },
    { id: "training", label: "Training & Development", count: 5 },
  ]

  const handleFilterToggle = (filterId) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((f) => f !== filterId)
      : [...activeFilters, filterId]

    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setSearchTerm("")
    onFilterChange([])
    onSearchChange("")
  }

  return (
    <Card className="mb-6 lg:mb-8">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schemes by name, category, or keywords..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-12 sm:h-10 text-base sm:text-sm"
            />
          </div>

          {/* Filter Options */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-semibold flex items-center gap-2 text-base sm:text-sm">
                <Filter className="h-4 w-4" />
                Filter Schemes
              </h3>
              {(activeFilters.length > 0 || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="self-start sm:self-auto">
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {filterOptions.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle(filter.id)}
                  className="justify-between h-auto py-3 sm:py-2 px-3 text-sm"
                >
                  <span className="text-xs sm:text-xs truncate">{filter.label}</span>
                  <Badge variant="secondary" className="ml-2 text-xs flex-shrink-0">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground flex-shrink-0">Active filters:</span>
              {activeFilters.map((filterId) => {
                const filter = filterOptions.find((f) => f.id === filterId)
                return (
                  <Badge key={filterId} variant="default" className="flex items-center gap-1 text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">{filter?.label}</span>
                    <X className="h-3 w-3 cursor-pointer flex-shrink-0" onClick={() => handleFilterToggle(filterId)} />
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
