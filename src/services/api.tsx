import axios from 'axios'

export const api = axios.create({
    baseURL: "https://project-foodexplorer-api.onrender.com"
})