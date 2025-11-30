import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateFormComponent = ({ onCreateSuccess }) => {
  const [formData, setFormData] = useState({
    key: "",
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = { ...formData, fields: [] };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `http://localhost:5003/api/form/create-form`,
        submissionData
      );

      if (response.data && response.data.success) {
        toast.success("Form created successfully!");
        if (onCreateSuccess) onCreateSuccess(response.data.data.key); 
        setFormData({ key: "", title: "", description: "" });
        navigate(`/create/${response?.data?.data?._id}`);
      } else {
        toast.error(response.data.message || "Form creation failed (Server Error)");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Form creation failed! (Network Error)";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.key && formData.title && formData.description;

 const inputClasses =
    "mt-1 block w-full px-4 py-2 bg-gray-50 rounded-lg shadow-inner placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition duration-200";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1";

  return (
   <div className="bg-white p-8 max-w-lg mx-auto transform transition duration-500 hover:shadow-3xl">
      
   <div className="flex items-center space-x-3 mb-6 pb-4">
        <Zap className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Define New Form</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className={labelClasses}>Form Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Annual Employee Survey"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="key" className={labelClasses}>Unique Key / Slug</label>
          <input
            type="text"
            id="key"
            name="key"
            value={formData.key}
            onChange={handleChange}
            required
            placeholder="e.g., employee-survey-2025"
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only."
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-gray-500">Used in URLs and API calls. Must be unique.</p>
        </div>

        <div>
          <label htmlFor="description" className={labelClasses}>Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Brief explanation of the form's purpose."
            rows="3"
            className={inputClasses}
          />
        </div>

        {/* Action Button: High contrast, prominent color, and shadow */}
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-semibold transition duration-200 shadow-lg transform hover:scale-[1.01] ${
            isSubmitting || !isFormValid
              ? "bg-gray-400 cursor-not-allowed shadow-none"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/50"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Creating Definition...
            </>
          ) : (
            "Create Form & Edit Fields"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateFormComponent;