import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {authApi} from "../../api/auth/authApi";
import type {EstablishmentDetails, UserResponse} from "../../api/auth/types";
import "./EstablishmentDetailsComponent.css"
import {AddNewsPage} from "../AddNewsPage/AddNewsPage.tsx";
import {ReviewModal} from "../ReviewModal/ReviewModal.tsx";
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";

export default function EstablishmentDetailsComponent() {
    const { id } = useParams<{ id: string }>();
    const [establishment, setEstablishment] = useState<EstablishmentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [user,setUser] = useState<UserResponse | null>(null);
    const navigate = useNavigate();
    const [reviewModalOpen, setReviewModalOpen] = useState(false); // Переименовано
    const [newsModalOpen, setNewsModalOpen] = useState(false);// Переименовано

    const isFavorite = user?.favoriteEstablishments?.some(
        e => e.id === establishment?.id
    );

    const toggleFavorite = async (establishmentId: number) => {
        try {
            if (!user) return;

            if (isFavorite) {
                await authApi.deleteFromFavoriteUser(establishmentId);
            } else {
                await authApi.addToFavoriteUser(establishmentId);
            }

            await userLoad();
        } catch (e) {
            console.error("Failed to toggle favorite", e);
        }
    };


    useEffect(() => {
        if (!viewerOpen) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setViewerOpen(false);
            if (e.key === "ArrowRight")
                setCurrentIndex(i =>
                    i === establishment!.photoUrls.length - 1 ? 0 : i + 1
                );
            if (e.key === "ArrowLeft")
                setCurrentIndex(i =>
                    i === 0 ? establishment!.photoUrls.length - 1 : i - 1
                );
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [viewerOpen]);

    const userLoad = async () => {
        try {
            const data = await authApi.getUserFromToken()
            setUser(data.data)
        }catch (e) {
            console.log(e);
        }
    }

    const refreshReviews = async () => {
        if (!id) return;
        try {
            const data = await authApi.getEstablishmentById(Number(id));
            setEstablishment(data);
        } catch (e) {
            console.error("Failed to refresh establishment:", e);
        }
    };

    const addViewToEstablishment = async (id:number) => {
        await authApi.addViewToEstablishment(id);
    }

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                const data = await authApi.getEstablishmentById(Number(id));
                setEstablishment(data);
            } catch (e) {
                console.error(e);
                setError("Failed to load establishment");
            } finally {
                setLoading(false);
            }
        };

        load();
        userLoad();
        addViewToEstablishment(Number(id));

    }, [id]);

    useDocumentTitle(
        establishment
            ? `${establishment.name} | Establishments`
            : "Loading..."
    );

    if (loading) return <div className="establishmentDetails-loading">Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!establishment) return <div>Not found</div>;

    return (
        <div className="establishmentDetails-wrapper">
            <div className="establishmentDetails">
                <div className="establishmentDetailsImages"
                     style={{ backgroundImage: `url(${establishment.photoUrls[0]})` }}
                     onClick={() => {
                         setCurrentIndex(0);
                         setViewerOpen(true);
                     }}>
                    <div>
                        <h2>{establishment.name}</h2>
                        <div className="establishmentDetailsTags-wrapper">
                            <div>Rating:  {establishment.rating}★</div>
                            {establishment.tags.map(tag => (
                                <div
                                    key={tag.id}
                                    className="establishmentDetails-tag"
                                >
                                    <span>{tag.name}</span>
                                </div>
                            ))}

                            {establishment.photoUrls.length > 1 && (
                                <button className="openGalleryBtn" onClick={() => {
                                    setCurrentIndex(0);
                                    setViewerOpen(true)
                                }}>
                                    +{establishment.photoUrls.length -1} photos
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="establishmentDetailsTextButtons-wrapper">
                    <div className="establishmentDetailsTextButtons">
                        <h3>About</h3>
                        <p>{establishment.description}</p>
                        <div className="establishmentDetailsReviews-wrapper">
                            <div className="establishmentDetailsReviews-header">
                                <h4>REVIEWS ({establishment.reviews.length})</h4>
                                {establishment.reviews.length > 0 && (
                                    <div className="reviewsStats">
                                        <span className="averageRating">
                                            Average: {establishment.rating.toFixed(1)} ★
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="reviewsContainer">
                                {establishment.reviews.length === 0 ? (
                                    <div className="noReviews">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                        </svg>
                                        <p>No reviews yet</p>
                                        <button
                                            className="leaveFirstReviewBtn"
                                            onClick={() => setReviewModalOpen(true)}
                                        >
                                            Be the first to review
                                        </button>
                                    </div>
                                ) : (
                                    establishment.reviews.map(r => (
                                        <div key={r.id} className="establishmentReview">
                                            <div className="reviewHeader">
                                                <div className="reviewAuthor">
                                                    <img src={r.author.avatarUrl} alt={r.author.fullName}/>
                                                    <div className="authorInfo">
                                                        <h5>{r.author.fullName}</h5>
                                                        <span className="reviewDate">
                                                            {new Date(r.createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="reviewRight">
                                                    {!r.complaint && r.rating && (
                                                        <div className="reviewRating">
                                                            {Array.from({ length: 5 }).map((_, index) => (
                                                                <span
                                                                    key={index}
                                                                    className={`ratingStar ${index < r.rating! ? 'filled' : ''}`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                            <span className="ratingNumber">{r.rating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                    {r.complaint && (
                                                        <div className="complaintBadge">
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

                                            <p className="reviewText">{r.text}</p>

                                            {r.checkAmount > 0 && (
                                                <div className="reviewCheck">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                                    </svg>
                                                    Check: ${r.checkAmount.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {establishment.reviews.length > 0 && (
                                <div>
                                    <button
                                        className="addReviewBtn"
                                        onClick={() => setReviewModalOpen(true)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 5v14M5 12h14"/>
                                        </svg>
                                        Add Review
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="establishmentDetails-direct-owner"
                        onClick={() => location.href=`/direct/${establishment?.owner.id}`}>
                            <div>
                                <img src={establishment.owner.photoUrl} alt="Owner"/>
                                <div>
                                    <h5>{establishment.owner.username}</h5>
                                    <p>{establishment.owner.email}</p>
                                </div>
                            </div>
                        </div>
                        {(establishment.owner?.id === user?.id || user?.isAdmin) && (
                        <div className="establishmentDetailsViews">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                width="16"
                                height="16"
                                style={{ marginRight: "4px" }}
                            >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        <p>{establishment.views}</p>
                    </div>
                    )}
                    </div>
                    <div className="establishmentDetailsInfo-wrapper">
                        <div className="establishmentDetailsInfo">
                            <div>
                                <span>ADD TO FAVORITE: </span>
                                <button
                                    className={`establishmentLikeButton ${isFavorite ? "liked" : ""}`}
                                    onClick={() => toggleFavorite(establishment.id)}
                                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    ❤
                                </button>

                            </div>
                            <div>
                                <span>LOCATION</span>
                                <p>{establishment.address}</p>
                            </div>
                            <div>
                                <span>AVERAGE CHECK</span>
                                <p>{establishment.averageCheck}</p>
                            </div>
                            {!establishment.approved && (
                                <div className="establishmentDetailsInfo-approvment">
                                    <div>
                                        <span>APPROVED STATUS</span>
                                        <p>Already waiting for approvement</p>
                                    </div>
                                    {user?.isAdmin && (
                                        <button
                                            onClick={() => navigate("/adminpage")}
                                            className="establishmentDetailsInfo-adminButton"
                                        >
                                            Admin Page
                                        </button>
                                    )}
                                </div>
                            )}

                            {establishment.approved && establishment.owner.id == user?.id && (
                                <div className="establishmentDetailsInfo-approvment">
                                    <div>
                                        <span>APPROVED STATUS</span>
                                        <p>Already approved</p>
                                    </div>
                                    <button
                                        className="establishmentDetailsInfo-adminButton"
                                        onClick={() => setNewsModalOpen(true)}
                                    >
                                        Add News
                                    </button>
                                </div>
                            )}
                            {establishment.approved && user?.isAdmin && (
                                <div className="establishmentDetailsInfo-adminDelete">
                                    <div>
                                        <span>DELETE</span>
                                        <p>This action can't be undone!</p>
                                    </div>
                                    <button
                                        className="establishmentDetailsInfo-adminDeleteButton"
                                        onClick={async() =>  {
                                            await authApi.deleteEstablishmentAdmin(establishment?.id)
                                            location.href="/adminPage"
                                        }}
                                    >
                                    Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {newsModalOpen && <AddNewsPage onClose={() => setNewsModalOpen(false)} establishmentId={establishment.id}/>}

            {viewerOpen && (
                <div className="imageViewerOverlay" onClick={() => setViewerOpen(false)}>
                    <div className="imageViewer" onClick={e => e.stopPropagation()}>
                        <button
                            className="viewerClose"
                            onClick={() => setViewerOpen(false)}
                        >
                            ✕
                        </button>

                        <button
                            className="viewerArrow left"
                            onClick={() =>
                                setCurrentIndex(i =>
                                    i === 0 ? establishment.photoUrls.length - 1 : i - 1
                                )
                            }
                        >
                            ‹
                        </button>

                        <img
                            src={establishment.photoUrls[currentIndex]}
                            className="viewerImage"
                        />

                        <button
                            className="viewerArrow right"
                            onClick={() =>
                                setCurrentIndex(i =>
                                    i === establishment.photoUrls.length - 1 ? 0 : i + 1
                                )
                            }
                        >
                            ›
                        </button>

                        <div className="viewerCounter">
                            {currentIndex + 1} / {establishment.photoUrls.length}
                        </div>
                    </div>
                </div>
            )}

            {reviewModalOpen && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => setReviewModalOpen(false)}
                    establishmentId={establishment.id}
                    onReviewAdded={refreshReviews}
                />
            )}
        </div>
    );
}