import { jwtDecode } from "jwt-decode";

export const accessTokenName = "vivaAccessToken";

export const refreshTokenName = "vivaRefreshToken"

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const isNull = (value) => {
    return !value || value == null || value == undefined || value == "";
}

export const isNotNull = (value) => {
    return !isNull(value);
}

export const getAccessToken = () => {
    return localStorage.getItem(accessTokenName);
};

export const isLoggedIn = () => {    
    return isNotNull(localStorage.getItem(accessTokenName));
}

export const checkLoggedInUser = () => {
    return isLoggedIn() ? jwtDecode(getAccessToken()) : [];
};

export const imageToByte = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
};

export const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;

    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
};

// export const handleLogout = () => {
//     // localStorage.setItem(accessTokenName, '');
//     localStorage.removeItem(accessTokenName);
//     document.cookie = refreshTokenName + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=Lax;";
//     window.open("/", "_top");
// };

export const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0]
    // const [year, month, day] = new Date(date).toISOString().split('T')[0].split('-');
    // return `${day}-${month}-${year}`;
}


export const viewGoogleDriveLink = (link) => {
    // Regex to match Google Drive links that end with /preview
    const regex = /(https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+)\/preview/;
  
    // If the link matches the regex, replace /preview with /view
    if (regex.test(link)) {
      return link.replace("/preview", "/view");
    }
    
    // Return the link as is if it doesn't match the pattern
    return link;
};

export const paginationSize = 10;

export const notAvailableMessage = "Not available";

export const requestParam = "?page=";

export const addRequestParam = (link, paramName, paramValue) => {
    // paramValue = parseInt(paramValue);
    if(paramValue == 0) paramValue = 1;
    //console.log(link + "?" + paramName + "=" + paramValue)
    return link + "?" + paramName + "=" + paramValue;
}

export const validateFile = (file) => {
    return file && file.size <= MAX_FILE_SIZE;
}

export const isUserSetInUserContext = (user) => {
    return user?.id ? true : false;
}