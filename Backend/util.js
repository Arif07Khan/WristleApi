import multer from "multer";
import express from "express";
const router_util = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const datetime =
      new Date().toLocaleDateString() + "_" + new Date().toLocaleTimeString();
    cb(null, file.originalname);
  },
});

const myStorage = multer({ storage: storage });

router_util.post("/uploadfile", myStorage.single("myfile"), (req, res) => {
  res.status(200).json({ status: "success" });
});

export default router_util;
