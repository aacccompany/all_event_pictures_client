import React, { useState } from 'react';

// ข้อมูลจำลองลูกค้าและโปรเจกต์
const initialClients = [
  {
    id: 1,
    name: "Miss Universe Thailand",
    logo: "/mut.jpg", // ใส่ URL โลโก้จริง
    description: "'งานการประกวด Miss Universe Thailand"
  },
  {
    id: 2,
    name: "หอการค้าจังหวัดขอนแก่น",
    logo: "/kkcc.png",
    description: "ระบบจัดการเอกสารภาษีอิเล็กทรอนิกส์สำหรับองค์กรขนาดใหญ่"
  },
  {
    id: 3,
    name: "สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa)",
    logo: "/depa.jpg",
    description: "ระบบจัดการเอกสารภาษีอิเล็กทรอนิกส์สำหรับองค์กรขนาดใหญ่"
  },
  {
    id: 4,
    name: "KK Digital Valley",
    logo: "/KK Digital Valley White BG.png",
    description: "ระบบจัดการเอกสารภาษีอิเล็กทรอนิกส์สำหรับองค์กรขนาดใหญ่"
  },
  {
    id: 5,
    name: "Wine O'clock Khon Kaen",
    logo: "/wine.jpg",
    description: "แพลตฟอร์มซื้อขายภาพถ่ายจากงานอีเวนต์ต่างๆ ทั่วประเทศ"
  },
];

const RefPage = () => {
  const [clients, setClients] = useState(initialClients);

  const handleLogoChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id ? { ...client, logo: reader.result } : client
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
          References
        </h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          OUR REFERENCES
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative group border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors overflow-hidden">
                {/* Logo Display */}
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
                
                {/* File Input Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer text-white text-xs font-bold px-3 py-1 bg-blue-600 rounded-full">
                    Change Logo
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleLogoChange(client.id, e)}
                    />
                  </label>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{client.name}</h3>
              {/* <p className="text-gray-600 text-sm leading-relaxed">
                {client.description}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefPage;
