import axios, { AxiosRequestTransformer } from 'axios';

const isPlainObject = (v: unknown): v is Record<string, any> =>
    Object.prototype.toString.call(v) === '[object Object]';

const transformDates = (data: any): any => {
    if (data instanceof Date) {
        const year = data.getFullYear();
        const month = String(data.getMonth() + 1).padStart(2, '0');
        const day = String(data.getDate()).padStart(2, '0');
        const hours = String(data.getHours()).padStart(2, '0');
        const minutes = String(data.getMinutes()).padStart(2, '0');
        const seconds = String(data.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // YYYY-MM-DDTHH:mm:ss
    }
    if (Array.isArray(data)) {
        return data.map(transformDates);
    }
    if (isPlainObject(data)) {
        return Object.fromEntries(
            Object.entries(data).map(([key, val]) => [key, transformDates(val)])
        );
    }
    return data;
};

export const transformParams = (params: Record<string, any>): Record<string, any> => {
    return Object.fromEntries(
        Object.entries(params).map(([key, value]) => {
            if (value instanceof Date) {
                return [key, transformDates(value)];
            }
            return [key, value];
        })
    );
};

axios.defaults.transformRequest = [(data) => {
    return transformDates(data);
}, ...axios.defaults.transformRequest as AxiosRequestTransformer[]];


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

