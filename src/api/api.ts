import axios from 'axios';

const urlDefault = 'http://192.168.7.10:8080';
const enderecoRest = {
    url: urlDefault
}

/**
 * Criacao do objeto api
 */
const api = axios.create({
    baseURL: urlDefault,
});

function getBaseUrl() {
    return enderecoRest.url || urlDefault;
}

api.interceptors.request.use(async config => {
    config.baseURL = await getBaseUrl();
    return config;
},
    error => Promise.reject(error)
);


api.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.log('Detalhes do erro:', error.response || error.request || error.message || error);
        return Promise.reject(error);
    });

api.interceptors.request.use(
    async config => {
        config.headers['Content-Type'] = 'application/json';
        return config
    },
    error => {
        console.warn(error);
        return Promise.reject(error)
    }
);


export { api, enderecoRest };

