import { multer } from "../utils/imports.util.js";

const storage = multer.memoryStorage();
const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

export default multerUpload;
