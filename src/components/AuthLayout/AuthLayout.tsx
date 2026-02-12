import {Outlet, useNavigate} from "react-router-dom";
import "./AuthLayout.css"
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";
import {useState} from "react";

export function AuthLayout() {
    const [documentTitle,setDocumentTitle] = useState("Auth")
    const navigate = useNavigate();
    const ctnWithEmailButton = () => {
        navigate("/auth/login")
        setDocumentTitle("Login")
    }
    const ctnWithGoogle = () => {
        window.location.href = `${import.meta.env.VITE_BASEURL_BACKEND}/oauth2/authorization/google`;
    };

    useDocumentTitle(`${documentTitle} | Auth Page`);

    const ctnWithFacebook = () => {
        {/*Doesn't have a facebook account to do this. So it's just a stub */}
        location.href="/facebook"
    }
    return (
        <div className="auth-layout">
            <div className="authl-text-buttons-wrapper">
                <h2>Seamless Identification</h2>
                <span>
                        Frictionless entry points designed for modern users.
                        Connect instantly via your preferred digital identity provider.
                        </span>
                <div className="authl-buttons-wrapper">
                    <button onClick={ctnWithEmailButton}>
                        <svg data-loki-id="RgNkxnLjswBG"
                             xmlns="http://www.w3.org/2000/svg"
                             width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        </svg>
                        Continue with Email
                    </button>
                    <button onClick={ctnWithGoogle}>
                        <svg data-loki-id="SvBQqHHXPMlV" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                            <path d="M12 18h.01"></path></svg>
                        Continue with Google Account
                    </button>
                    <button onClick={ctnWithFacebook}>
                        <svg data-loki-id="IKdoPzbKBDpL" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                            <path d="M2 12h20"></path></svg>
                        Continue with Facebook
                    </button>
                </div>
            </div>

            <div className="auth-right">
                {location.pathname === "/auth" ? (
                    <div className="login-wrapper">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div></div>
                        <div></div>
                        <button onClick={ctnWithEmailButton}>Login</button>
                    </div>
                ):(
                    <Outlet />
                )}
            </div>
        </div>
    );
}
