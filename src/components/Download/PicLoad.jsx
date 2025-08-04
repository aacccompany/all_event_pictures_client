import React from 'react';
// 1. Import the icons you want to use
import { CalendarDays, Mail, Download } from 'lucide-react';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PicLoad = () => {
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="text-center py-6">
                <h2 className="text-3xl font-bold text-blue-700 sm:text-4xl lg:text-5xl">
                    Download Your Photos
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Enter your event name and email to retrieve your past purchases.Photos are available for download within 90 days of purchase.
                </p>
            </div>
            <div className="flex justify-center">
                <Card className="w-full max-w-3xl shadow-lg rounded-xl">
                    <CardHeader>
                        {/* 2. Add the icon next to the title */}
                        <div className="flex items-center gap-3">
                            <Download className="h-7 w-7 text-blue-700" />
                            <CardTitle className="text-2xl">Retrieve your purchase</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Column 1: Event Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="e_name">Event Name</Label>
                                    {/* 3. Add the icon inside a relative container */}
                                    <div className="relative flex items-center">
                                        <CalendarDays className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                        <Input id="e_name" type="text" placeholder="e.g., Chiang Mai Marathon 2025" className="pl-10 w-full" />
                                    </div>
                                </div>
                                
                                {/* Column 2: Email Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    {/* 4. Add the icon inside a relative container */}
                                    <div className="relative flex items-center">
                                        <Mail className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                        <Input id="email" type="email" placeholder="your@email.com" className="pl-10 w-full" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full">
                            <Button className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
                                Search
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PicLoad;
