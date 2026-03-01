import { AuthProvider } from './AuthContext';
import { Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import CVBuilder from "./pages/CVBuilder.tsx";
import ATSPage from "./pages/ATSPage.tsx";
import TemplatePage from "./pages/TemplatePage.tsx";
import { CVProvider } from "./context/CVContext.tsx";
import Signup from './pages/Signup.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import UsersManagement from './pages/UsersManagement.tsx';
import HomePage from './pages/HomePage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AdminRoute from './components/AdminRoute.tsx';
import AppLayout from './components/AppLayout.tsx';

function App() {
    return (
        <AuthProvider>
            <CVProvider>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                    {/* Requires login (any role) */}
                    <Route path="/home" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
                    <Route path="/templates" element={<ProtectedRoute><AppLayout><TemplatePage /></AppLayout></ProtectedRoute>} />
                    <Route path="/cv-builder" element={<ProtectedRoute><AppLayout><CVBuilder /></AppLayout></ProtectedRoute>} />
                    <Route path="/ats" element={<ProtectedRoute><AppLayout><ATSPage /></AppLayout></ProtectedRoute>} />

                    {/* Admin only */}
                    <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                    <Route path="/dashboard/users" element={<AdminRoute><UsersManagement /></AdminRoute>} />
                </Routes>
            </CVProvider>
        </AuthProvider>
    );
}

export default App;
