import "./NotImplemented.css";
import React from "react";
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";

interface NotImplementedProps {
    type?: "notImplemented" | "404" | string;
}

export const NotImplemented: React.FC<NotImplementedProps> = ({ type = "notImplemented" }) => {
    const is404 = type === "404";
    if(!is404) {
        useDocumentTitle("Not Implemented | Cat No Implemented Page");
    }
    else {
        useDocumentTitle("404 | Not Found Page");
    }

    return (
        <div className="not-implemented-wrapper">

            <div className="cat-container">
                <img
                    src={import.meta.env.VITE_BASEURL_BACKEND + "/uploads/images/not-implemented-cat.gif"}
                    alt="Waving Cat"
                    className="waving-cat"
                />
            </div>

            <h2 className="not-implemented-text">
                {is404
                    ? "Oops! Page not found."
                    : "This feature is not yet implemented. "}
                {!is404 && <span>Stay tuned!</span>}
            </h2>

            {!is404 && (
                <p className="sub-text">
                    We’re working hard to bring you this feature. In the meantime, enjoy the cat!
                </p>
            )}
        </div>
    );
};



