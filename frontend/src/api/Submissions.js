import axios from 'axios'
export const fetchAllSubmittionsById= async({queryKey})=>{
       const formId = queryKey[1]; 
        if (!formId) {
            throw new Error("Form ID is missing.");
        }
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/submittions/submissions/${formId}`);
        return data;
}