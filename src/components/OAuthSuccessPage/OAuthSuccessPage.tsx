import {useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

export function OAuthSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get("refreshToken")

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem("refreshToken",refreshToken)
            navigate('/');
        } else {
            navigate('/login');
        }
    }, []);

    return <p>Signing you in...</p>;
}
