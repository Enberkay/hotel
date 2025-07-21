import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation('common');
  return (
    <div>
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-red-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            {t('not_found_title')}
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            {t('not_found_message')}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to='/' className="rounded-md bg-custom-brown px-3.5 py-2.5 text-sm font-semibold text-black shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {t('back_to_home')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage