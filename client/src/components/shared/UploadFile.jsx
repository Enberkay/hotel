import React, { useState } from "react"
import { toast } from "react-toastify"
import Resizer from "react-image-file-resizer"
import { uploadFiles, removeFiles } from "../../api/auth"
import useAuthStore from "../../store/auth-store"
import { Loader } from "lucide-react"

const UploadFile = ({ form, setForm }) => {

    const token = useAuthStore((state) => state.token)
    const [isLoading, setIsLoading] = useState(false)


    const handleOnChange = async (e) => {
        setIsLoading(true)
        const files = e.target.files
        if (files) {
            let allFiles = form.images || []
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (!file.type.startsWith("image/")) {
                    toast.error(`File ${file.name} ไม่ใช่รูปภาพ`)
                    continue
                }
                try {
                    const res = await uploadFiles(token, file)
                    allFiles.push(res.data)
                    setForm({
                        ...form,
                        images: allFiles
                    })
                    toast.success("Upload image success!!.")
                } catch (err) {
                    console.log(err)
                    toast.error("Upload failed")
                }
            }
            setIsLoading(false)
        }
    }

    const handleDelete = async (filename) => {
        const images = form.images
        try {
            await removeFiles(token, filename)
            const filterImages = images.filter((item) => item.filename !== filename)
            setForm({
                ...form,
                images: filterImages
            })
            toast.error("ลบรูปแล้ว")
        } catch (err) {
            console.log(err)
            toast.error("ลบรูปไม่สำเร็จ")
        }
    }

    return (

        <div className="my-4" >
            <div className="flex mx-4 gap-4 my-4" >
                { //ถ้า isLoading = false จะไม่ทำอะไร ถ้าเป็น true จะทำตัวหลัง &&
                    isLoading && <Loader className="w-16 h-16 animate-spin" />
                }
                {/* Image */}
                {
                    form.images.map((item, index) =>
                        <div key={index} className="relative" >
                            <img
                                className="w-24 h-24 border hover:scale-105 "
                                src={item.url || item.path} />
                            <span
                                onClick={() => handleDelete(item.filename || item.asset_id)}
                                className="absolute top-0 right-0 bg-red-500 p-1 rounded" >X</span>
                        </div>
                    )
                }
            </div>
            <div>
                <input
                    onChange={handleOnChange}
                    type="file"
                    name="images"
                    multiple
                />
            </div>
        </div>
    )
}
export default UploadFile