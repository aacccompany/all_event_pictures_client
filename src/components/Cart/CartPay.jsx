import React, { useState } from 'react';

// --- Icon Components (ยังคงไว้เพื่อความสวยงาม) ---
const TrashIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const UserIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MailIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
const CheckCircleIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ShoppingBagIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;

// Component สำหรับหน้าขอลิงก์ดาวน์โหลด
const CartDownload = () => {
    // ข้อมูลรูปภาพเริ่มต้น (เอาราคาออก)
    const initialCart = [
        { id: 'p1', name: 'รูปจากงาน Chiang Mai Marathon 2025', imageUrl: 'https://placehold.co/64x64/3498db/ffffff?text=Photo+1' },
    ];

    const [cartItems, setCartItems] = useState(initialCart);
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });
    const [submissionSuccess, setSubmissionSuccess] = useState(false); // เปลี่ยนชื่อ state
    const [error, setError] = useState(null);

    // ฟังก์ชันสำหรับลบรูปภาพออกจากรายการ
    const handleRemoveItem = (itemId) => {
        setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
    };

    // ฟังก์ชันสำหรับส่งคำขอดาวน์โหลด
    const handleDownloadRequest = (e) => {
        e.preventDefault();
        setError(null); // ล้างข้อผิดพลาดเก่า
        if (cartItems.length === 0) {
            setError("Please add photos to your cart before proceeding.");
            return;
        }
        if (!customerInfo.name || !customerInfo.email) {
            setError("Please fill in your name and email.");
            return;
        }
        
        // จำลองการส่งข้อมูล (ไม่มีข้อมูลการชำระเงิน)
        console.log("Download Request Submitted:", {
            customerInfo,
            items: cartItems,
            totalItems: cartItems.length,
        });

        // แสดงหน้ายืนยันและล้างรายการ
        setSubmissionSuccess(true);
        setCartItems([]);
    };

    // --- Render Logic ---

    // หน้าแสดงผลเมื่อส่งคำขอสำเร็จ
    if (submissionSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
                <CheckCircleIcon className="w-24 h-24 text-green-500 mb-6"/>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Request Sent Successfully!</h2>
                <p className="text-gray-600 mb-6">Your download link will be sent to your email shortly.</p>
                <button 
                    onClick={() => {
                        setSubmissionSuccess(false);
                        setCartItems(initialCart); // กลับไปที่สถานะเริ่มต้น
                    }} 
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Select More Photos
                </button>
            </div>
        );
    }

    // หน้าฟอร์มหลัก
    return (
        <>
            <style>{`
                body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; }
            `}</style>
            <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
                
                {error && <div className="text-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

                {cartItems.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-lg shadow-md">
                        <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500">You have no photos selected.</p>
                    </div>
                ) : (
                    <form onSubmit={handleDownloadRequest} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Cart Items & Customer Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">Your Photos ({cartItems.length})</h2>
                                <div className="divide-y divide-gray-200">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex items-center space-x-4 py-4">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg"/>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-700">{item.name}</p>
                                                <p className="text-sm text-gray-500">Photo ID: {item.id}</p>
                                                {/* --- PRICE REMOVED --- */}
                                            </div>
                                            <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Where should we send your download link?</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="text-gray-400 w-4 h-4"/></div>
                                            <input type="text" id="name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Your full name" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon className="text-gray-400 w-4 h-4"/></div>
                                            <input type="email" id="email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="your@email.com" required />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-4">Your final photos (without watermark) will be sent to this email.</p>
                            </div>
                        </div>

                        {/* Right Column: Summary & Submit Button */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Download Summary</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-800 font-bold text-lg">
                                        <span>Total Photos</span>
                                        <span>{cartItems.length}</span>
                                    </div>
                                </div>
                                
                                {/* --- PAYMENT SECTION REMOVED --- */}
                                
                                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                                    Request Download Link
                                </button>
                                <p className="text-xs text-gray-500 mt-4 text-center">
                                    By proceeding, you agree to our terms of service and privacy policy.
                                </p>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

export default CartDownload;
