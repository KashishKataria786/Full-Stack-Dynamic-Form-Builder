import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteFormComponent = ({ id, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const handleDelete = async () => {
    if (!id) return;

    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/form/delete/${id}`);

      toast.success("Bug deleted successfully");

      onDeleted?.();
      onClose?.();
    } catch (error) {
      console.error("Delete Bug Error:", error);
      toast.error("Failed to delete bug");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        Are you sure you want to delete this bug? This action{" "}
        <span className="font-medium text-red-600">cannot be undone</span>.
      </p>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition disabled:opacity-60"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteFormComponent;