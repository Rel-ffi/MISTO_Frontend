import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {authApi} from "../../api/auth/authApi.ts";
import "./RegisterPage.css"
import axios from "axios";


export function RegisterPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await authApi.register({ email, fullName, password });
            navigate('/auth/login');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ??
                    "User with this email already exists"
                );
            } else {
                setError("Unexpected error");
            }
        }
    };

    return (
        <div className="register-wrapper">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                     strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
            <form id="register-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    value={fullName}
                    placeholder="FullName"
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}