import React , {useState, useEffect, lazy} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams,useNavigate } from 'react-router-dom'; 
import { fetchParticularForm } from '../api/Forms.js'; 
import FieldComponent from '../components/ui/FieldComponent.jsx';
import DynamicTransitionLoadingSpinner from '../components/ui/DynamicTransitionLoadingSpinner.jsx';
import {toast} from 'react-toastify'
import axios from 'axios'

const DynamicErrorComponent= lazy(()=>import('../components/ui/DynamicErrorComponent.jsx'));

// Initial state for a single field definition form
const initialSchemaState = {
    name: '',
    label: '',
    type: 'text', // Default to text
    required: true,
    options: [],
    min: null,
    max: null,
    order: 0,
};

const DynamicFormPage = () => {
    const { id } = useParams(); 
    const navigate= useNavigate();
    // --- QUERY LOGIC (Kept but separated for clarity) ---
    const { 
        data: formResponse,
        isLoading, 
        isError, 
        error,
    } = useQuery({
        queryKey: ['form', id], 
        queryFn: fetchParticularForm, 
        enabled: !!id, 
        staleTime: 1000 * 60 * 5, 
    });
    // ---------------------------------------------------

    // 1. STATE FOR THE SINGLE INPUT FORM (Left side)
    const [fieldData, setFieldData] = useState(initialSchemaState);
    const [optionsInput, setOptionsInput] = useState(''); 
    
    // 2. STATE FOR THE TEMPORARY SCHEMA ARRAY (Right side)
    const [formFieldsArray, setFormFieldsArray] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    // if(formResponse &&formResponse?.data)formFieldsArray.push(formResponse?.data?.fields);
    // console.log("FORM:",formFieldsArray);
    // List of allowed types from your schema
    const allowedTypes = ["text", "email", "number", "textarea", "select", "checkbox", "date"];
    
    // Check which properties are relevant for the current type
    const showOptions = ['select'].includes(fieldData.type);
    const showMinMax = ['number'].includes(fieldData.type);

    // Effect to parse and clean up the options array whenever optionsInput changes
    useEffect(() => {
        if (showOptions) {
            const newOptions = optionsInput
                .split(',')
                .map(opt => opt.trim())
                .filter(opt => opt.length > 0);
            
            setFieldData(prev => ({ ...prev, options: newOptions }));
        } else {
            // Clear options, min, max if the type is changed away from 'select' or 'number'
            setFieldData(prev => ({ 
                ...prev, 
                options: [], 
                min: prev.type === 'number' ? prev.min : null, 
                max: prev.type === 'number' ? prev.max : null 
            }));
        }
    }, [optionsInput, fieldData.type, showOptions]);

    // When form loads, populate temporary schema array with existing fields
    useEffect(() => {
        const existing = formResponse?.data?.fields;
        if (existing && Array.isArray(existing)) {
            setFormFieldsArray(existing);
        }
    }, [formResponse]);

    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setFieldData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        // Use parseInt or Number, and allow null/empty string for clearing the input
        const numValue = value === '' ? null : Number(value); 
        
        setFieldData(prev => ({
            ...prev,
            [name]: numValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prepare the field data for storage
        let finalData = { ...fieldData };
        
        // Cleanup unnecessary keys if the type doesn't need them
        if (!showMinMax) {
             finalData.min = null;
             finalData.max = null;
        }
        if (!showOptions) {
            finalData.options = [];
        }

        // 3. Save the field to the temporary array state
        if (editingIndex !== null && editingIndex >= 0) {
            setFormFieldsArray(prev => {
                const next = [...prev];
                next[editingIndex] = finalData;
                return next;
            });
            setEditingIndex(null);
        } else {
            setFormFieldsArray(prevArray => [...prevArray, finalData]);
        }

        // Reset the input form for the next field
        setFieldData(initialSchemaState);
        setOptionsInput(''); // Also clear the options input

        console.log("Field added to temporary schema array:", finalData);
    };

    const handleEditField = (index) => {
        const f = formFieldsArray[index];
        if (!f) return;
        setFieldData({ ...f });
        setOptionsInput(Array.isArray(f.options) ? f.options.join(', ') : '');
        setEditingIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteField = (index) => {
        setFormFieldsArray(prev => prev.filter((_, i) => i !== index));
        if (editingIndex === index) {
            setEditingIndex(null);
            setFieldData(initialSchemaState);
            setOptionsInput('');
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setFieldData(initialSchemaState);
        setOptionsInput('');
    };
    
 const handleFinalSubmittion = async () => {
        // 'id' is available from the component's scope
        if (!id) {
            toast.error("Error: Form ID is missing.");
            return;
        }

        try {
            // Ensure you use the correct state variable holding the collected fields
            // Assuming your state is named 'formFieldsArray'
            const finalSchema = await axios.post(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/form/add-fields/${id}`, 
                { fields: formFieldsArray } // Send the temporary schema array
            );

            // 3. Handle successful response
            toast.success("Form schema successfully saved!");
            console.log("Submission successful:", finalSchema.data);
            navigate(`/form/${form.key}`)
            // Optional: You might want to navigate away or clear the form here.
            
        } catch (error) {
            console.error("Submission error:", error);
            // Use error.response.data.message for more specific backend errors
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            toast.error(`Form Not Created: ${errorMessage}`);
        }
    };

    // --- JSX Helper Classes ---
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-gray-700";
    
    // --- Loading/Error Handling ---
    if (isLoading){return <DynamicTransitionLoadingSpinner value={"Getting your form ready..."}/>}
    const form = formResponse?.data;
    if(!formFieldsArray.length===0){

        return <h1>No</h1>
    }
    if (isError || !id || !form) {
        const message = !id || !form ? 
            `Form with key "${id}" was not found.` : 
            error?.message || "A network error occurred.";
        
        return <DynamicErrorComponent message={message}/>;
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* Header */}
            <header className="w-full bg-indigo-500 shadow-lg py-12 md:py-16 mb-6">
                <div className="max-w-7xl mx-auto px-6 text-white">
                    <h1 className="text-4xl font-extrabold mb-1">
                        {form.title || 'Untitled Form'}
                    </h1>
                    <p className="text-indigo-100 text-lg font-normal">
                        {form.description}
                    </p>
                </div>
            </header>

            {/* Main Grid: Builder (Left) and Preview (Right) */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto px-6'>
                
                {/* === LEFT COLUMN: FIELD BUILDER FORM === */}
                <div className="lg:order-first">
                    <div className="p-8 bg-white shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Define New Form Field</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* 1. Name (Key) */}
                            <div>
                                <label htmlFor="name" className={labelClasses}>Field Name (Key):</label>
                                <input
                                    type="text" name="name" id="name" required
                                    value={fieldData.name} onChange={handleFieldChange}
                                    className={inputClasses} placeholder="e.g., userEmail"
                                />
                            </div>

                            {/* 2. Label (User Visible Text) */}
                            <div>
                                <label htmlFor="label" className={labelClasses}>Display Label:</label>
                                <input
                                    type="text" name="label" id="label" required
                                    value={fieldData.label} onChange={handleFieldChange}
                                    className={inputClasses} placeholder="e.g., Your Email Address"
                                />
                            </div>

                            {/* 3. Type */}
                            <div>
                                <label htmlFor="type" className={labelClasses}>Field Type:</label>
                                <select
                                    name="type" id="type" required
                                    value={fieldData.type} onChange={handleFieldChange}
                                    className={`${inputClasses} appearance-none cursor-pointer`}
                                >
                                    {allowedTypes.map(t => (
                                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 4. Required (Boolean) */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox" name="required" id="required"
                                    checked={fieldData.required} onChange={handleFieldChange}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="required" className="ml-2 text-sm font-medium text-gray-900">
                                    Required
                                </label>
                            </div>
                            
                            {/* 5. Options (Conditional for Select) */}
                            {showOptions && (
                                <div>
                                    <label htmlFor="optionsInput" className={labelClasses}>Options (Comma-separated list):</label>
                                    <textarea
                                        name="optionsInput" id="optionsInput" rows="2"
                                        value={optionsInput} onChange={(e) => setOptionsInput(e.target.value)}
                                        className={`${inputClasses} resize-none`}
                                        placeholder="e.g., Option A, Option B, Another Choice"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Parsed: **[{fieldData.options.join(', ')}]**</p>
                                </div>
                            )}
                            
                            {/* 6. Min/Max (Conditional for Number) */}
                            {showMinMax && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="min" className={labelClasses}>Minimum Value (min):</label>
                                        <input
                                            type="number" name="min" id="min"
                                            value={fieldData.min === null ? '' : fieldData.min}
                                            onChange={handleNumberChange}
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="max" className={labelClasses}>Maximum Value (max):</label>
                                        <input
                                            type="number" name="max" id="max"
                                            value={fieldData.max === null ? '' : fieldData.max}
                                            onChange={handleNumberChange}
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {/* 7. Order */}
                            <div>
                                <label htmlFor="order" className={labelClasses}>Display Order:</label>
                                <input
                                    type="number" name="order" id="order"
                                    value={fieldData.order} onChange={handleNumberChange}
                                    className={inputClasses}
                                />
                            </div>

                            {/* Submit / Save Buttons */}
                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-150"
                                >
                                    {editingIndex !== null ? 'Save Changes' : 'Add Field to Schema'}
                                </button>
                                {editingIndex !== null && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="py-3 px-4 bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm hover:bg-gray-300 transition duration-150"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div> 

                {/* === RIGHT COLUMN: LIVE FORM PREVIEW === */}
                <div className="space-y-4 lg:order-last">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                        ✨ Form Preview
                    </h2>
                    
                    <div className="p-8 bg-white rounded-lg shadow-xl">
                        
                        {/* Render fields from the temporary state array */}
                        {formFieldsArray.length > 0 ? (
                            <form className="space-y-6">
                                {formFieldsArray.map((field, index) => (
                                    <div key={field.name + index} className="flex items-start justify-between border-b pb-3">
                                        <div className="flex-1">
                                            <FieldComponent data={field} />
                                        </div>
                                        <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditField(index)}
                                                className="text-indigo-600 hover:underline text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteField(index)}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleFinalSubmittion}
                                    className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-150"
                                >
                                    Create Form
                                </button>
                            </form>
                        ) : (
                            <div className="p-8 text-center text-gray-500 border border-dashed rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">No Questions Defined</h3>
                                <p>Use the form on the left to add your first field to the temporary schema.</p>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicFormPage;