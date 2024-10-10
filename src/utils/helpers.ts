import jwt from 'jsonwebtoken';

export const generateToken = (
    payload: string | object | Buffer,
    secretKey: string,
    expiresIn: string | number 
): string => {
    return jwt.sign(payload, secretKey, { expiresIn });
}
