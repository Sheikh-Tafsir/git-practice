import express from 'express';
import * as ChatBotService from '../service/ChatBotService'
import asyncHandler from '../middleware/AsyncHandler';
import { ApiResponse, RuntimeError } from '../utils/Utils';
import { DELETED, FOUND, notFoundMessage } from '../utils/Messages';
import { FileUpload } from '../middleware/FileUpload';

const router = express.Router();

router.get("", asyncHandler(async (req, res) => {    
    const data = await ChatBotService.getChatsByUserId(req.user.id)  
    res.status(200).json(ApiResponse(FOUND,data));
}));

router.get("/:chatId", asyncHandler(async (req, res) => {  
    const data = await ChatBotService.getMessagesByChatId(req.params.chatId, req.user.id);
    if(!data) throw RuntimeError(404, notFoundMessage);  
  
    res.status(200).json(ApiResponse(FOUND, data));
}));

router.post("/:chatId", FileUpload.single('image'), asyncHandler(async (req, res) => {  
    // console.log(req.params.chatId);
    const data = await ChatBotService.sendMessage(req.body, req.params.chatId, req.file);  
    res.status(200).json(ApiResponse(FOUND, data));
}));

router.delete("/:chatId", asyncHandler(async (req, res) => {  
    // console.log(req.params.chatId);
    await ChatBotService.deleteChat(req.params.chatId);  
    res.status(200).json(ApiResponse(DELETED));
}));

export default router;