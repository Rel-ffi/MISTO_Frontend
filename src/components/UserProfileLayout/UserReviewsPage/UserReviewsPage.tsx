import {useCallback, useEffect, useState} from "react";
import {authApi} from "../../../api/auth/authApi.ts";
import type {EstablishmentDetails, Review, UserResponse} from "../../../api/auth/types.ts";
import "./UserReviewsPage.css";

const UserReviewsPage = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [establishments, setEstablishments] = useState<{ [key: number]: EstablishmentDetails }>({});
    const [loading, setLoading] = useState(true);
    const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
    const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await authApi.getUserFromToken();
                setUser(res.data);
            } catch (e) {
                console.error("Failed to load user", e);
            }
        };

        loadUser();
    }, []);

    const loadUserReviews = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const userReviews = await authApi.getReviewsByUserId(user.id);
            setReviews(userReviews);

            const establishmentIds = [...new Set(userReviews.map(review => review.establishmentId))];

            const establishmentPromises = establishmentIds.map(async (id) => {
                if (!establishments[id]) {
                    try {
                        const establishment = await authApi.getEstablishmentById(id);
                        return { id, data: establishment };
                    } catch (e) {
                        console.error(`Failed to load establishment ${id}:`, e);
                        return null;
                    }
                }
                return null;
            });

            const establishmentResults = await Promise.all(establishmentPromises);
            const newEstablishments = { ...establishments };

            establishmentResults.forEach(result => {
                if (result) {
                    newEstablishments[result.id] = result.data;
                }
            });

            setEstablishments(newEstablishments);
        } catch (e) {
            console.error("Failed to load reviews", e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadUserReviews();
    }, [loadUserReviews]);

    const toggleExpand = (id: number) => {
        setExpandedReviewId(expandedReviewId === id ? null : id);
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

        try {
            setDeletingReviewId(reviewId);
            await authApi.deleteUserReviewById(reviewId);

            setReviews(prev => prev.filter(review => review.id !== reviewId));

            const successMessage = document.createElement("div");
            successMessage.className = "delete-success-message";
            successMessage.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Review deleted successfully</span>
            `;
            document.body.appendChild(successMessage);

            setTimeout(() => {
                successMessage.classList.add("show");
                setTimeout(() => {
                    successMessage.classList.remove("show");
                    setTimeout(() => {
                        document.body.removeChild(successMessage);
                    }, 300);
                }, 3000);
            }, 100);
        } catch (error: any) {
            console.error("Failed to delete review:", error);

            let errorMessage = "Failed to delete review";
            if (error.response?.status === 403) {
                errorMessage = "You don't have permission to delete this review";
            } else if (error.response?.status === 404) {
                errorMessage = "Review not found";
            }

            const errorDiv = document.createElement("div");
            errorDiv.className = "delete-error-message";
            errorDiv.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>${errorMessage}</span>
            `;
            document.body.appendChild(errorDiv);

            setTimeout(() => {
                errorDiv.classList.add("show");
                setTimeout(() => {
                    errorDiv.classList.remove("show");
                    setTimeout(() => {
                        document.body.removeChild(errorDiv);
                    }, 300);
                }, 4000);
            }, 100);
        } finally {
            setDeletingReviewId(null);
        }
    };

    const refreshReviews = () => {
        loadUserReviews();
    };

    if (loading && reviews.length === 0) {
        return (
            <div className="userReviews-wrapper">
                <div className="reviews-header">
                    <h2>My Reviews</h2>
                    <div className="reviews-stats">
                        <span className="total-reviews">0 reviews</span>
                    </div>
                </div>
                <div className="reviews-container loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="userReviews-wrapper">
            <div className="reviews-header">
                <div className="header-left">
                    <h2>My Reviews</h2>
                    <button
                        className="refresh-btn"
                        onClick={refreshReviews}
                        disabled={loading}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M23 4v6h-6"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                        Refresh
                    </button>
                </div>
                <div className="reviews-stats">
                    <span className="total-reviews">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
                    {reviews.length > 0 && (
                        <span className="average-rating">
                            Avg. rating: {(reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)} ★
                        </span>
                    )}
                </div>
            </div>

            <div className="reviews-container">
                {reviews.length === 0 && !loading && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                            </svg>
                        </div>
                        <h3>No reviews yet</h3>
                        <p>You haven't written any reviews. Share your experience with places you've visited!</p>
                        <button
                            className="explore-button"
                            onClick={() => window.location.href = '/smart-search'}
                        >
                            Explore Places
                        </button>
                    </div>
                )}

                {reviews.map(review => {
                    const establishment = establishments[review.establishmentId];
                    const isDeleting = deletingReviewId === review.id;

                    return (
                        <div
                            key={review.id}
                            className={`review-card ${expandedReviewId === review.id ? 'expanded' : ''} ${isDeleting ? 'deleting' : ''}`}
                        >
                            <div
                                className="review-card-content"
                                onClick={() => toggleExpand(review.id)}
                            >
                                {establishment && (
                                    <div className="establishment-info"
                                         onClick={() => window.location.href=`/establishment/${establishment.id}`}
                                    >
                                        <img
                                            src={establishment.photoUrls?.[0] || '/placeholder.jpg'}
                                            alt={establishment.name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder.jpg';
                                            }}
                                        />
                                        <div className="establishment-details">
                                            <h4>{establishment.name}</h4>
                                            <p>{establishment.address}</p>
                                            <div className="establishment-rating">
                                                <span className="establishment-rating-star">★</span>
                                                <span>{establishment.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="review-header">
                                    <div className="rating-badge">
                                        <span className="rating-star">★</span>
                                        <span>{review.rating?.toFixed(1) || "N/A"}</span>
                                    </div>
                                    <span className="date">
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <p className="text">{review.text}</p>

                                <div className="review-footer">
                                    {review.checkAmount > 0 && (
                                        <div className="check-amount">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                            </svg>
                                            ${review.checkAmount.toFixed(2)}
                                        </div>
                                    )}
                                    {review.complaint && (
                                        <div className="complaint">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                                <line x1="12" y1="9" x2="12" y2="13"/>
                                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                                            </svg>
                                            Complaint
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="review-actions">
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteReview(review.id);
                                    }}
                                    disabled={isDeleting || loading}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="spinner-mini"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                <line x1="10" y1="11" x2="10" y2="17"/>
                                                <line x1="14" y1="11" x2="14" y2="17"/>
                                            </svg>
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserReviewsPage;