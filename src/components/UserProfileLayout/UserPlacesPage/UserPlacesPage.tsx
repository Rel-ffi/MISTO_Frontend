import "./UserPlacesPage.css"
import {Outlet, useNavigate} from "react-router-dom";
import {useState} from "react";
import {AddEstablishmentPage} from "./AddEstablishmentPage/AddEstablishmentPage.tsx";

export const UserPlacesPage = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="userplaces-wrapper">
            <div className="userplaces-buttons-wrapper">
                <div className="userplaces-button" onClick={() => setOpen(true)}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round"><path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                        </svg>
                    </div>
                    <span>Add establishment</span>
                    <p>Owners only</p>
                </div>
                {open && (<AddEstablishmentPage onClose={() => setOpen(false)}/>)}
                <div className="userplaces-button" onClick={() => navigate("establishment")}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round"><path d="M15 18h-5"></path>
                            <path d="M18 14h-8"></path>
                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2
                            2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"></path>
                            <rect width="8" height="4" x="10" y="6" rx="1"></rect>
                        </svg>
                    </div>
                    <span>Your establishments</span>
                    <p>Checkout you establishments!</p>
                </div>
            </div>
                <div className="userplacesnews-placesnews-wrapper">
                    <Outlet/>
                </div>
        </div>
    );
};
