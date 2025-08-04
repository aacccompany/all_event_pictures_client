import React, { useState, useEffect, useMemo } from 'react';

// --- Icon Components (ยังคงไว้เพื่อความสวยงาม) ---
const TrashIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const UserIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MailIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
const CheckCircleIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ShoppingBagIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const CreditCardIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
const QrCodeIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="14" y1="14" x2="14" y2="21"></line><line x1="21" y1="14" x2="21" y2="21"></line><line x1="14" y1="14" x2="21" y2="14"></line></svg>;
const PayPalIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor" ><path d="M7.068 21.344c-1.33-1.03-1.637-2.583-1.01-4.21.68-1.76 2.336-2.738 4.01-2.738h2.298c3.29 0 5.426-2.25 5.895-5.323.04-.25.115-.734.115-.734-.034-.153-.08-.31-.13-.46-.382-1.26-1.42-2.11-2.67-2.11-1.38 0-2.45.923-2.83 2.22-.01.046-.02.09-.03.136-.24 1.32-1.56 2.25-2.98 2.25h-1.47c-.75 0-1.39.46-1.63 1.15-.2.58-.02 1.25.46 1.63l.01.01c.06.05.13.08.2.12l.09.04.09.05c.09.04.18.09.27.13.19.09.38.17.58.25.04.02.08.03.12.05.21.09.43.17.65.24.03.01.07.02.1.03.24.08.48.15.72.22.01 0 .02.01.03.01.25.07.5.13.75.19.01 0 .01 0 .02.01.27.06.54.12.8.17.02 0 .03.01.05.01.26.05.51.09.76.13.04.01.08.01.12.02.24.04.48.07.71.1.03 0 .05.01.08.01.25.03.5.05.74.06.06 0 .12.01.18.01.22.02.44.03.66.03.01 0 .02 0 .03.01.19.01.39.01.58.01h.02c.16 0 .32 0 .48-.01l.08-.01h.02c.15-.01.29-.02.44-.03.07-.01.14-.01.2-.02.15-.02.29-.04.44-.06.06-.01.13-.02.19-.03.13-.02.26-.05.39-.08.05-.01.1-.02.15-.04.13-.03.25-.06.38-.1.03-.01.07-.02.1-.03.12-.04.24-.08.36-.12.03-.01.06-.02.09-.04.11-.04.22-.08.33-.13l.06-.03c.1-.05.2-.11.29-.17.01-.01.03-.02.04-.03.09-.06.18-.13.26-.2.03-.02.05-.04.08-.06.08-.07.16-.14.24-.22.01-.01.01-.01.02-.02.07-.07.14-.15.21-.23a.97.97 0 0 0 .18-.24c.01-.02.02-.04.03-.06.05-.09.1-.18.14-.28.01-.02.02-.05.03-.07.04-.1.08-.2.11-.3.01-.03.02-.06.02-.08.03-.1.05-.2.07-.3l.01-.03c.01-.04.02-.08.03-.12.02-.09.03-.18.04-.27v-.02c.01-.08.01-.15.01-.23a2.8 2.8 0 0 0-.08-1.03c-.13-.44-.35-.85-.63-1.21-.28-.35-.62-.66-1-.92-.39-.26-.82-.47-1.28-.62-1.33-.44-2.84-.6-4.38-.48-3.29.25-5.92 2.8-6.18 6.08-.01.13-.01.26-.01.39z"/></svg>;

