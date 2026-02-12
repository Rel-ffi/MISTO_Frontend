import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "./components/ThemeComponents/ThemeContext.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </BrowserRouter>
)
