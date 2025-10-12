import './App.css';
import { Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import CVBuilder from "./pages/CVBuilder.tsx";



function App() {
  return (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cv-builder" element={<CVBuilder />} />
        </Routes>
  )
}

export default App;