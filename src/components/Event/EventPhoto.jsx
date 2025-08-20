const EventPhoto = ({ event }) => {
 const images = event?.images ?? [];
  console.log(images);

  if (!images.length) {
    return (
      <section className="mt-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">All Photos</h2>
          <p className="text-gray-500 mt-4">ยังไม่มีรูปภาพสำหรับอีเวนต์นี้</p>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="mt-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            All Event Photos
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src={image.secure_url}
                  alt={`Event photo ${image.public_id}`}
                  className="w-full h-full object-cover aspect-square transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Error";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default EventPhoto;
