import axios from 'axios'
export const fetchAllSubmittionsById= async({queryKey})=>{
       const formId = queryKey[1]; 
        if (!formId) {
            throw new Error("Form ID is missing.");
        }
        const { data } = await axios.get(`http://localhost:5003/api/submittions/submissions/${formId}`);
        return data;
}