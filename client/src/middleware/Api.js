import React from 'react';
import axios from 'axios';

import { accessTokenName, getAccessToken } from '../utils/utils';

const API_PATH = import.meta.env.VITE_API_PATH;

const API_CALL_MAX_TRIES = 5;

const API = axios.create({
    baseURL: API_PATH,
    withCredentials: true,
    timeout: 10000,
});

API.interceptors.request.use(
    (config) => {
        // if (!config._retry) {
        //     config._retry = 0; 
        // }

        // if (config._retry >= API_CALL_MAX_TRIES) {
        //     console.warn('Request retry limit reached, preventing further retries.');
        //     return Promise.reject(new Error('Request retry limit reached.'));
        // }

        const token = getAccessToken()
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // config._retry += 1

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    response => response,
    async error => {
        console.log(error)

        // if (error.code == "ECONNABORTED" && error.message == "timeout of 10000ms exceeded") {
        //     window.open("/notFound", "_top");
        // }
        if (error.code == "ERR_NETWORK") {
            window.open("/notFound", "_top");
        }

        const response = error?.response;

        if (response?.status == 401) { 
            if (response.data.message == "Invalid or expired refresh token") {
                handleLogout();
            } else {
                const token = await refreshAccessToken();
                error.config.headers['Authorization'] = `Bearer ${token}`;
                return API.request(error.config);
            }
        }  else if(response?.status == 404 || response?.status == 500 ) {
            // window.location.href = '/notFound';
            // return new Promise(() => {});
        }

        return Promise.reject(error); // Other errors not related to token
    }
);

// Function to refresh the access token
const refreshAccessToken = async () => {
    try {
        const { data } = await API.post(`${API_PATH}/auth/refresh`);
        //console.log(data.message);
        localStorage.setItem(accessTokenName, data.token);  
        return data.token;
    } catch (error) {
        console.error('Unable to refresh token:', error);
    }
};

 const handleLogout = async () => {
      try{
        await API.get(`${API_PATH}/auth/logout`);
        //console.log("ok");
        localStorage.removeItem(accessTokenName);
        window.open("/", "_top");
      } catch(error) {
        console.log("something went wrong");
        alert("something went wrong");
      }
};

export { API, refreshAccessToken, handleLogout };