import React, { useState } from 'react'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import image1 from '../assets/Images/m1.jpg'
import image2 from '../assets/Images/m2.jpg'
import image3 from '../assets/Images/m3.jpg'
import image4 from '../assets/Images/m4.jpg'
import room1Img1 from '../assets/Images/ms1.jpg'
import room1Img2 from '../assets/Images/ms2.jpg'
import room2Img1 from '../assets/Images/mm1.jpg'
import room2Img2 from '../assets/Images/mm2.jpg'
import room3Img1 from '../assets/Images/mb1.jpg'
import room3Img2 from '../assets/Images/mb2.jpg'

const MeetingRoom = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  const [modalImage, setModalImage] = useState(null)

  return (
    <div className="p-4 sm:p-8 bg-white max-w-6xl mx-auto mt-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#6A503D]">Meeting & Events</h1>
        <p className="bg-[#6A503D] text-white text-lg py-3 px-6 rounded-lg mt-4">มีห้องประชุมหลากหลาย เหมาะกับลูกค้าหลายกลุ่ม</p>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[image1, image2, image3, image4].map((img, i) => (
          <img key={i} src={img} alt="Gallery" className="w-full h-40 object-cover rounded-lg cursor-pointer" onClick={() => setModalImage(img)} />
        ))}
      </div>

      {/* Meeting Rooms */}
      <div className="mt-12 space-y-8">
        {[{
          title: "ห้องประชุมขนาด 30 ท่าน", price: "2,000 บาท", images: [room1Img1, room1Img2]
        }, {
          title: "ห้องประชุมขนาด 40 ท่าน", price: "4,000 บาท", images: [room2Img1, room2Img2]
        }, {
          title: "ห้องประชุมขนาด 150-200 ท่าน", price: "6,500 บาท", images: [room3Img1, room3Img2]
        }].map((room, i) => (
          <div key={i}>
            <h2 className="text-2xl font-semibold text-[#6A503D]">{room.title}</h2>
            <p className="text-lg text-[#6A503D]">เต็มวัน (08:00-16:00) ราคา {room.price}</p>
            <Slider {...settings} className="mt-4">
              {room.images.map((img, j) => (
                <img key={j} src={img} alt="Room" className="w-full h-80 object-cover rounded-lg cursor-pointer" onClick={() => setModalImage(img)} />
              ))}
            </Slider>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button onClick={() => setModalImage(null)} className="absolute top-2 right-2 text-gray-500 text-3xl">x</button>
            <img src={modalImage} alt="Preview" className="w-full max-h-[80vh] object-cover rounded-lg" />
          </div>
        </div>
      )}
    </div>
  )
}

export default MeetingRoom
