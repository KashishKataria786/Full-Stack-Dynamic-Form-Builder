import Dashboard from "./pages/Dashboard.jsx"
import DynamicFormPage from "./pages/DynamicFormPage.jsx"
import Homepage from "./pages/Homepage.jsx"
import Notfound from "./pages/Notfound.jsx"
import SubmissionsPage from "./pages/SubmissionsPage.jsx"
import SubmitPage from "./pages/SubmitPage.jsx"
import {Routes, Route} from 'react-router-dom'

function App() {

  return (
    <>

      <Routes> 
        <Route path='/' element={<Homepage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/create/:id' element={<DynamicFormPage/>}/>       
        <Route path='/form/:key' element={<SubmitPage/>}/>
        <Route path='/form/submissions/:id' element={<SubmissionsPage/>}/>
        <Route path='*' element={<Notfound/>}/>
      </Routes>
    </>
  )
}

export default App
