import { AlertTriangle } from "lucide-react"

const DynamicErrorComponent = ({message}) => {
  return (
    <div className="flex justify-center items-start pt-20 min-h-screen bg-gray-50">
                  <div className="p-10 bg-white rounded-xl shadow-xl max-w-lg w-full text-center border-t-4 border-red-500">
                      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Form Access Error</h2>
                      <p className="text-gray-600">{message}</p>
                  </div>
              </div>
  )
}

export default DynamicErrorComponent
