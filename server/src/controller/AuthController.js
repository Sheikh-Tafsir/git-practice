import express from 'express';
import * as AuthService from '../service/AuthService'
import asyncHandler from '../middleware/AsyncHandler';
import { ApiResponse } from '../utils/Utils';

const router = express.Router();

const USER_LOGIN_SUCCESSFUL = "User login successful";

const USER_SIGNUP_SUCCESSFUL = "User registration successful";

const expiry_duration = 7 * 86400 * 1000

const refreshCookieName = 'refreshToken';

const cookieMode = 'production';

router.post("/signup", asyncHandler(async (req, res) => {
    const tokens = await AuthService.save(req.body);
    
    res.cookie(refreshCookieName, tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        expires: new Date(Date.now() + expiry_duration),
    });    
  
    res.status(201).json(ApiResponse(USER_SIGNUP_SUCCESSFUL, tokens.accessToken));
}));

router.post("/login", asyncHandler(async (req, res) => {
    const tokens = await AuthService.login(req.body);
    
    res.cookie(refreshCookieName, tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        expires: new Date(Date.now() + expiry_duration),
    });    
  
    res.status(200).json(ApiResponse(USER_LOGIN_SUCCESSFUL, tokens.accessToken));
}));

router.post("/google-login", asyncHandler(async (req, res) => {
    const tokens = await AuthService.googleLogin(req.body);
      
    const response = {
        token: tokens.accessToken,
        message: USER_LOGIN_SUCCESSFUL,
    };

    res.status(200).json(ApiResponse(USER_LOGIN_SUCCESSFUL,response));
}));

router.post('/refresh', async (req, res) => {
    try {
        const token = await AuthService.refreshAcessToken(req.cookies.refreshToken);
        res.status(200).json({
            token,
            message: "Access token refreshed successfully.",
        });
    } catch(error) {
        res.status(error.status || 401).json({
            message: error.message,
        })
    }
});

router.get('/logout', asyncHandler(async (req, res) => {
    res.clearCookie(refreshCookieName, {
        httpOnly: true,
        secure: true, 
        sameSite: 'None',
        path: '/',
    });
  
    res.status(200).json({
        message: "Logout successful.",
    });
}));

export default router;