import  { useState, lazy, useEffect, Suspense } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, TrendingUp, X } from "lucide-react";
import { fetchAllForms } from "../api/Forms.js";
import{ toast} from 'react-toastify'
import DynamicTransitionLoadingSpinner from "../components/ui/DynamicTransitionLoadingSpinner.jsx";

const Modal = lazy(()=>import('../components/ui/Modal.jsx'));
const FormTable = lazy(()=>import('../components/ui/FormTable.jsx'))
const CreateFormComponent = lazy(()=>import('../components/ui/CreateFormComponent.jsx'));


const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let active = 0;


const navigateToFormBuilder = (id) => {
    setIsModalOpen(false);
    navigate(`/edit/${id}`);
};

const navigateToSubmissions = (id) => {
    navigate(`/form/submissions/${id}`);
};

const handleStatusChange = async (id, prevStatus) => {
  const newStatus = !prevStatus;

  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/form/status-update/${id}`,
      { isActive: newStatus }
    );

    if (!response?.data?.success) {
      toast.error("Error in status change");
      return;
    }

    // Update UI immediately (Optimistic Update)
    setForms((prevForms) =>
      prevForms.map((form) =>
        form._id === id ? { ...form, isActive: newStatus } : form
      )
    );

    toast.success("Status updated successfully");
  } catch (error) {
    toast.error("Internal Server Error");
  }
};

useEffect(() => {
    setIsLoading(true);
    fetchAllForms()
      .then((data) => {
        setForms(data?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, []);



  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      {/* Header and Controls */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Form Management Dashboard
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create new Form
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-500">Total Forms</h3>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">
            {forms.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-500">Active Forms</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">
            {forms.filter((f) => f.isActive).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-500">
              Total Submissions (Mock)
            </h3>
            <X className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">450</p>
        </div>
      </div>

      {/* Main Content: Forms Table */}
      
        {<FormTable forms={forms} handleStatusChange={handleStatusChange} navigateToFormBuilder={navigateToFormBuilder} navigateToSubmissions={navigateToSubmissions}/>}

      {/* Form Creation Modal */}
     <Suspense fallback={<DynamicTransitionLoadingSpinner/>}>
       {isModalOpen&&<Modal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        title="Create New Form Definition"
      >
        <CreateFormComponent />
      </Modal>}
      </Suspense>
    </div>
  );
};

export default Dashboard;
