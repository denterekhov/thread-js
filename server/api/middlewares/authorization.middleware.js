import jwtMiddleware from './jwt.middleware.js';

export default (routesWhiteList = []) => (req, res, next) => (
    routesWhiteList.some(route => route === req.path || req.path.startsWith('/auth/reset'))
        ? next()
        : jwtMiddleware(req, res, next) // auth the user if requested path isn't from the white list
);
