import "./PulsePage.css";
import {useEffect, useState} from "react";
import type {NewsType} from "../../api/auth/types";
import {authApi} from "../../api/auth/authApi";
import PulseContentPage from "./PulseContentPage/PulseContentPage";
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";

export const PulsePage = () => {
    const [newsType, setNewsType] = useState<NewsType[]>([]);
    const [content, setContent] = useState<NewsType | null>(null);

    useEffect(() => {
        const loadNewsType = async () => {
            const res = await authApi.getAllNewsType();
            setNewsType(res);
        };
        loadNewsType();
    }, []);

    useDocumentTitle("News | Pulse Page");

    return (
        <div className="pulsepage-wrapper">
            <div className="pulsepage-nav-wrapper">
                <h2>What's Happening</h2>

                <div className="pulsepage-nav">
                    <button
                        className={!content ? "active" : ""}
                        onClick={() => setContent(null)}
                    >
                        All News
                    </button>

                    {newsType.map(type => (
                        <button
                            key={type.name}
                            className={content?.name === type.name ? "active" : ""}
                            onClick={() => setContent(type)}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pulsepage-content-wrapper">
                <PulseContentPage type={content} />
            </div>
        </div>
    );
};
