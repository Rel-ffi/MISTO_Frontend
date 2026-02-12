import {Navigate} from "react-router-dom";
import {type JSX} from "react";

export const AgeGuard = ({ children }: { children: JSX.Element }) => {
    const ageAgree = localStorage.getItem("ageAgree");

    if (!ageAgree) {
        return <Navigate to="/agePage" replace state={{ from: location.pathname }}/>;
    }

    return children;
};
