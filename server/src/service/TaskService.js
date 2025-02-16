import Database from '../config/DatabaseConfig'
import { textAndImageFile, textOnly } from '../config/GeminiConfig';

import Task from "../model/Task"
import TaskDescription from "../model/TaskDescription"
import { SOMETHING_WENT_WRONG, UNAUTHORIZED } from '../utils/Messages';
import { NotReturnableRuntimeError, RuntimeError } from '../utils/Utils';

export const simplifyTask = async (reqBody, image) => {
    const extraPrompt = `"prompt": "Provide a step-by-step guide for completing the following task: {WORK_TO_BE_SIMPLIFIED}.  Return the steps in JSON format, where each step is an object with the keys 'step' (string).  Ensure the steps are clear, concise, and easy to follow. Don't need index in steps. Prioritize clarity and completeness in your response.",
  "example_work_to_be_simplified": `;

    const {userId, prompt} = reqBody;

    const transaction = await Database.transaction();
    try {
        const taskId = await saveTask(userId, prompt, transaction);
        
        let reply = image ? await textAndImageFile(extraPrompt + prompt, image): await textOnly(extraPrompt + prompt);  
        if (!reply) reply = COULD_NOT_PROCESS; 
        
        reply = reply.trim().replace(/^```json\s*/, '').replace(/```$/, '').trim();

        let steps = JSON.parse(reply);
        steps = steps.map(step => ({
            ...step,
            taskId,
            done: false
        }));

        //console.log(steps);
        
        await saveSteps(steps, transaction);

        await transaction.commit();
        return {
            taskId,
        }
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        throw error;
    }
}

export const saveTask = async (userId, prompt, transaction) => {

    const task = Task.build({userId, prompt});
    await task.validate();
    await task.save({ transaction });

    return task.id;
}

export const saveSteps = async (steps, transaction) => {
    const tasks = steps.map(async (step) => {
        return await TaskDescription.create({
            taskId: step.taskId,
            step: step.step,
            done: step.done
        }, { transaction });
    });

    await Promise.all(tasks);
};

export const getTasksByUserId = async (userId) => {
    return await Task.findAll({
        where: {
            userId,
        },
    
        order: [['createdAt', 'DESC']], 
    });
}

export const getTaskDescriptionByTaskId = async (taskId, userId) => {
    const task = await Task.findByPk(taskId);
    if (userId != task.userId) throw NotReturnableRuntimeError(UNAUTHORIZED);
    
    return await TaskDescription.findAll({
        where: {
            taskId,
        },
    });
}

export const deleteTask = async (id) => {
    const transaction = await Database.transaction();
    
    try {
        // Delete all task todo associated with the chat
        await TaskDescription.destroy({
            where: { taskId: id },
            transaction
        });

        // Delete the chat record itself
        await Task.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};