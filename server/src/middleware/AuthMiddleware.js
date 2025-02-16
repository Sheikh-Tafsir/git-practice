import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_REQUIRED } from '../utils/Messages';

const AuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json(ACCESS_TOKEN_REQUIRED);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            //console.log("error: Access token expired")
            return res.status(401).json(ACCESS_TOKEN_REQUIRED);
        }
        
        req.user = user;
        next();
    });
};

export default AuthMiddleware;
