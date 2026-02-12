import {NavLink, Outlet} from "react-router-dom";
import "./UserProfileLayout.css"
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";
import {useState} from "react";

export const UserProfileLayout = () => {
    const [documentTitle,setDocumentTitle] = useState("Profile")


    useDocumentTitle(`${documentTitle} | Settings`);
    return (
        <div className="userprofile-wrapper">
            <div className="userprofile-text-navlink-wrapper">
                <h2>User Dashboard</h2>

                <div className="userprofile-navlink-layout-wrapper">
                    <div className="userprofile-navlink-wrapper">

                        <NavLink
                            to="profile"
                            className={({ isActive }) =>
                                "userprofile-navlink" + (isActive ? " active" : "")
                            }
                            onClick={() => setDocumentTitle("Profile")}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Profile</span>
                        </NavLink>

                        <NavLink
                            to="favorites"
                            className={({ isActive }) =>
                                "userprofile-navlink" + (isActive ? " active" : "")
                            }
                            onClick={() => setDocumentTitle("Favorites")}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0
                                2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                            </svg>
                            <span>Favorites</span>
                        </NavLink>

                        <NavLink
                            to="reviews"
                            className={({ isActive }) =>
                                "userprofile-navlink" + (isActive ? " active" : "")
                            }
                            onClick={() => setDocumentTitle("Reviews")}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2
                                21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>Reviews</span>
                        </NavLink>

                        <NavLink
                            to="places"
                            className={({ isActive }) =>
                                "userprofile-navlink" + (isActive ? " active" : "")
                            }
                            onClick={() => setDocumentTitle("Places")}>
                            <svg data-loki-id="TxgtlzKzyitY" xmlns="http://www.w3.org/2000/svg"
                                 width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"></path>
                                <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451
                                 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549
                                 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895
                                 4.192a2.5 2.5 0 0 1-3.774 3.244"></path>
                                <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"></path>
                            </svg>
                            <span>My Places</span>
                        </NavLink>

                    </div>

                    <div className="userprofilelayout-wrapper">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

