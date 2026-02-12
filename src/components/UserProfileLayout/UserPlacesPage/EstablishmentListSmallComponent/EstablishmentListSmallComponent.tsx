import {useEffect, useRef, useState} from "react";
import {authApi} from "../../../../api/auth/authApi";
import type {Establishment} from "../../../../api/auth/types";
import "./EstablishmentListSmallComponent.css";
import {useNavigate} from "react-router-dom";

export const EstablishmentListSmallComponent = () => {
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [loading, setLoading] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await authApi.getEstablishmentByUser();
                setEstablishments(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const scroll = (dir: "left" | "right") => {
        if (!listRef.current) return;
        listRef.current.scrollBy({
            left: dir === "left" ? -260 : 260,
            behavior: "smooth",
        });
    };

    if (loading) return <div>Loading...</div>;
    if (!establishments.length) return <div>No establishments yet</div>;

    return (
        <div className="establishment-small-wrapper">
            <button className="arrow left" onClick={() => scroll("left")}>‹</button>

            <div ref={listRef} className="establishment-small-list">
                {establishments.map(e => (
                    <div key={e.id} className="establishment-small-card" onClick={() => navigate("/establishment/" + e.id)}>
                        <div className="establishment-small-image">
                            {e.approved ? (
                                <div className="establishment-small-approved" style={{color: "green"}}>✔</div>
                            ) : (<div className="establishment-small-approved" style={{color: "red"}}>✖</div>)}

                            {e.photoUrls?.length ? (
                                <img src={e.photoUrls[0]} alt={e.name} />
                            ) : (
                                <div className="image-placeholder" />
                            )}
                        </div>

                        <div className="establishment-small-name">
                            <span>{e.name}</span>
                            <div>
                                <p>{e.rating}☆</p>
                                {e.approved && (<p>✓</p>)}
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <button className="arrow right" onClick={() => scroll("right")}>›</button>
        </div>
    );
};
