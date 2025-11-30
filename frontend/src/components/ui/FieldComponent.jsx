
const FieldComponent = ({ data , value, onChange }) => {
    if (!data) return null;

    const { label, name, options, required, type, placeholder } = data;

    const baseInputClasses = "mt-1 block w-full px-4 py-3 bg-gray-50 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition duration-150";
    const labelClasses = "block text-base font-semibold text-gray-800 mb-2";

    const getPlaceholderText = () => placeholder || `Enter ${label}...`;
    
    const handleChange = (e)=>{
        if(!onChange)return;
        if(type==='checkbox' || type==='radio'){
            onChange(e.target.checked);
        }else{
            onChange(e.target.value);
        }
    }

    // --- Component Rendering ---
    // switch (type) {
    //     case 'textarea':
    //         return (
    //             // Container: No shadow, no border, only bottom margin for separation
    //             <div className="mb-6">
    //                 <label htmlFor={name} className={labelClasses}>
    //                     {label} {required && <span className="text-red-500">*</span>}
    //                 </label>
    //                 <textarea 
    //                     id={name}
    //                     name={name}
    //                     required={required}
    //                     rows="4"
    //                     placeholder={getPlaceholderText()}
    //                     className={`${baseInputClasses} resize-none`}
    //                 />
    //             </div>
    //         );

    //     case 'select':
    //         return (
    //             <div className="mb-6">
    //                 <label htmlFor={name} className={labelClasses}>
    //                     {label} {required && <span className="text-red-500">*</span>}
    //                 </label>
    //                 <select 
    //                     id={name}
    //                     name={name}
    //                     required={required}
    //                     className={`${baseInputClasses} cursor-pointer appearance-none`}
    //                 >
    //                     <option value="" disabled>Select an option</option>
    //                     {options?.map((option, index) => (
    //                         <option key={index} value={option}>
    //                             {option}
    //                         </option>
    //                     ))}
    //                 </select>
    //             </div>
    //         );

    //     case 'checkbox':
    //     case 'radio':
    //         // Renders as a simple block with internal spacing
    //         return (
    //             <div className="mb-6 py-2 flex items-center justify-start space-x-3">
    //                 <input
    //                     type={type}
    //                     id={name}
    //                     name={name}
    //                     required={required}
    //                     // Checkbox/Radio styling is adjusted for the flat look
    //                     className="h-5 w-5 text-blue-600 border-gray-400 focus:ring-blue-500 cursor-pointer"
    //                 />
    //                 <label htmlFor={name} className="text-base text-gray-800 font-normal cursor-pointer">
    //                     {label} {required && <span className="text-red-500">*</span>}
    //                 </label>
    //             </div>
    //         );

    //     case 'number':
    //     case 'email':
    //     case 'date':
    //     case 'text':
    //     default:
    //         // Standard input types
    //         return (
    //             <div className="mb-6">
    //                 <label htmlFor={name} className={labelClasses}>
    //                     {label} {required && <span className="text-red-500">*</span>}
    //                 </label>
    //                 <input 
    //                     type={type}
    //                     id={name}
    //                     name={name}
    //                     required={required}
    //                     placeholder={getPlaceholderText()}
    //                     className={baseInputClasses}
    //                 />
    //             </div>
    //         );
    // }


    switch (type) {
    case "textarea":
      return (
        <div className="mb-6">
          <label htmlFor={name} className={labelClasses}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            id={name}
            name={name}
            required={required}
            rows="4"
            placeholder={getPlaceholderText()}
            className={`${baseInputClasses} resize-none`}
            value={value ?? ""}
            onChange={handleChange}
          />
        </div>
      );

    case "select":
      return (
        <div className="mb-6">
          <label htmlFor={name} className={labelClasses}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <select
            id={name}
            name={name}
            required={required}
            className={`${baseInputClasses} cursor-pointer appearance-none`}
            value={value ?? ""}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select an option
            </option>
            {options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "checkbox":
    case "radio":
      return (
        <div className="mb-6 py-2 flex items-center justify-start space-x-3">
          <input
            type={type}
            id={name}
            name={name}
            required={required}
            className="h-5 w-5 text-blue-600 border-gray-400 focus:ring-blue-500 cursor-pointer"
            checked={!!value}
            onChange={handleChange}
          />
          <label
            htmlFor={name}
            className="text-base text-gray-800 font-normal cursor-pointer"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
      );

    case "number":
    case "email":
    case "date":
    case "text":
    default:
      return (
        <div className="mb-6">
          <label htmlFor={name} className={labelClasses}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={type}
            id={name}
            name={name}
            required={required}
            placeholder={getPlaceholderText()}
            className={baseInputClasses}
            value={value ?? ""}
            onChange={handleChange}
          />
        </div>
      );
  }
};

export default FieldComponent;