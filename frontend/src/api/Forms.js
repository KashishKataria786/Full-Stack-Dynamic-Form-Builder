import axios from 'axios';

export const fetchParticularForm = async ({ queryKey }) => {
    const formId = queryKey[1]; 
    if (!formId) {
        throw new Error("Form ID is missing.");
    }
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/form/${formId}`);
    return data;
};

export const fetchFormSchema = async ({ queryKey }) => {
    const formKey = queryKey[1];

    if (!formKey) throw new Error("Form Key is Missing");

    const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/form/key/${encodeURIComponent(formKey)}`
    );
    return data.data;
};


export const fetchAllForms = async()=>{
    const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/form/all-forms`)
    return data;
}