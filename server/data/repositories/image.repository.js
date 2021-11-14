import { ImageModel } from '../models/index.js';
import BaseRepository from './base.repository.js';

class ImageRepository extends BaseRepository {}

export default new ImageRepository(ImageModel);
