import React, { useState } from "react"
import { toast } from "react-toastify"
import Resizer from "react-image-file-resizer"
import { uploadFiles, removeFiles } from "../../api/auth"
import useHotelStore from "../../store/hotel-store"
import { Loader } from "lucide-react"

const UploadFile = ({ form, setForm }) => {

    const token = useHotelStore((state) => state.token)
    const [isLoading, setIsLoading] = useState(false)


    const handleOnChange = (e) => {
        setIsLoading(true)
        const files = e.target.files
        if (files) {
            // setIsLoading(true)
            let allFiles = form.images //[] empty array
            for (let i = 0; i < files.length; i++) {
                // console.log(files[i])

                // validate
                const file = files[i]
                if (!file.type.startsWith("image/")) {
                    toast.error(`File ${file.name} ไม่ใช่รูปภาพ`)
                    continue //ข้ามการทำงาน
                }
                // Image Resize
                Resizer.imageFileResizer(
                    files[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (data) => {
                        // ENDPOINT backend
                        // console.log("data",data)
                        uploadFiles(token, data)
                            .then((res) => {
                                // console.log(res)
                                allFiles.push(res.data)
                                setForm({
                                    ...form,
                                    images: allFiles

                                })
                                setIsLoading(false)
                                toast.success("Upload image success!!.")
                            })
                            .catch((err) => {
                                console.log(err)
                                setIsLoading(false)
                            })

                    },
                    "base64"
                )

            }

        }

    }

    const handleDelete = (public_id) => {
        // console.log(public_id)
        const images = form.images
        removeFiles(token, public_id)
            .then((res) => {
                const filterImages = images.filter((item) => {
                    // console.log(item)
                    return item.public_id !== public_id
                })

                console.log("filterImages", filterImages)
                setForm({
                    ...form,
                    images: filterImages
                })
                toast.error(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
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
                                src={item.url} />
                            <span
                                onClick={() => handleDelete(item.public_id)} //เขียนตรงนี้เป็น callback function  เพราะเราจะส่งค่าไป
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