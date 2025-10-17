import { Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import CVBuilder from "./pages/CVBuilder.tsx";
import ATSPage from "./pages/ATSPage.tsx";
import { CVProvider } from "./context/CVContext.tsx";

function App() {
  return (
    <CVProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cv-builder" element={<CVBuilder />} />
        <Route path="/ats" element={<ATSPage />} />
      </Routes>
    </CVProvider>
  )
}

export default App;