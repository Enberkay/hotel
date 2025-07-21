import React, { useState } from 'react'
import image1 from '../assets/Images/r1.jpg'
import image2 from '../assets/Images/r2.jpg'
import image3 from '../assets/Images/r3.jpg'
import image4 from '../assets/Images/r4.jpg'

const Restaurant = () => {
  const [modalImage, setModalImage] = useState(null)

  return (
    <div className="p-4 sm:p-8 bg-white max-w-6xl mx-auto mt-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#6A503D]">Restaurant</h1>
        <p className="bg-[#6A503D] text-white text-lg py-3 px-6 rounded-lg mt-4">
          ห้องอาหารกว้างรองรับลูกค้า อาหารหลากหลาย ราคาไม่แพง
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[image1, image2, image3, image4].map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Menu ${i + 1}`}
            className="w-full h-40 sm:h-64 object-cover rounded-lg cursor-pointer hover:scale-105 transition duration-300"
            onClick={() => setModalImage(img)}
          />
        ))}
      </div>

      {modalImage && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button onClick={() => setModalImage(null)} className="absolute top-2 right-2 text-gray-500 text-3xl">&times;</button>
            <img src={modalImage} alt="Preview" className="w-full max-h-[80vh] object-cover rounded-lg" />
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[{
          title: "บริการจัดเลี้ยง",
          desc: "เรามีบริการจัดเลี้ยงสำหรับทุกโอกาส"
        }, {
          title: "สำหรับลูกค้าที่เข้าพัก",
          desc: "ฟรีบริการอาหารเช้า"
        }, {
          title: "อาหารตามสั่ง",
          desc: "ให้บริการถึงเวลา 14:00 น."
        }].map((item, i) => (
          <div key={i} className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg text-[#B29433] font-bold">{item.title}</h3>
            <p className="text-[#6A503D] mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Restaurant