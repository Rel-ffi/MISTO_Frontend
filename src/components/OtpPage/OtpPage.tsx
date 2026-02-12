import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {authApi} from "../../api/auth/authApi";
import {OTPInput} from "../OtpInput/OtpInput";

export function OtpPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [resending, setResending] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const email: string | undefined = location.state?.email;

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer(t => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const submitOtp = async (otpCode: string) => {
        if (!email) {
            setError("Email not found");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await authApi.verifyOtp({ email, code: otpCode });
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            navigate("/");


            navigate("/");
        } catch (err: any) {
            setError(err.response?.data || "Invalid OTP code");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        if (!email) return;

        try {
            setResending(true);
            setError("");

            await authApi.resendOtp(email);
            setTimer(30);
        } catch (err: any) {
            setError(err.response?.data || "Failed to resend code");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="otp-page-wrapper">
            <div className="otp-card">
                <div className="otp-icon">✓</div>

                <h2>Verify Email</h2>
                <p>Enter the 6-digit code sent to <b>{email}</b></p>

                <OTPInput length={6} onComplete={submitOtp} />

                {timer > 0 ? (
                    <span className="otp-timer">
                        Resend in {timer}s
                    </span>
                ) : (
                    <button
                        className="otp-resend"
                        onClick={resendOtp}
                        disabled={resending}
                    >
                        {resending ? "Sending..." : "Resend code"}
                    </button>
                )}

                {loading && <span className="otp-timer">Verifying...</span>}
            </div>
        </div>
    );
}
