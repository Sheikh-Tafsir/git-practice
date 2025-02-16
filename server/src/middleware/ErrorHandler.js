import { SOMETHING_WENT_WRONG } from "../utils/Messages";

// errorHandler.js
export const ErrorHandler = (err, req, res, next) => {
    console.log('error: ' + err); 

    if (err.status == 401 || err.status == 404) {
        return res.status(err.status).json({
            message: SOMETHING_WENT_WRONG,
        });
    } 

    if (err.status == 422) {
        return res.status(err.status).json({
            message: res.message || SOMETHING_WENT_WRONG,
        });
    }

    if (err.errors && Array.isArray(err.errors)) {
        const validationErrors = {};
        
        err.errors.forEach(error => {
            if (!validationErrors[error.path]) {
                validationErrors[error.path] = error.message;
            }
        });

        return res.status(422).json(validationErrors);
    }

    return res.status(err.status || 500).json({
        global: SOMETHING_WENT_WRONG,
    });
};
