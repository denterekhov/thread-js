import multer from 'multer';
import { fileSize } from '../../config/imgur.config.js';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize
    }
});

export default upload.single('image');
