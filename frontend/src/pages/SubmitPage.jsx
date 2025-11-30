import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchFormSchema } from "../api/Forms.js";
import FieldComponent from "../components/ui/FieldComponent.jsx";
import DynamicTransitionLoadingSpinner from "../components/ui/DynamicTransitionLoadingSpinner.jsx";
import DynamicErrorComponent from "../components/ui/DynamicErrorComponent.jsx";
import axios from "axios";

const SubmitPage = () => {
  const { key } = useParams();

  // fetch form schema
  const {
    data: formResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["form", key],
    queryFn: fetchFormSchema,
    enabled: !!key,
    staleTime: 1000 * 60 * 5,
  });

 
  // ---------------- responses state ----------------
  const [responses, setResponses] = useState({});

  const handleFieldChange = (fieldName, value) => {
    setResponses((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // ---------------- submit mutation ----------------
  const submitMutation = useMutation({
    mutationFn: async ({ formId, formData }) => {
      const { data } = await axios.post(
        `http://localhost:5003/api/submittions/submit/${formId}`,
        { formData }
      );
      return data;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form?._id) return;
    
    const formDataArray = form.fields.map((field) => ({
      name: field.name,
      value: responses[field.name] ?? "",
    }));

    const submitted=submitMutation.mutate({
      formId: form._id,
      formData: formDataArray,
    });

  };
  
 if (isLoading) {
    return (
      <DynamicTransitionLoadingSpinner value={"Getting your form ready..."} />
    );
  }
  const form = formResponse;
  if (isError || !key || !form) {
    const message =
      !key || !form
        ? `Form with key "${key}" was not found.`
        : error?.message || "A network error occurred.";

    return <DynamicErrorComponent message={message} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <header className="w-full bg-indigo-500 shadow-lg py-12 md:py-16 mb-6">
        <div className="max-w-3xl mx-auto px-6 text-white">
          <h1 className="text-4xl font-extrabold mb-1">
            {form.title || "Untitled Form"}
          </h1>
          <p className="text-indigo-100 text-lg font-normal">
            {form.description}
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 space-y-4">
        <div className="p-8 bg-white rounded-lg shadow-xl">
          {form.fields && form.fields.length > 0 ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {form.fields.map((field, index) => (
                <FieldComponent
                  key={field._id || index}
                  data={field}
                  value={responses[field.name] ?? ""}
                  onChange={(val) => handleFieldChange(field.name, val)}
                />
              ))}

              {submitMutation.isError && (
                <p className="text-sm text-red-600 mt-2">
                  {submitMutation.error?.message ||
                    "Something went wrong while submitting the form."}
                </p>
              )}

              {submitMutation.isSuccess && (
                <p className="text-sm text-green-600 mt-2">
                  Your response has been submitted successfully!
                </p>
              )}

              <button
                type="submit"
                disabled={submitMutation.isLoading}
                className="mt-4 py-3 px-8 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200"
              >
                {submitMutation.isLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <h3 className="text-xl font-semibold mb-2">No Questions Yet</h3>
              <p>This form is empty. Please contact the form creator.</p>
            </div>
          )}
        </div>

        {form.fields && form.fields.length > 0 && (
          <div className="p-4 bg-white rounded-lg shadow flex justify-end items-center">
            <p className="text-sm text-gray-500">Powered by DynamicForm Pro</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitPage;
