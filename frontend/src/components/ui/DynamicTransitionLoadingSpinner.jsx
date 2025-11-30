import { Loader2 } from "lucide-react";
const DynamicTransitionLoadingSpinner = ({ value }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
      <p className="text-xl text-blue-600 font-medium">
        {value ? value : "Loading"}
      </p>
    </div>
  );
};

export default DynamicTransitionLoadingSpinner;
