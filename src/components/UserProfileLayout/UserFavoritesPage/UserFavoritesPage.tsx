import {useEffect, useState} from "react";
import "./UserFavoritesPage.css";
import {authApi} from "../../../api/auth/authApi.ts";
import type {UserResponse} from "../../../api/auth/types.ts";

export const UserFavoritesPage = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await authApi.getUserFromToken();
                setUser(res.data);
            } catch (e) {
                console.error(e);
                setError("Failed to load favorites");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const removeFromFavorites = async (id: number) => {
        try {
            setRemovingId(id);
            await authApi.deleteFromFavoriteUser(id);

            setUser(prev =>
                prev
                    ? {
                        ...prev,
                        favoriteEstablishments:
                            prev.favoriteEstablishments.filter(
                                est => est.id !== id
                            ),
                    }
                    : prev
            );
        } catch (e) {
            console.error("Remove failed", e);
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="favorites-center">
                <div className="favorites-loader" />
            </div>
        );
    }

    if (error) {
        return <div className="favorites-error">{error}</div>;
    }

    if (!user || user.favoriteEstablishments.length === 0) {
        return (
            <div className="favorites-empty">
                <img
                    src={import.meta.env.BASE_URL + "/uploads/images/not-implemented-cat.gif"}
                    alt="Empty favorites"
                />
                <h2>No favorites yet</h2>
                <p>Add places you love ❤️</p>
            </div>
        );
    }

    return (
        <div className="favorites-wrapper">
            <h1>Your Favorites</h1>

            <div className="favorites-grid">
                {user.favoriteEstablishments.map(est => (
                    <div
                        key={est.id}
                        className={`favorite-card ${
                            removingId === est.id ? "removing" : ""
                        }`}
                        onClick={() => location.pathname=`/establishment/${est.id}`}
                    >
                        <div
                            className="favorite-image"
                            style={{
                                backgroundImage: `url(${est.photoUrls[0]})`,
                            }}
                        />

                        <div className="favorite-content">
                            <h3>{est.name}</h3>
                            <p className="favorite-address">
                                {est.address}
                            </p>

                            <div className="favorite-meta">
                                <span>⭐ {est.rating}</span>
                                <span>${est.averageCheck}</span>
                            </div>

                            <button
                                className="favorite-remove-btn"
                                onClick={() => removeFromFavorites(est.id)}
                                disabled={removingId === est.id}
                            >
                                {removingId === est.id
                                    ? "Removing..."
                                    : "Remove"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
