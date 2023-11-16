import axios from 'axios';
const axiosApiInstance = axios.create({
    baseURL:`${process.env.REACT_APP_UNSPLASH_URL_API}`,
    timeout:20000
});

axiosApiInstance.interceptors.request.use(
    async config => {
        const rawToken = localStorage.getItem('_shopyourchance')
        if(rawToken!==null){
            let accessToken = await JSON.parse(rawToken)
            config.headers.Authorization = `Bearer ${accessToken.accessToken}`
        }
        return config;
    },
    error => {
      Promise.reject(error)
});
axiosApiInstance.interceptors.response.use((response) => {
    
    return response;
}, async function (error) {

    return Promise.reject(error);
});

export const httpClient = axiosApiInstance