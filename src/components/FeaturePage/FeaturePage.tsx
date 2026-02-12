import {useNavigate} from "react-router-dom";
import "./FeaturePage.css"
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";


export function FeaturePage() {
    const navigate = useNavigate();
    useDocumentTitle("Feature's | Feature Page");

    return (
        <div className="cmd-wrapper">
            <h2>Feature Center</h2>
            <div className="cmd-feature-wrapper" >
                <div className="cmd-feature-card" onClick={() => navigate("/smart-search")}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21 21-4.34-4.34"></path>
                            <circle cx="11" cy="11" r="8"></circle>
                        </svg>
                    </div>
                    <div>
                        <h3>Smart Search</h3>
                        <span>Global search with intelligent predictive typing.</span>
                    </div>
                </div>
                <div className="cmd-feature-card" onClick={() => navigate("/pulse")}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                    </div>
                    <div>
                        <h3>Pulse</h3>
                        <span>Instant access to News, Promotions, Events</span>
                    </div>
                </div>
            </div>
        </div>
    );
}