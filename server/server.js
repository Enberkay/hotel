//import
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { readdirSync } = require("fs")

const app = express()
const port = process.env.PORT || 8001

// middleware
app.use(morgan("dev"))
app.use(express.json({limit: "20mb"}))  // {limit: "20mb"} Allow ให้ server ของเราส่งข้อมูลได้เยอะๆ จะมีปัญญาตอนทำพวกรูปภาพ
app.use(cors())

//  Routes, @ENDPOINT http://localhost:8000/api
readdirSync("./routes").map((item) => app.use("/api", require("./routes/" + item)))

//Server
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})