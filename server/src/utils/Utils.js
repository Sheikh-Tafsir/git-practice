import { SOMETHING_WENT_WRONG } from "./Messages";

export const paginationSize = 10;

export const pageCount = (rowCount) => {
    return Math.floor((rowCount + paginationSize - 1) / paginationSize);
}

export const isNull = (value) => {
    return !value || value == null || value == "" || value == undefined;
}

export const isNotNull = (value) => {
    return !isNull(value);
}

export const isString = (value) => {
    return typeof errors.error === 'string';
}

export const RuntimeError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
}

export const NotReturnableRuntimeError = (status, message) => {
    console.log("error: " + message);

    const error = new Error(SOMETHING_WENT_WRONG);
    error.status = status;
    return error;
}

export const ApiResponse = (message, data) => {
    return {
        message,
        data
    }
}