import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY || '';
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
export const getUserFromToken = (req) => {
    const authHeader = req.headers.authorization || '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, secretKey);
            return user;
        }
        catch (err) {
            console.error('JWT verification failed:', err);
            return null;
        }
    }
    return null;
};
export const authenticateToken = (req, res, next) => {
    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    req.user = user;
    next();
};
