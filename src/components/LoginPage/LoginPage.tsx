import {useState} from 'react';
import {authApi} from '../../api/auth/authApi';
import {NavLink, useNavigate} from 'react-router-dom';
import "./LoginPage.css"
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [documentTitle,setDocumentTitle] = useState("Login")

    useDocumentTitle(`${documentTitle} | Auth Page`);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await authApi.login({ email, password });

            if (response.data.requiresOtp) {
                navigate('/auth/verify-otp', { state: { email } });
            } else {
                const token = response.data.accessToken;
                const refreshToken = response.data.refreshToken
                localStorage.setItem('accessToken', token);
                localStorage.setItem("refreshToken",refreshToken)
                navigate('/');
            }

        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-wrapper">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                     strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
            <form id="login-form" onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <NavLink to="/auth/register" onClick={() => setDocumentTitle("Register")}>Doesn't have account?</NavLink>
        </div>
    );
}
