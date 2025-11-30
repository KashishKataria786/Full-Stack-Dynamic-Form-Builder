import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DynamicTransitionLoadingSpinner from "../components/ui/DynamicTransitionLoadingSpinner.jsx";
import DynamicErrorComponent from "../components/ui/DynamicErrorComponent.jsx";
import { fetchAllSubmittionsById } from "../api/Submissions.js";

const SubmissionsPage = () => {
  const { id } = useParams();
  const {
    data: formResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["form", id],
    queryFn: fetchAllSubmittionsById,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <DynamicTransitionLoadingSpinner value={"Getting your form ready..."} />
    );
  }
  const form = formResponse;

  if (isError || !id || !form) {
    const message =
      !id || !form
        ? `Form with ${id} "${id}" was not found.`
        : error?.message || "A network error occurred.";

    return <DynamicErrorComponent message={message} />;
  }

  return (
    <div>
      Submissinos
      {JSON.stringify(form, null, 2)}
    </div>
  );
};

export default SubmissionsPage;