const CartPay = () => {
    // ข้อมูลสินค้าเริ่มต้น (สำหรับสาธิต)
    const initialCart = [
        { id: 'p1', name: 'รูปจากงาน Chiang Mai Marathon 2025', price: 59, imageUrl: 'https://placehold.co/64x64/3498db/ffffff?text=Photo+1' },
    ];

    const [cartItems, setCartItems] = useState(initialCart);
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState(null);

    // ฟังก์ชันสำหรับลบสินค้าออกจากตะกร้า (ทำงานกับ state ภายใน)
    const handleRemoveItem = (itemId) => {
        setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
    };

    // ฟังก์ชันสำหรับจัดการการชำระเงิน
    const handleCheckout = (e) => {
        e.preventDefault();
        setError(null); // ล้างข้อผิดพลาดเก่า
        if (cartItems.length === 0) {
            setError("กรุณาเพิ่มสินค้าลงในตะกร้าก่อน");
            return;
        }
        if (!customerInfo.name || !customerInfo.email) {
            setError("กรุณากรอกชื่อและอีเมลให้ครบถ้วน");
            return;
        }
        
        // จำลองการส่งข้อมูล
        console.log("Order Submitted:", {
            customerInfo,
            paymentMethod,
            items: cartItems,
            totalPrice: subtotal,
        });

        // แสดงหน้ายืนยันและล้างตะกร้า
        setOrderPlaced(true);
        setCartItems([]);
    };

    const paymentOptions = {
        'credit-card': { name: 'Credit/Debit Card', icon: <CreditCardIcon className="w-5 h-5 text-gray-500" /> },
        'promptpay': { name: 'PromptPay', icon: <QrCodeIcon className="w-5 h-5 text-gray-500" /> },
        // 'paypal': { name: 'PayPal', icon: <PayPalIcon className="w-5 h-5 text-gray-500" /> },
    };

    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    }, [cartItems]);

    // --- Render Logic ---
    if (orderPlaced) return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
            <CheckCircleIcon className="w-24 h-24 text-green-500 mb-6"/>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">ขอบคุณสำหรับคำสั่งซื้อ!</h2>
            <p className="text-gray-600 mb-6">เราได้รับคำสั่งซื้อของคุณแล้ว และลิงก์สำหรับดาวน์โหลดจะถูกส่งไปที่อีเมลของคุณเร็วๆ นี้</p>
            <button 
                onClick={() => {
                    setOrderPlaced(false);
                    setCartItems(initialCart); // กลับไปที่สถานะเริ่มต้น
                }} 
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
                กลับไปหน้าแรก
            </button>
        </div>
    );

    return (
        <>
            <style>{`
                body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; }
                .custom-radio:checked { background-color: #3b82f6; border-color: #3b82f6; }
                .custom-radio:checked::after { content: ''; display: block; width: 0.5rem; height: 0.5rem; border-radius: 50%; background-color: white; transform: translate(50%, 50%); }
            `}</style>
            <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Photo Cart</h1>
                
                {error && <div className="text-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

                {cartItems.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-lg shadow-md">
                        <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">ตะกร้าของคุณว่างเปล่า</h2>
                        <p className="text-gray-500">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
                    </div>
                ) : (
                    <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">Your Photos ({cartItems.length})</h2>
                                <div className="divide-y divide-gray-200">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex items-center space-x-4 py-4">
                                            <img src={item.imageUrl || "https://placehold.co/64x64/d1d5db/374151?text=Photo"} alt={item.name} className="w-16 h-16 object-cover rounded-full"/>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-700">{item.name}</p>
                                                <p className="text-sm text-gray-500">Photo ID: {item.id}</p>
                                                <p className="text-blue-600 font-semibold">{item.price} THB</p>
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
                                            <input type="text" id="name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Your full name" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon className="text-gray-400 w-4 h-4"/></div>
                                            <input type="email" id="email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="your@email.com" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-4">Your final photos (without watermark) will be sent to this email after payment.</p>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{subtotal} THB</span></div>
                                    <div className="flex justify-between text-gray-600"><span>Processing Fee</span><span>0 THB</span></div>
                                    <hr className="my-2"/>
                                    <div className="flex justify-between text-gray-800 font-bold text-lg"><span>Total</span><span>{subtotal} THB</span></div>
                                </div>
                                <hr className="my-4"/>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    {Object.entries(paymentOptions).map(([key, { name, icon }]) => (
                                        <label key={key} htmlFor={key} className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${paymentMethod === key ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}>
                                            <input type="radio" id={key} name="payment" className="w-4 h-4 appearance-none border border-gray-400 rounded-full custom-radio" checked={paymentMethod === key} onChange={(e) => setPaymentMethod(e.target.id)} />
                                            <span className="ml-4">{icon}</span>
                                            <span className="ml-3 font-medium text-gray-700">{name}</span>
                                        </label>
                                    ))}
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-blue-700 transition-colors">
                                    Confirm & Pay - {subtotal} THB
                                </button>
                                <p className="text-xs text-gray-500 mt-4 text-center">
                                    By proceeding, you agree to our terms of service and privacy policy. Photos will be available for download within 24 hours.
                                </p>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

export default CartPay;
