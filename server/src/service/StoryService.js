import Database from '../config/DatabaseConfig'

import axios from 'axios';
import sharp from 'sharp';

import { isNull } from '../utils/Utils';
import { chat, textAndImageFile } from "../config/GeminiConfig";
import { COULD_NOT_PROCESS } from '../utils/Messages';
import { binaryToBase64 } from '../utils/ImageUtils';

export const generateImage = async (prompt) => {
    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURI(prompt)}`, 
        {responseType: 'arraybuffer'});

    const compressedBuffer = await sharp(response.data)
    .jpeg({ quality: 10 })
    .toBuffer();

    return compressedBuffer.toString('base64');
}