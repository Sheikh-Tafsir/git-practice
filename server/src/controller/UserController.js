import express from 'express';
import * as UserService from '../service/UserService'
import asyncHandler from '../middleware/AsyncHandler';
import { ApiResponse, createError, RuntimeError } from '../utils/Utils';
import { CREATED, DELETED, FOUND, NOT_FOUND, UPDATED } from '../utils/Messages';

const router = express.Router();

router.get("", asyncHandler(async (req, res) => {
    const page = req.query.page || 1; 
    const response = await UserService.getAllPaginatedUsers(page);
  
    res.status(200).json({
        data: response.data,
        totalCount: response.totalCount,
        message: FOUND
    });
}));


router.get("/:id", asyncHandler(async (req, res) => {
    const data = await UserService.getUserById(req.params.id);
    if(!data) throw RuntimeError(404, NOT_FOUND);  

    res.status(200).json(ApiResponse(FOUND, data));
}));

router.post('', asyncHandler(async (req, res) => {
    await UserService.saveUser(req.body);

    res.status(201).json({
        message: CREATED
    });
}));

router.put("/profile", asyncHandler(async (req, res) => {
    await UserService.editProfile(req.body);

    res.status(200).json({
        message: UPDATED
    });
}));

router.put("/:id", asyncHandler(async (req, res) => {
    await UserService.editUser(req.params.id, req.body);

    res.status(200).json({
        message: UPDATED
    });
}));

router.put("/delete/:id", asyncHandler(async (req, res) => {
    await UserService.deleteUser(req.params.id);

    res.status(200).json({
        message: DELETED
    });
}));

export default router;