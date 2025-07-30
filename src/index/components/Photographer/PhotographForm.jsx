import React from 'react';

// --- Mock UI Components for Demonstration ---
// In a real project, you would import these from your UI library (e.g., shadcn/ui).

const Card = ({ className, children }) => (
  <div className={`bg-white rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

const Label = ({ htmlFor, className, children }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}>
    {children}
  </label>
);

const Input = ({ id, type = "text", placeholder, className }) => (
  <input
    type={type}
    id={id}
    placeholder={placeholder}
    className={`block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${className}`}
  />
);

const Button = ({ className, children }) => (
  <button className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 ${className}`}>
    {children}
  </button>
);


const PhotographForm = () => {
    // An array to hold form field data, making the form easier to manage and scale.
    const formFields = [
        { id: "f_name", label: "First Name", placeholder: "Fistname" },
        { id: "l_name", label: "Last Name", placeholder: "Lastname" },
        { id: "tel", label: "Phone Number", placeholder: "081-xxx-xxxx", type: "tel" },
        { id: "age", label: "Age", placeholder: "Your Age", type: "number" },
        { id: "address-line1", label: "Address (Street, Building, etc.)", placeholder: "99/99 Moo 9, Example Building", colSpan: true },
        { id: "subdistrict", label: "Sub-district / Khwaeng", placeholder: "Khlong Tan Nuea" },
        { id: "district", label: "District / Khet", placeholder: "Watthana" },
        { id: "province", label: "Province", placeholder: "Bangkok" },
        { id: "postal-code", label: "Postal Code", placeholder: "10110", type: "number" },
    ];

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted!");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700">
                        Photographer Profile
                    </h1>
                    <p className="mt-2 text-md text-gray-600">
                        Complete your profile to get started.
                    </p>
                </div>
                <Card className="p-8 sm:p-10">
                    <form onSubmit={handleSubmit}>
                        {/* Responsive grid for form fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            {formFields.map((field) => (
                                <div key={field.id} className={field.colSpan ? 'md:col-span-2' : ''}>
                                    <Label htmlFor={field.id}>{field.label}</Label>
                                    <Input
                                        type={field.type || 'text'}
                                        id={field.id}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Button type="submit">
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};


// Main App component to render the form
export default function App() {
    return (
        <PhotographForm />
    );
}
