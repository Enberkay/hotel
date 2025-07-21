import React, { useState, useEffect } from "react"
import useAddonStore from "../../store/addon-store";
import useAuthStore from "../../store/auth-store";
import { createAddon, readAddon, updateAddon } from "../../api/addon"
import { toast } from "react-toastify"
import { Pencil } from "lucide-react"
import { useTranslation } from 'react-i18next';

const initialState = { addonName_en: "", addonName_th: "", price: 0 }

const FormAddon = () => {
  const { i18n, t } = useTranslation(['addon', 'common']);
  const token = useAuthStore((state) => state.token);
  const getAddon = useAddonStore((state) => state.getAddon);
  const addons = useAddonStore((state) => state.addons);

  const [form, setForm] = useState(initialState)
  const [editForm, setEditForm] = useState(initialState)
  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    getAddon(token)
  }, [])

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.addonName_en || !form.addonName_th || !form.price) {
      return toast.error(t("common:error_required"))
    }
    try {
      const res = await createAddon(token, form)
      setForm(initialState)
      getAddon(token)
      toast.success(t("add_addon_success", { addonName: i18n.language === 'th' ? res.data.addonName_th : res.data.addonName_en }))
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditClick = async (id) => {
    try {
      const res = await readAddon(token, id)
      setEditForm(res.data)
      setIsEditOpen(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateAddon(token, editForm)
      getAddon(token)
      setIsEditOpen(false)
      toast.success(t("update_addon_success"))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('addon_management')}</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium">{t('addon_name_en')}</label>
            <input type="text" name="addonName_en" value={form.addonName_en} onChange={handleOnChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">{t('addon_name_th')}</label>
            <input type="text" name="addonName_th" value={form.addonName_th} onChange={handleOnChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">{t('price')}</label>
            <input type="number" name="price" value={form.price} onChange={handleOnChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">{t('add_addon')}</button>
        </form>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{t('edit_addon')}</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">{t('addon_name_en')}</label>
                <input type="text" name="addonName_en" value={editForm.addonName_en} onChange={handleEditChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">{t('addon_name_th')}</label>
                <input type="text" name="addonName_th" value={editForm.addonName_th} onChange={handleEditChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">{t('price')}</label>
                <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">{t('common:cancel')}</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">{t('common:save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left">{t('addon_name')}</th>
                <th className="py-2 px-4 text-left">{t('price')}</th>
                <th className="py-2 px-4 text-left">{t('common:actions')}</th>
              </tr>
            </thead>
            <tbody>
              {addons.map((addon) => (
                <tr key={addon.addonId} className="border-b">
                  <td className="py-2 px-4">{i18n.language === 'th' ? addon.addonName_th : addon.addonName_en}</td>
                  <td className="py-2 px-4">{addon.price}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleEditClick(addon.addonId)} className="text-blue-500 hover:underline">
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FormAddon;
