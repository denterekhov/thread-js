import { Router } from 'express';
import * as imageService from '../services/image.service.js';
import imageMiddleware from '../middlewares/image.middleware.js';

const router = Router();

router
    .post('/', imageMiddleware, (req, res, next) => imageService.upload(req.file)
        .then(image => res.send(image))
        .catch(next));

export default router;
