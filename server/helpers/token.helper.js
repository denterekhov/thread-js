import jwt from 'jsonwebtoken';
import { secret, expiresIn } from '../config/jwt.config.js';

export default {
    createToken: data => jwt.sign(data, secret, { expiresIn })
};
