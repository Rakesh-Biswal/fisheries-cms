// components/Hrcomponent/HolidayBanner.js
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

const HolidayBanner = ({ isHoliday, holidayInfo }) => {
    if (!isHoliday || !holidayInfo) return null;

    return (
        <Card className="bg-indigo-50 border-indigo-200 mb-6">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <AlertCircle className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-800">Holiday Notice</h3>
                            <p className="text-indigo-700 text-sm">
                                {holidayInfo.title} - {holidayInfo.description}
                            </p>
                            {holidayInfo.departments && (
                                <p className="text-indigo-600 text-xs mt-1">
                                    Affected departments: {holidayInfo.departments.join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-200 text-indigo-800">
                        Holiday
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

export default HolidayBanner;