import Database from '../config/DatabaseConfig'
import ChatBotList from '../model/ChatBotList';
import ChatBotMessage from '../model/ChatBotMessage';
import { isNull } from '../utils/Utils';
import { chatBotRoleList } from "../utils/Enums";
import { chat, textAndImageFile } from "../config/GeminiConfig";
import { COULD_NOT_PROCESS } from '../utils/Messages';

export const getChatsByUserId = async (userId) => {
    return await ChatBotList.findAll({
        where: {
            userId,
        },
    
        order: [['updatedAt', 'DESC']], 
    });
}

export const getMessagesByChatId = async (chatBotId, userId) => {
    if(isNull(chatBotId)) {
        return null;
    }

    const chatBot = await ChatBotList.findByPk(chatBotId);
    if (userId != chatBot.userId) throw NotReturnableRuntimeError(UNAUTHORIZED);

    return await ChatBotMessage.findAll({
        where: {
            chatBotId,
        },
    
        order: [['createdAt', 'ASC']], 
    });
}

export const sendMessage = async (reqBody, chatBotId, image) => {
    const {newMessage, userId} = reqBody;
    const chatHistory = JSON.parse(reqBody.chatHistory);

    const transaction = await Database.transaction();
    try {

        chatBotId = chatBotId == 0 ? await createChat(userId) : chatBotId;

        await saveMessage(chatBotId, newMessage, chatBotRoleList[0], transaction);
        
        let reply = image ? await textAndImageFile(newMessage, image): await chat(chatHistory, newMessage);  
        //let reply = await chat(chatHistory, newMessage);  
        
        if (!reply) reply = COULD_NOT_PROCESS;   

        await saveMessage(chatBotId, reply, chatBotRoleList[1], transaction);

        await increaseMessageCount(chatBotId, transaction);
        
        await transaction.commit();

        return {reply, chatBotId};
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        throw error;
    }
    
}

const createChat = async (userId) => {
    const chat = await ChatBotList.create(
        {
            name: "chatbot",
            userId,
        }
    );

    return chat.id;
}

export const saveMessage = async (chatBotId, message, role, transaction) => {
    await ChatBotMessage.create(
        {
            chatBotId,
            message,
            role,
        },
        { transaction }
    );
}

export const deleteChat = async (id) => {
    const transaction = await Database.transaction();

    try {
        // Delete all messages associated with the chat
        await ChatBotMessage.destroy({
            where: { chatBotId: id },
            transaction
        });

        // Delete the chat record itself
        await ChatBotList.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


const increaseMessageCount = async (chatBotId, transaction) => {
    const chatBot = await ChatBotList.findByPk(chatBotId);

    if (!chatBot) {
        throw new Error(`ChatBot with ID ${chatBotId} not found`);
    }

    if (chatBot.messageCount) {
        chatBot.messageCount = chatBot.messageCount+1;
    } else {
        chatBot.messageCount = 1;
    }

    await chatBot.save({ transaction });
}