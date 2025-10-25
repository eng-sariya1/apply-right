import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {PrimeReactProvider} from "primereact/api";
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PrimeReactProvider>
           <BrowserRouter>
               <App/>
           </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>,
)
