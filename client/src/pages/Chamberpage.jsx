import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import imagestan1 from "../assets/Images/ai6.jpg"
import imagestan2 from "../assets/Images/ai10.jpg"
import imagestan3 from "../assets/Images/ai9.jpg"
import imagestan4 from "../assets/Images/ai12.jpg"
import imagesig1 from "../assets/Images/ai7.jpg"
import imagesig2 from "../assets/Images/ai1.jpg"
import imagesig3 from "../assets/Images/ai3.jpg"
import imagesig4 from "../assets/Images/ai2.jpg"
import imagesig5 from "../assets/Images/ai4.jpg"

const Chamberpage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  }

  const rooms = [
    {
      title: "Standard Room",
      images: [imagestan1, imagestan2, imagestan3, imagestan4],
    },
    {
      title: "Signature Room",
      images: [imagesig1, imagesig2, imagesig3, imagesig4, imagesig5],
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-12 lg:p-16 xl:p-20 pt-30 mt-20">
      <div className="max-w-7xl mx-auto">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-12 mb-16 
                      sm:border sm:shadow-md sm:p-6 sm:rounded-lg"
          >
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-[#6A503D] text-2xl sm:text-3xl md:text-4xl font-semibold">{room.title}</h1>
              <div className="bg-[#6A503D] text-white w-full max-w-md mx-auto lg:mx-0 p-6 rounded-lg shadow-sm mt-6">
                <h2 className="text-lg sm:text-xl font-medium text-center mb-3">สิ่งอำนวยความสะดวก</h2>
                <ul className="list-disc list-inside text-gray-200 text-sm sm:text-base space-y-1">
                  <li>WIFI ฟรี</li>
                  <li>บริการทำความสะอาดห้อง</li>
                  <li>โต๊ะทำงาน</li>
                  <li>อุปกรณ์อาบน้ำ</li>
                  <li>อาหารเช้า ฟรี</li>
                  <li>แผนกต้อนรับ (24 ชั่วโมง)</li>
                </ul>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <Slider {...settings} className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-full">
                {room.images.map((img, i) => (
                  <img key={i} className="w-full h-[250px] sm:h-[250px] md:h-[400px] lg:h-[450px] object-cover rounded-xl" src={img} alt={`${room.title} ${i + 1}`} />
                ))}
              </Slider>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Chamberpage
