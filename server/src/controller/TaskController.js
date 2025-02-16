import express from 'express';

import * as TaskService from '../service/TaskService'
import asyncHandler from '../middleware/AsyncHandler';
import { ApiResponse } from '../utils/Utils';
import { CREATED, DELETED, FOUND } from '../utils/Messages';
import { FileUpload } from '../middleware/FileUpload';

const router = express.Router();

router.get("", asyncHandler(async (req, res) => {
    const response = await TaskService.getTasksByUserId(req.user.id)  
    res.status(200).json(ApiResponse(FOUND, response));
}));

router.post("", FileUpload.single('image'), asyncHandler(async (req, res) => {
    const response = await TaskService.simplifyTask(req.body, req.file);  
    res.status(201).json(ApiResponse(CREATED, response));
}));

router.get("/:taskId", asyncHandler(async (req, res) => {
    const response = await TaskService.getTaskDescriptionByTaskId(req.params.taskId, req.user.id);  
    res.status(200).json(ApiResponse(FOUND, response));
}));

router.delete("/:taskId", asyncHandler(async (req, res) => {
    // console.log(req.params.taskId);
    await TaskService.deleteTask(req.params.taskId);  
    res.status(200).json(ApiResponse(DELETED));
}));


export default router;
