import React from 'react';

// --- Mock Components for Demonstration ---
// In your actual project, you would import these from your UI library.

const Card = ({ className, children }) => (
  <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>{children}</h3>
);

const CardDescription = ({ className, children }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

// --- Mock Icons for Demonstration ---
// In your actual project, you would import these from 'lucide-react'.

const IconWrapper = ({ children }) => (
    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
        {React.cloneElement(children, { className: "w-8 h-8 text-blue-600" })}
    </div>
);

const Search = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const Upload = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);
const Images = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);
const Download = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);


const HowItWorks = () => {
    // Data for the steps to avoid repetition in JSX
    const steps = [
        {
            icon: <Search />,
            title: "Select Event",
            description: "Choose your event from our extensive gallery."
        },
        {
            icon: <Upload />,
            title: "Upload Face",
            description: "Upload your photo to find yourself instantly."
        },
        {
            icon: <Images />,
            title: "Choose Photos",
            description: "Select your favorite photos and add them to the cart."
        },
        {
            icon: <Download />,
            title: "Checkout & Download",
            description: "Complete payment and instantly download your photos."
        }
    ];

    return (
        // Section container with responsive padding
        <div className="bg-gray-50 py-16 sm:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Finding your event photos is simple and fast.
                    </p>
                </div>

                {/* Grid container for the cards */}
                {/* It's a 1-col grid on mobile, 2-col on tablets, and 4-col on desktops */}
                <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <Card key={index} className="text-center transition-transform transform hover:scale-105 hover:shadow-lg">
                            <CardHeader className="flex flex-col items-center">
                                <IconWrapper>{step.icon}</IconWrapper>
                                <CardTitle>{step.title}</CardTitle>
                                <CardDescription className="mt-2">{step.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};


// Main App component to render the HowItWorks section
export default HowItWorks
