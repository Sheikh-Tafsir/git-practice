import express from 'express';

import * as StortService from '../service/StoryService'
import asyncHandler from '../middleware/AsyncHandler';
import { ApiResponse, RuntimeError } from '../utils/Utils';
import { DELETED, FOUND, notFoundMessage } from '../utils/Messages';
import { FileUpload } from '../middleware/FileUpload';

const router = express.Router();

router.post("", asyncHandler(async (req, res) => {
    const base64Image = await StortService.generateImage(req.body.prompt)  
    res.status(200).json(ApiResponse(FOUND, base64Image));
}));

export default router;