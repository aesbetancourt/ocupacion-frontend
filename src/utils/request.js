import axios from "axios";
import config from "../config/config";
// const token = localStorage.getItem("token")
//const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxNTkwOTU3Mn0.M9fVlzhcoNBHbY7sieiGuO2aJrDNR-w1eeq6lplQFtg"
const token = localStorage.getItem('token')
const Instance = axios.create({
    baseURL: config.backURL,
    headers: { Authorization: `Bearer ${token}` }
});

export default Instance
