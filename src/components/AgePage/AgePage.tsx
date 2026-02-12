import {useLocation, useNavigate} from "react-router-dom";
import "./AgePage.css"
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";


export function AgePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    const ageAgreeButton = () => {
      localStorage.setItem("ageAgree","true");
      navigate(from, { replace: true });
    }

    const exitSiteButton = () => {
        window.location.href = "https://google.com";
    }
    useDocumentTitle("Age Confirm | Age Page");
    return (
        <div className="agepage-wrapper">
            <div className="agepage-text-button-wrapper">
                <div className="content-restricted-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0
                        1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z">
                        </path>
                        <path d="M12 8v4"></path>
                        <path d="M12 16h.01"></path>
                    </svg>
                    <span>18+ Content Restricted</span>
                </div>
                <h1>Enter the city</h1>
                <p>A curated ecosystem for establishment discovery and social connection.
                    Please verify your age to access Misto features.</p>
                <div className="agepage-buttons-wrapper">
                    <button onClick={ageAgreeButton}>I am 18 or older</button>
                    <button onClick={exitSiteButton}>Exit site</button>
                </div>
                <span>
                    By entering, you agree to our responsible
                    social interaction guidelines for the "MISTO"
                </span>
            </div>
        </div>
    );
}

