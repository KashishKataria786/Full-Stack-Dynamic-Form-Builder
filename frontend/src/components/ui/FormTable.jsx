import {lazy , Suspense, useState} from 'react'
import {  FileText } from "lucide-react";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import {useNavigate}from 'react-router-dom'
import DynamicTransitionLoadingSpinner from './DynamicTransitionLoadingSpinner.jsx'

const DeleteFormComponent = lazy(()=>import('./DeleteFormComponent.jsx'));
const Modal= lazy(()=>import('./Modal.jsx'));

const FormTable = ({forms=null, handleStatusChange, navigateToFormBuilder, navigateToSubmissions}) => {

  const [openDeleteModal,setOpenDeleteModal]= useState(false);
  const [deletedId,setDeletedId]= useState(null);

  const navigate= useNavigate();
  if(forms===null){
    return <DynamicTransitionLoadingSpinner/>
  }
    if (forms&&forms.length === 0) {
      return (
        <div className="text-center p-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="w-8 h-8 mx-auto mb-3" />
          <p className="font-semibold">No forms created yet.</p>
        </div>
      );
    }

    return ( <>
        <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Existing Forms</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title / Key
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Live Link
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Updated
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forms.map((form) => (
              <tr
                key={form.key}
                className="hover:bg-blue-50/50 transition duration-100"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {form.title}
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    Key: {form.key}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                  {form.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() =>
                        handleStatusChange(form._id, form.isActive)
                      }
                    >
                      {form.isActive ? (
                        <BsToggleOn size={20} />
                      ) : (
                        <BsToggleOff size={20} />
                      )}
                    </button>

                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        form.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {form.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                  disabled={form?.isActive ? false:true}
                    onClick={() => navigate(`/form/${form?.key}`)}
                    className={`${form?.isActive ?"text-blue-600 transition duration-15 animate-pulse hover:text-blue-900 ":"text-gray-200"}   font-medium 0`}
                  >
                    Live Link
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(form.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => navigateToFormBuilder(form._id)}
                    className="text-blue-600 hover:text-blue-900 font-medium transition duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigateToSubmissions(form._id)}
                    className="text-green-600 hover:text-green-900 font-medium transition duration-150"
                  >
                    Submissions
                  </button>
                    <button
                    onClick={() =>{ setOpenDeleteModal(true); setDeletedId(form._id)}}
                    className="text-red-600 hover:text-red-900 font-medium transition duration-150"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

     {/* Modal */}
     <Suspense fallback={"Loading"}>
      {openDeleteModal&&<Modal isOpen={openDeleteModal} title={"Delete A Form !"} handleClose={()=>setOpenDeleteModal(false)} >
        <DeleteFormComponent id={deletedId} onDeleted={""} onClose={()=>setOpenDeleteModal(false)}/>
        </Modal>}
  </Suspense>      </>
    );
  };

  export default FormTable