import {NavLink, useNavigate} from "react-router-dom";
import {authApi} from "../../api/auth/authApi.ts";
import {useEffect, useState} from "react";
import type {UserResponse} from "../../api/auth/types.ts";
import "./HeaderComponent.css"
import {ThemeToggle} from "../ThemeComponents/ThemeToggle.tsx";

export const HeaderComponent = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserResponse | null>(null);

    const handleExitButton = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        navigate("/");
    }

    useEffect(() => {
        const fetchUser = async () => {
            if(!localStorage.getItem("accessToken")) {
                return;
            }
            try {
                const response = await authApi.getUserFromToken();
                setUser(response.data);
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };

        fetchUser();
    }, []);

    const isAuth = !!localStorage.getItem("accessToken");

    return (
        <div className="header-wrapper">
            <h2 onClick={() => navigate("/")}>MISTO</h2>
            <div className="header-navlink-wrapper">
                <NavLink to="/features">FEATURES</NavLink>
                <NavLink to="/business">BUSINESS</NavLink>
            </div>
            <div className="header-buttons-wrapper">
                <ThemeToggle/>
                {isAuth ? (
                    <div className="profile-wrapper">
                        <div className="profile-trigger">
                            <img src={user?.avatarUrl} alt="avatar"/>
                            <div className="profile-info">
                                <h3>{user?.fullName}</h3>
                                <p>{user?.email}</p>
                            </div>
                        </div>

                        <ul className="header-menu">
                            {user?.isAdmin && (
                                <li>
                                    <NavLink to="/adminpage">Admin page</NavLink>
                                </li>
                            )}
                            <li><NavLink to="/settings/profile">Settings</NavLink></li>
                            <li>
                                <button onClick={handleExitButton}>Exit</button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <button onClick={() => navigate("/auth")}>Login</button>
                )}
            </div>
        </div>
    );
}