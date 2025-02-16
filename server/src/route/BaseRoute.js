import express from 'express';

import AuthMiddleware from '../middleware/AuthMiddleware';
import UserController from '../controller/UserController';
import AuthController from '../controller/AuthController';
import ChatController from '../controller/ChatBotController';
import TaskController from "../controller/TaskController";
import StoryController from "../controller/StoryController"

const router = express.Router();

router.use("/auth", AuthController);

router.use("/users", AuthMiddleware, UserController);

router.use("/chatbot", AuthMiddleware, ChatController);

router.use("/tasks", AuthMiddleware, TaskController);

router.use("/story", StoryController);

export default router;