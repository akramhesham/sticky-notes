import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

export function signToken (payload, secretKey, options) {
    payload.jti = crypto.randomBytes(10).toString('hex');
    return jwt.sign(payload, secretKey, options);
}

export function verifyToken (token, secret = 'sdadsdsadsad') {
    return jwt.verify(token, secret);
}

export function generateTokens (payload) {
    const accessToken = signToken(payload, 'dfsfdsfdsfdsfdsf', {
        expiresIn: 1200
    });
    const refreshToken = signToken(payload, 'gdfggfdgfdgfd', {
        expiresIn: "1y"
    })
    return { accessToken, refreshToken };
}