import "./PulsePage.css";
import {useEffect, useRef, useState} from "react";
import type {NewsType} from "../../api/auth/types";
import {authApi} from "../../api/auth/authApi";
import PulseContentPage from "./PulseContentPage/PulseContentPage";
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";

export const PulsePage = () => {
    const [newsType, setNewsType] = useState<NewsType[]>([]);
    const [content, setContent] = useState<NewsType | null>(null);

    const newsTypeRef = useRef<NewsType[] | null>(null);

    useEffect(() => {
        if (newsTypeRef.current) {
            setNewsType(newsTypeRef.current);
            return;
        }

        const loadNewsType = async () => {
            try {
                const res = await authApi.getAllNewsType();
                setNewsType(res);
                newsTypeRef.current = res;
            } catch (e) {
                console.error("Failed to load news types", e);
            }
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
                        type="button"
                        className={!content ? "active" : ""}
                        onClick={() => setContent(null)}
                    >
                        All News
                    </button>

                    {newsType.map(type => (
                        <button
                            key={type.name}
                            type="button"
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