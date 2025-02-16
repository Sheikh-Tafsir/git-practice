export const lengthValidationMessage = (min, max) => {
    if(min && max)return `Should be between ${min} and ${max} characters`
    else if (!min && max) return `Should be less than ${max} characters`
    else if(min && !max) return `Should be more than ${max} characters`
}

export const requiredValidationMessage = "Required";

export const notFoundMessage = "Not Found";

export const NOT_FOUND = "Not Found";

export const ACCESS_TOKEN_REQUIRED = 'Access Token Required or Expired';

export const UNAUTHORIZED =  "Unauthorized"

export const FOUND = "Found"

export const CREATED = "Created successfully"

export const UPDATED = "Updated successfully"

export const DELETED = "Deleted successfully"

export const IS_NUMERIC = "Should contain only numbers"

export const SOMETHING_WENT_WRONG = "Something went wrong"

export const COULD_NOT_PROCESS = "could not process"

export const UNSUPPORTED_IMAGE_FORMAT = "Unsupported image format";