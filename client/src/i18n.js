import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enRoom from './locales/en/room.json';
import enUser from './locales/en/user.json';
import enBooking from './locales/en/booking.json';
import enCleaning from './locales/en/cleaning.json';
import enRepair from './locales/en/repair.json';
import enAuth from './locales/en/auth.json';

import thCommon from './locales/th/common.json';
import thRoom from './locales/th/room.json';
import thUser from './locales/th/user.json';
import thBooking from './locales/th/booking.json';
import thCleaning from './locales/th/cleaning.json';
import thRepair from './locales/th/repair.json';
import thAuth from './locales/th/auth.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        room: enRoom,
        user: enUser,
        booking: enBooking,
        cleaning: enCleaning,
        repair: enRepair,
        auth: enAuth,
      },
      th: {
        common: thCommon,
        room: thRoom,
        user: thUser,
        booking: thBooking,
        cleaning: thCleaning,
        repair: thRepair,
        auth: thAuth,
      },
    },
    lng: 'th', // ค่าเริ่มต้นภาษาไทย
    fallbackLng: 'en',
    ns: ['common', 'room', 'user', 'booking', 'cleaning', 'repair', 'auth'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 