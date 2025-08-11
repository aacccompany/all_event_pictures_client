import React from 'react';
import EventCreate from './EventCreate';


const eventsData = [
    {
        id: 1,
        name: 'KK Run 2025',
        date: '2025-12-15',
        status: 'Active',
        revenue: '112,000 THB',
        photographers: 'Phutanet Dek Nerd',
    },
    {
        id: 2,
        name: 'KK Night Run',
        date: '2025-11-09',
        status: 'Recent',
        revenue: '86,400 THB',
        photographers: 'Flixshot Creation',
    },
    {
        id: 3,
        name: 'KK Long Run',
        date: '2025-11-09',
        status: 'Closed',
        revenue: '90,000THB',
        photographers: 'Flixshot Creation',
    },
    {
        id: 3,
        name: 'KK Mini Marathon',
        date: '2025-11-09',
        status: 'Active',
        revenue: '200,000 THB',
        photographers: 'Phutanet Dek Nerd',
    },
];


const EventCreateContainer = () => {
    return (

        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/*Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage your organized events</p>
                    </div>
                    <EventCreate/>
                </header>

                {/* White Card for Show Event list */}
                <main className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800">Event Overview</h2>
                    </div>

                    {/* Table Mini Screen Scroll */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photographers</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Loop eventsData */}
                                {eventsData.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {/*Status Condition*/}
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${
                                                    event.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                                    event.status === 'Recent' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-red-100 text-red-500'
                                                    }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{event.revenue}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.photographers}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EventCreateContainer;
