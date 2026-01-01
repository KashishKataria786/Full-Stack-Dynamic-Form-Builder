import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import DynamicTransitionLoadingSpinner from "./components/ui/DynamicTransitionLoadingSpinner.jsx";
const Homepage = lazy(() => import("./pages/Homepage.jsx"));
const DynamicFormPage = lazy(() => import("./pages/DynamicFormPage.jsx"));
const Notfound = lazy(() => import("./pages/Notfound.jsx"));
const SubmissionsPage = lazy(() => import("./pages/SubmissionsPage.jsx"));
const SubmitPage = lazy(() => import("./pages/SubmitPage.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

function App() {
  return (
    <>
      <Suspense fallback={<DynamicTransitionLoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create/:id" element={<DynamicFormPage />} />
          <Route path="/edit/:id" element={<DynamicFormPage />} />
          <Route path="/form/:key" element={<SubmitPage />} />
          <Route path="/form/submissions/:id" element={<SubmissionsPage />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
