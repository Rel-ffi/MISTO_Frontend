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

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        fullName?: string;
        general?: string;
    }>({});

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (fullName.length > 40) {
            newErrors.fullName = "Full name must be max 40 characters";
        } else  if (fullName.length < 4) {
            newErrors.fullName = "Full name must be at leats 4 characters"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await authApi.register({ email, fullName, password });
            navigate('/auth/login');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setErrors({
                    general:
                        err.response?.data?.message ??
                        "User with this email already exists",
                });
            } else {
                setErrors({ general: "Unexpected error" });
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
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        required
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        required
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div>
                    <label>Full name</label>
                    <input
                        type="text"
                        value={fullName}
                        placeholder="FullName"
                        onChange={(e) => {
                            setFullName(e.target.value);
                            setErrors((prev) => ({ ...prev, fullName: undefined }));
                        }}
                        required
                    />
                    {errors.fullName && <p className="error">{errors.fullName}</p>}
                </div>
                <button type="submit">Register</button>
                {errors.general && <p className="error">{errors.general}</p>}
            </form>
        </div>
    );
}