import axios from 'axios';

export const fetchParticularForm = async ({ queryKey }) => {
    const formId = queryKey[1]; 
    if (!formId) {
        throw new Error("Form ID is missing.");
    }
    const { data } = await axios.get(`http://localhost:5003/api/form/${formId}`);
    return data;
};

export const fetchFormSchema = async ({ queryKey }) => {
    const formKey = queryKey[1];

    if (!formKey) throw new Error("Form Key is Missing");

    const { data } = await axios.get(
        `http://localhost:5003/api/form/key/${encodeURIComponent(formKey)}`
    );
    return data.data;
};


export const fetchAllForms = async()=>{
    const {data} = await axios.get('http://localhost:5003/api/form/all-forms')
    return data;
}