import { UNAUTHORIZED } from '../utils/Messages';

const PermissionMiddleware = (role) => (req, res, next) => {
    //console.log("ok1")    
    const user = req.user

    if (user.role > role) {
        return res.status(401).json({ message: UNAUTHORIZED });
    }

    next();
};

export default PermissionMiddleware;
