import axios from "axios";

const instance = axios.create({
    baseURL:"http://localhost:4556/"
})


export default instance;