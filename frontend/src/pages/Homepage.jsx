import Layout from "../components/Layout/Layout.jsx";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <Layout
      id="homepage"
      className="py-20 px-4 md:px-8 bg-gray-50 bg-linear-to-br from-white via-gray-50 to-gray-100 overflow-hidden min-h-screen"
    >
      <header className="flex flex-col justify-center items-center h-screen text-center ">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 mb-3 transform scale-y-105">
          The Ultimate Low-Code Platform
        </p>

        <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 leading-none tracking-tight drop-shadow-lg">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-cyan-500">
            DynamicForm Pro
          </span>
          <br className="hidden md:block" />
          Build Apps, Not Forms.
        </h1>

        <p className="mt-8 text-xl text-gray-600 max-w-4xl mx-auto font-medium">
          The ultimate **low-code/no-code form builder** for React—design,
          integrate, and deploy complex data collection workflows in minutes,
          not weeks.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="py-3 px-8 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-300 text-lg transform hover:scale-[1.03]"
          >
            Go To Dashboard
          </button>
        </div>
      </header>
    </Layout>
  );
};

export default Homepage;
