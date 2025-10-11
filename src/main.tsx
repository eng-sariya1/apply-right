import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {PrimeReactProvider} from "primereact/api";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage.tsx'
import CVBuilder from './pages/CVBuilder.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PrimeReactProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/cv-builder" element={<CVBuilder />} />
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>,
)
