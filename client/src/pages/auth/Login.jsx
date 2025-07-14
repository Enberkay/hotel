import { useState } from "react";
import { toast } from "react-toastify";
import useHotelStore from "../../store/hotel-store";
import { useNavigate } from "react-router-dom";
import { User, KeyRound } from "lucide-react";
import image from "../../assets/Images/test3.png";

const Login = () => {
  //JavaScript
  const navigate = useNavigate();
  const actionLogin = useHotelStore((state) => state.actionLogin);
  const user = useHotelStore((state) => state.user);
  // console.log("user form zustand", user)

  const [form, setForm] = useState({
    //object
    userEmail: "",
    userPassword: "",
  });

  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value)
    setForm({
      // "..." is copy old data
      ...form,
      // key:value
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    // e.preventDefault() ป้องกันการ refresh
    e.preventDefault();
    // console.log(form)
    try {
      const res = await actionLogin(form);
      console.log(res);
      const role = res.data.payload.userRole;
      roleRedirect(role);
      toast.success("Welcome Back");
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "customer") {
      navigate("/book-room");
    } else if (role === "front") {
      navigate("/front");
    } else if (role === "housekeeping") {
      navigate("/housekeeping");
    } else if (role === "maintenance") {
      navigate("/maintenance");
    } else {
      console.log("path error");
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="w-full sm:w-[400px] md:w-[400px] lg:w-[500px] xl:w-[500px] p-12 bg-white bg-opacity-95 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block space-y-2">
              <span className="text-gray-700">Email</span>
              <div className="flex items-center border p-3 rounded-md focus-within:ring-2 focus-within:ring-brown/50">
                <User className="text-gray-500 mr-3" size={24} />
                <input
                  className="w-full focus:outline-none text-lg "
                  onChange={handleOnChange}
                  name="userEmail"
                  type="email"
                  required
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-gray-700">Password</span>
              <div className="flex items-center border p-3 rounded-md focus-within:ring-2 focus-within:ring-brown/50">
                <KeyRound className="text-gray-500 mr-3" size={24} />
                <input
                  className="w-full focus:outline-none text-lg"
                  onChange={handleOnChange}
                  name="userPassword"
                  type="password"
                  required
                />
              </div>
            </label>

            <button className="w-full py-3 px-6 bg-brown text-white text-lg rounded-md hover:bg-brown/80 transition shadow-md">
              Login
            </button>
          </form>
      </div>
    </div>
  );
};
export default Login;
