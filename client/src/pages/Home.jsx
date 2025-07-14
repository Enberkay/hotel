import React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import logo from "../assets/Images/logo.png"
import { MapPin, PhoneOutgoing, Clock } from "lucide-react"

import bg from "../assets/Images/bg1.jpg"
import roomstad from "../assets/Images/stan1.png"
import roomsig from "../assets/Images/romsig.png"
import rommet from "../assets/Images/rommet.png"
import romres from "../assets/Images/romres.png"

const Home = () => {
  const position = [17.19168969331694, 104.09423552442478]

  const rooms = [
    { title: "Standard Room", img: roomstad, desc: "ออกแบบให้เหมาะสำหรับผู้ที่ต้องการความสะดวกสบายในราคาประหยัด" },
    { title: "Signature Room", img: roomsig, desc: "ห้องพักระดับพิเศษที่มอบประสบการณ์การเข้าพักที่เหนือกว่าห้องพักทั่วไป" },
    { title: "Meeting & Events", img: rommet, desc: "โรงแรมภูพานเพลซอาจมีบริการพื้นที่สำหรับการจัดประชุมและอีเวนต์ (Meeting & Events) ซึ่งเหมาะสำหรับการจัดกิจกรรมทางธุรกิจหรือสังคม" },
    { title: "Restaurant", img: romres, desc: "โรงแรมภูพานเพลซมีบริการห้องอาหาร (Restaurant) สำหรับรองรับผู้เข้าพักและลูกค้าทั่วไปโดยเน้นการให้บริการที่สะดวกสบายและเมนูที่หลากหลายตามมาตรฐานของโรงแรมในระดับเดียวกัน" },
  ]

  return (
    <div className="bg-white text-[#493628] text-base sm:text-lg md:text-xl lg:text-2xl mt-20">
      <img
        src={bg}
        className="w-full h-[40vh] sm:h-[50vh] md:h-[70vh] object-cover"
        alt="Background"
      />

      <div className="text-center mt-8 sm:mt-12 border-b-4 border-[#B29433] pb-4 sm:pb-6 mx-4 sm:mx-6 md:mx-10 lg:mx-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
          โรงแรมภูพานเพลซ
        </h1>
        <h3 className="text-2xl sm:text-3xl md:text-4xl mt-2 sm:mt-4">
          มหาวิทยาลัยราชภัฏสกลนคร
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row justify-center mt-12 sm:mt-16 gap-8 sm:gap-12 p-4 sm:p-6 lg:p-10">
        <MapContainer
          center={position}
          zoom={30}
          className="h-[300px] sm:h-[400px] md:h-[500px] w-full lg:w-[700px] rounded-lg shadow-lg border-4 border-[#B29433] relative z-10"
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" />
          <Marker position={position}>
            <Popup>โรงแรมภูพานเพลซ</Popup>
          </Marker>
        </MapContainer>

        <div className="bg-[#B29433] text-white rounded-lg p-4 sm:p-6 md:p-8 flex flex-col justify-center w-full lg:w-[500px] text-lg sm:text-xl md:text-2xl shadow-lg border-4 border-[#fff]">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 border-b-2 border-white pb-2 sm:pb-3">
            <h3>โลเคชันดี</h3>
            <h3>ใกล้ที่ท่องเที่ยวสำคัญ</h3>
            <h3>จะเที่ยวหรือพัก</h3>
            <h3>ภูพานเพลซตอบโจทย์ทุกสไตล์</h3>
          </div>

          <p className="lg:mt-2">
            <strong>ที่อยู่:</strong> มหาวิทยาลัยราชภัฏสกลนคร
          </p>
          <p className="lg:mt-2">
            <strong>โทร:</strong>{" "}
            <a href="tel:042970096" className="underline">
              042-970-096
            </a>
          </p>
          <p className="lg:mt-2">
            <strong>Facebook:</strong> โรงแรมภูพานเพลซ
          </p>
          <p className="lg:mt-2">
            <strong>เปิดตลอดเวลา</strong>
          </p>
        </div>
      </div>

      <div className="mt-16 sm:mt-20 grid gap-12 sm:gap-20 px-4 sm:px-6 lg:px-10 2xl:px-80">
        {rooms.map((room, index) => (
          <div
            key={index}
            className={`flex flex-col lg:flex-row items-center gap-8 sm:gap-12 p-4 sm:p-6 lg:p-10 border-4 border-[#B29433] rounded-lg shadow-lg ${
              index % 2 === 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <img
              src={room.img}
              className="rounded-lg w-full lg:w-[600px] h-[200px] sm:h-[250px] md:h-[350px] object-cover border-4 border-[#fff]"
              alt={room.title}
            />

            <div className="text-center lg:mx-24 lg:text-left text-lg sm:text-xl md:text-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold border-b-2 border-[#B29433] pb-2 sm:pb-3">
                {room.title}
              </h2>
              <p className="mt-2 sm:mt-4">{room.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className="bg-[#493628] text-white text-center p-6 sm:p-8 mt-16 sm:mt-20 text-base sm:text-lg md:text-xl lg:text-2xl border-t-4 border-[#B29433]">
        <img
          src={logo}
          alt="logo"
          className="mx-auto h-14 sm:h-16 md:h-20 rounded-full p-2"
        />
        <div className="mt-4 sm:mt-6">
          <p className="flex items-center justify-center gap-2 sm:gap-4">
            <MapPin size={20} sm:size={24} /> มหาวิทยาลัยราชภัฏสกลนคร
          </p>
          <p className="flex items-center justify-center gap-2 sm:gap-4">
            <PhoneOutgoing size={20} sm:size={24} /> 042-970-096
          </p>
          <p className="flex items-center justify-center gap-2 sm:gap-4">
            <Clock size={20} sm:size={24} /> เปิดตลอดเวลา
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
