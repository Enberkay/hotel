import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from 'react-toastify'
import useAuthStore from "./store/auth-store";

const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      useAuthStore.getState().checkAndLogoutIfExpired();
    }, 300000);
    return () => clearInterval(checkTokenInterval);
  }, []);

  return (
    <div>
      <h1>{t('common:welcome')}</h1>
      <p>{t('common:hello')}</p>
      <button onClick={() => i18n.changeLanguage('th')}>ไทย</button>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <ToastContainer />
      <AppRoutes />
    </div>
  );
}
export default App