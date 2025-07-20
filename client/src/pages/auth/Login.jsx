import { useState } from "react";
import { toast } from "react-toastify";
import useAuthStore from "../../store/auth-store";
import { useNavigate } from "react-router-dom";
import { User, KeyRound } from "lucide-react";
import image from "../../assets/Images/test3.png";
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  //JavaScript
  const navigate = useNavigate();
  const actionLogin = useAuthStore((state) => state.actionLogin);
  const user = useAuthStore((state) => state.user);
  // console.log("user form zustand", user)

  const [form, setForm] = useState({
    //object
    userEmail: "",
    userPassword: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.userRole;
      roleRedirect(role);
      toast.success(t('login_success'));
    } catch (err) {
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
          <h2 className="text-2xl font-bold mb-6 text-center">{t('login')}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block space-y-2">
              <span className="text-gray-700">{t('email')}</span>
              <div className="flex items-center border p-3 rounded-md focus-within:ring-2 focus-within:ring-brown/50">
                <User className="text-gray-500 mr-3" size={24} />
                <input
                  className="w-full focus:outline-none text-lg "
                  onChange={handleOnChange}
                  name="userEmail"
                  type="email"
                  required
                  placeholder={t('enter_email')}
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-gray-700">{t('password')}</span>
              <div className="flex items-center border p-3 rounded-md focus-within:ring-2 focus-within:ring-brown/50">
                <KeyRound className="text-gray-500 mr-3" size={24} />
                <input
                  className="w-full focus:outline-none text-lg"
                  onChange={handleOnChange}
                  name="userPassword"
                  type="password"
                  required
                  placeholder={t('enter_password')}
                />
              </div>
            </label>

            <button className="w-full py-3 px-6 bg-[var(--color-brown)] text-white text-lg rounded-md hover:bg-[var(--color-brown)]/80 transition shadow-md" style={{'--color-brown':'#6A503D'}}>
              {t('login')}
            </button>
          </form>
      </div>
    </div>
  );
};
export default Login;
