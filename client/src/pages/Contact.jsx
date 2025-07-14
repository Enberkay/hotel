import { useState, useEffect } from "react"
import { Facebook, Phone } from 'lucide-react'

const Contact = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="dark:bg-gray-900 dark:text-white bg-white min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 text-[#B29433]">
      <h1 className="text-4xl sm:text-6xl font-bold mb-8 text-center">ติดต่อสอบถาม</h1>
      <div className="flex items-center gap-3 text-xl sm:text-2xl mb-6">
        <Phone size={30} />
        <span>เบอร์โทร: <strong>042 970 096</strong></span>
      </div>
      <div className="flex items-center gap-3">
        <Facebook size={30} />
        <a
          href="https://www.facebook.com/profile.php?id=100055208095448&locale=th_TH"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm sm:text-sm lg:text-2xl md:text-xl font-semibold hover:text-[#6A503D] transition"
        >
          โรงแรมภูพานเพลซ มหาวิทยาลัยราชภัฏสกลนคร
        </a>
      </div>
      {/* <button
        onClick={toggleTheme}
        className="mt-4 px-4 py-2 bg-brown text-white rounded"
      >
        Dark Mode
      </button> */}
    </div>
  )
}

export default Contact
