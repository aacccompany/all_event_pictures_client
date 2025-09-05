import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

// --- Mock Dependencies & Components ---
// ส่วนนี้เป็นการจำลองฟังก์ชันและคอมโพเนนต์ที่ไฟล์นี้เรียกใช้จากภายนอก
// เพื่อแก้ไขข้อผิดพลาด "Could not resolve" และทำให้คอมโพเนนต์นี้ทำงานได้ด้วยตัวเอง

// 1. จำลอง `useRouter` จาก `next/router`
const useRouter = () => ({
  push: (path) => {
    // ใช้ window.location.href สำหรับการ redirect ในสภาพแวดล้อมที่ไม่ใช่ Next.js
    window.location.href = path;
  },
});

// 2. จำลอง `useAuthStore`
const useAuthStore = (selector) => {
  // คืนค่า token ตัวอย่างเพื่อให้ logic การ login ทำงานได้
  const mockState = { token: "mock_user_token" };
  return selector(mockState);
};

// 3. จำลอง API function `add_cart`
const add_cart = async (token, body) => {
  console.log("Calling Mock API 'add_cart' with:", { token, body });
  // คืนค่า Promise ที่สำเร็จ เพื่อจำลองการตอบสนองของ API
  return Promise.resolve({
    data: { success: true, message: "Item added to cart." },
  });
};

// 4. สร้างคอมโพเนนต์ `DialogLogin` แบบง่ายๆ ภายในไฟล์
const DialogLogin = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <h3 className="text-lg font-bold">จำเป็นต้องเข้าสู่ระบบ</h3>
        <p className="mt-2 text-sm text-gray-600">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

// 5. ย้ายคอมโพเนนต์ `PdpaDialog` เข้ามาในไฟล์นี้
const PdpaDialog = ({ isOpen, onAccept, onDecline }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="relative bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl transform transition-all">
          <h2 className="text-xl font-bold text-gray-900 text-left">
            คำยินยอมของเจ้าของข้อมูลส่วนบุคคล
          </h2>
          <p className="mt-4 text-sm text-gray-600 text-left leading-relaxed">
            เพื่อให้เป็นไปตามกฎหมายเกี่ยวกับการคุ้มครองข้อมูลส่วนบุคคล และสอดคล้องกับ <span className="font-semibold text-blue-600">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</span> ของ All Event Photo ในฐานะผู้พัฒนาแพลตฟอร์ม "ค้นหาภาพจากงานอีเว้นท์" ขอแจ้ง สิทธิของเจ้าของข้อมูลส่วนบุคคล ให้ข้าพเจ้าในฐานะผู้เยี่ยมชมเว็ปไซต์ได้ทราบ และศึกษา รวมถึงผลกระทบกรณีไม่ยินยอม ข้าพเจ้าขอแสดงเจตนาข้างล่างนี้ให้เว็ปไซต์ เพื่อให้เว็ปไซต์เก็บ รวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าในการพิสูจน์ หรือยืนยันตัวตนด้วยเอกลักษณ์ทางใบหน้า โดยระบบไบโอเมตริกส์ของเว็ปไซต์ เพื่อประโยชน์ในการค้นหาภาพของข้าพเจ้าเอง รวมไปถึงข้าพเจ้าจะรักษาสิทธิ์ ในข้อมูลส่วนบุคคลของบุคคลอื่นภายใต้ <span className="font-semibold text-blue-600">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</span> ของ All Event Photo แพลตฟอร์ม "ค้นหาภาพงานอีเว้นท์" นี้อย่างเคร่งครัด
          </p>
          <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={onAccept}
              className="w-full px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              ยอมรับ
            </button>
            <button
              onClick={onDecline}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              ไม่ยอมรับ
            </button>
          </div>
        </div>
      </div>
    );
};


// --- Main EventPhoto Component ---

const EventPhoto = ({ event }) => {
  const images = event?.images ?? [];
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const token = useAuthStore((state) => state.token);

  // --- ส่วนของ PDPA ---
  const [showPdpaDialog, setShowPdpaDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const pdpaConsent = localStorage.getItem("pdpa_consent");
    if (pdpaConsent) {
      const { expiry } = JSON.parse(pdpaConsent);
      if (new Date().getTime() > expiry) {
        setShowPdpaDialog(true);
      }
    } else {
      setShowPdpaDialog(true);
    }
  }, []);

  const handleAcceptPdpa = () => {
    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
    const expiry = new Date().getTime() + expiresIn;
    const consentData = { accepted: true, expiry };

    localStorage.setItem("pdpa_consent", JSON.stringify(consentData));
    setShowPdpaDialog(false);
    toast.success("ขอบคุณที่ยอมรับข้อตกลงการใช้งาน");
  };

  const handleDeclinePdpa = () => {
    toast.info("คุณจำเป็นต้องยอมรับข้อตกลงเพื่อใช้งานต่อ");
    router.push("/");
  };
  // --- สิ้นสุดส่วนของ PDPA ---

  const openImageViewer = (image) => setSelectedImage(image);
  const closeImageViewer = () => setSelectedImage(null);

  const handleAddToCart = async (e, image) => {
    e.stopPropagation();

    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      const body = { images_id: [image.id] };
      await add_cart(token, body);
      toast.success(`Add image to cart successfully`);
    } catch (err) {
      console.error(err);
      toast.warning("Add image to cart error please try again");
    }
  };

  return (
    <>
      {!showPdpaDialog && (
        <section className="mt-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              All Event Photos
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div
                  key={image.public_id}
                  className="group relative overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openImageViewer(image)}
                >
                  <img
                    src={image?.preview_url}
                    alt={`Event photo ${image?.public_id}`}
                    className="w-full h-full object-cover aspect-square transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    <button
                      title="Add to cart"
                      className="px-4 py-2 bg-blue-600 text-sm font-semibold text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={(e) => handleAddToCart(e, image)}
                    >
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-80 animate-backdrop"
            onClick={closeImageViewer}
          />
          <div
            className="relative max-w-4xl max-h-[90vh] animate-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage?.preview_url}
              alt={`Event photo ${selectedImage.public_id}`}
              className="object-contain w-full h-full rounded-lg shadow-2xl"
            />
            <button
              onClick={closeImageViewer}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      <DialogLogin isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <PdpaDialog
        isOpen={showPdpaDialog}
        onAccept={handleAcceptPdpa}
        onDecline={handleDeclinePdpa}
      />
    </>
  );
};

export default EventPhoto;

