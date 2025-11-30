import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Plus, FileText, TrendingUp, X } from 'lucide-react'; 
import Modal from '../components/ui/Modal.jsx'
import CreateFormComponent from '../components/ui/CreateFormComponent.jsx';
import DynamicTransitionLoadingSpinner from '../components/ui/DynamicTransitionLoadingSpinner.jsx'
import { fetchAllForms } from '../api/Forms.js';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let active =0;
    useEffect(() => {
        setIsLoading(true);
        fetchAllForms().then(data => {
            setForms(data?.data);
            console.log("forms--",forms);
            setIsLoading(false);
        }).catch(err => {
            console.error("Fetch error:", err);
            setIsLoading(false);
        });
    }, []);

    const navigateToFormBuilder = (id) => {
        setIsModalOpen(false);
        navigate(`/create/${id}`); 
    };

    const navigateToSubmissions = (id) => {
        navigate(`/form/submissions/${id}`);
    }

    const renderFormTable = () => {
        if (isLoading) {
            return (
                <DynamicTransitionLoadingSpinner value={"Loading Forms"}/>
            );
        }

        if (forms.length === 0) {
            return (
                <div className="text-center p-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FileText className="w-8 h-8 mx-auto mb-3" />
                    <p className="font-semibold">No forms created yet.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Key</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Live Link</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {forms.map((form) => (
                            <tr key={form.key} className="hover:bg-blue-50/50 transition duration-100">
                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{form.title}</div><div className="text-xs text-gray-500 italic">Key: {form.key}</div></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">{form.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${form.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {form.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => navigate(`/form/${form?.key}`)} className="text-blue-600 animate-pulse hover:text-blue-900 font-medium transition duration-150">Live Link</button>
                                    
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(form.updatedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => navigateToFormBuilder(form._id)} className="text-blue-600 hover:text-blue-900 font-medium transition duration-150">Edit</button>
                                    <button onClick={() => navigateToSubmissions(form._id)} className="text-green-600 hover:text-green-900 font-medium transition duration-150">Submissions</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
            
            {/* Header and Controls */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Form Management Dashboard</h1>
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
                    <div className="flex justify-between items-center"><h3 className="text-md font-medium text-gray-500">Total Forms</h3><FileText className="w-5 h-5 text-blue-500" /></div>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">{forms.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <div className="flex justify-between items-center"><h3 className="text-md font-medium text-gray-500">Active Forms</h3><TrendingUp className="w-5 h-5 text-green-500" /></div>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">{forms.filter(f => f.isActive).length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <div className="flex justify-between items-center"><h3 className="text-md font-medium text-gray-500">Total Submissions (Mock)</h3><X className="w-5 h-5 text-yellow-500" /></div>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">450</p>
                </div>
            </div>

            {/* Main Content: Forms Table */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Existing Forms</h2>
                {renderFormTable()}
            </div>

            {/* Form Creation Modal */}
            <Modal
                isOpen={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                title="Create New Form Definition"
            >
                <CreateFormComponent />
            </Modal>
        </div>
    );
};

export default Dashboard;