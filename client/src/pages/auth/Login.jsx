import { toast } from "react-toastify";
import useAuthStore from "../../store/auth-store";
import { useNavigate } from "react-router-dom";
import { User, KeyRound } from "lucide-react";
import image from "../../assets/Images/test3.png";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const actionLogin = useAuthStore((state) => state.actionLogin);

  // Zod schema
  const schema = z.object({
    userEmail: z.string().min(1, { message: t('enter_email') }).email({ message: t('enter_email') }),
    userPassword: z.string().min(1, { message: t('enter_password') }),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    try {
      const res = await actionLogin(data);
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <User className="text-gray-500 mr-3" size={24} />
            </span>
            <input
              id="userEmail"
              type="text"
              {...register('userEmail')}
              className="pl-10 w-full p-2 border border-gray-300 rounded"
              placeholder={t('enter_email')}
              autoFocus
            />
            {errors.userEmail && <p className="text-red-500 text-xs mt-1">{errors.userEmail.message}</p>}
          </div>
          <div className="mb-4 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <KeyRound className="text-gray-500 mr-3" size={24} />
            </span>
            <input
              id="userPassword"
              type="password"
              {...register('userPassword')}
              className="pl-10 w-full p-2 border border-gray-300 rounded"
              placeholder={t('enter_password')}
            />
            {errors.userPassword && <p className="text-red-500 text-xs mt-1">{errors.userPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-custom-brown text-white p-2 rounded hover:bg-opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('logging_in') : t('login')}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <p className="text-sm">
            <Link to="/register" className="text-custom-brown hover:underline">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
