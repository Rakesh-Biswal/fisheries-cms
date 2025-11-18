// components/PM_Component/data-management-panel.js
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw } from "lucide-react";

export default function DataManagementPanel({ onDataUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await onDataUpdate();
    setLoading(false);
  };

  const handleExport = () => {
    // Implement export functionality
    alert("Export functionality would be implemented here");
  };

  const handleImport = () => {
    // Implement import functionality
    alert("Import functionality would be implemented here");
  };

  return (
    <div className="fixed bottom-6 right-6 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="shadow-md"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleImport}
        className="shadow-md"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={loading}
        className="shadow-md"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}