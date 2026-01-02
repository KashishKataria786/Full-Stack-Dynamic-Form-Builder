import { useEffect, useState, useMemo , lazy} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DynamicTransitionLoadingSpinner from "../components/ui/DynamicTransitionLoadingSpinner.jsx";
import { toast } from "react-toastify";


const DynamicErrorComponent = lazy(()=>import('../components/ui/DynamicErrorComponent.jsx'));

const SubmissionsPage = () => {
  const { id } = useParams();
  const [fields, setFields] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  
  const normalizeSubmission = (submissionArray) => {
    if(submissionArray.length===0)return [];
    return submissionArray.reduce((acc, item) => {
      const key = item.label || item.name;
      acc[key] = item.value;
      return acc;
    }, {});
  };

  const filteredSubmissions = useMemo(() => {
    if (!query) return submissions;
    const q = query.toLowerCase();
    return submissions.filter((submission) => {
      const row = normalizeSubmission(submission);
      return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
    });
  }, [query, submissions]);

  const exportCSV = () => {
    if (!fields.length) return;
    const headers = fields;
    const rows = submissions.map((submission) => {
      const row = normalizeSubmission(submission);
      return headers.map((h) => (row[h] !== undefined ? `"${String(row[h]).replace(/"/g, '""')}"` : '""')).join(',');
    });
    const csvContent = [headers.map(h => `"${h.replace(/"/g,'""')}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id || 'submissions'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJSON = () => {
    navigator.clipboard?.writeText(JSON.stringify({ fields, submissions }, null, 2));
    toast.info('Submissions JSON copied to clipboard');
  };

  const openModal = (submission) => {
    setModalData(submission);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fieldsRes, submissionsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/submissions/get-schema/${id}`
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/submissions/submissions/${id}`
          ),
        ]);

        setFields(fieldsRes.data.data || []);
        setSubmissions(submissionsRes.data.data.data || []);
      } catch (err) {
        console.error(err);
        setError(true);
        toast.error("Error retrieving submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <DynamicTransitionLoadingSpinner />;
  if (error) return <DynamicErrorComponent />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Form Submissions</h1>
        <p className="text-sm text-gray-500">Review and export collected responses.</p>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-1/2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search submissions..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={copyJSON} className="px-3 py-2 bg-gray-50 border rounded-md text-sm hover:bg-gray-100">Copy JSON</button>
            <button onClick={exportCSV} className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Export CSV</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {/* Table for md+ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                {fields.map((fieldLabel) => (
                  <th key={fieldLabel} className="sticky top-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500">{fieldLabel}</th>
                ))}
                <th className="sticky top-0 z-10 px-4 py-3" />
              </tr>
            </thead>

            <tbody className="bg-white">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 2} className="p-10 text-center text-gray-400">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg font-medium mb-1">No submissions found</h3>
                      <p className="text-sm">There are no submissions for this form yet, or your search returned no results.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission, rowIndex) => {
                  const rowData = normalizeSubmission(submission);
                  return (
                    <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50`}> 
                      <td className="px-4 py-3 align-top text-sm text-gray-600">{rowIndex + 1}</td>
                      {fields.map((fieldLabel) => (
                        <td key={fieldLabel} className="px-4 py-3 align-top text-sm text-gray-700">{rowData[fieldLabel] !== undefined && rowData[fieldLabel] !== "" ? String(rowData[fieldLabel]) : '—'}</td>
                      ))}
                      <td className="px-4 py-3 align-top text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal(submission)} className="text-sm text-indigo-600 hover:underline">View</button>
                          <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(normalizeSubmission(submission), null, 2)); toast.info('Row copied'); }} className="text-sm text-gray-600 hover:underline">Copy</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Cards for small screens */}
        <div className="block md:hidden p-4 space-y-3">
          {filteredSubmissions.length === 0 ? (
            <div className="p-6 text-center text-gray-400 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-medium mb-1">No submissions found</h3>
              <p className="text-sm">There are no submissions for this form yet, or your search returned no results.</p>
            </div>
          ) : (
            filteredSubmissions.map((submission, i) => {
              const rowData = normalizeSubmission(submission);
              return (
                <div key={i} className="p-4 bg-white border rounded-xl shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">Submission #{i + 1}</h4>
                      <div className="mt-2 text-xs text-gray-600 space-y-1">

                export default SubmissionsPage;
                        {fields.slice(0, 5).map((f) => (
                          <div key={f} className="flex gap-2">
                            <div className="font-medium text-gray-700 w-28">{f}:</div>
                            <div className="flex-1">{rowData[f] !== undefined && rowData[f] !== '' ? String(rowData[f]) : '—'}</div>
                          </div>
                        ))}
                        {fields.length > 5 && <div className="text-xs text-gray-400 mt-2">+{fields.length - 5} more fields</div>}
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0 flex flex-col gap-2">
                      <button onClick={() => openModal(submission)} className="text-indigo-600 text-sm">View</button>
                      <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(normalizeSubmission(submission), null, 2)); toast.info('Row copied'); }} className="text-sm text-gray-600">Copy</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;
