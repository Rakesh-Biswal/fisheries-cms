"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

export default function FarmLocations() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Farm Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-900">
            Farm Locastons
          </div>

          {/* Map Placeholder */}
          <div className="h-48 bg-blue-50 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
            <div className="relative z-10 flex items-center gap-2 text-blue-700">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Interactive Farm Map</span>
            </div>

            {/* Mock location pins */}
            <div className="absolute top-4 left-6 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-green-600 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="flex items-center justify-end">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
