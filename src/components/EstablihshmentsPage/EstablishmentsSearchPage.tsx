import "./EstablishmentSearchPage.css";
import {useEffect, useState} from "react";
import {authApi} from "../../api/auth/authApi";
import type {Establishment, TagsEstablishment} from "../../api/auth/types";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";

export const EstablishmentsSearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [filterModal, setFilterModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [tags, setTags] = useState<TagsEstablishment[]>([]);

    const [filters, setFilters] = useState({
        page: (Number(searchParams.get("page")) || 1) - 1,
        size: 4,
        minRating: Number(searchParams.get("minRating")) || 0,
        minAverageCheck: Number(searchParams.get("minAverageCheck")) || 0,
        searchQuery: searchParams.get("search") || "",
        tagIds: searchParams.get("tags")
            ? searchParams.get("tags")!.split(",").map(Number)
            : [],
    });

    const [debouncedFilters, setDebouncedFilters] = useState({
        minRating: filters.minRating,
        minAverageCheck: filters.minAverageCheck,
        searchQuery: filters.searchQuery,
        tagIds: filters.tagIds,
    });

    useEffect(() => {
        authApi.getAllTags().then(setTags);
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters({
                minRating: filters.minRating,
                minAverageCheck: filters.minAverageCheck,
                searchQuery: filters.searchQuery,
                tagIds: filters.tagIds,
            });
            setFilters(prev => ({ ...prev, page: 0 }));
        }, 800);

        return () => clearTimeout(handler);
    }, [filters.minRating, filters.minAverageCheck, filters.searchQuery, filters.tagIds]);

    useEffect(() => {
        setLoading(true);
        authApi.getEstablishments({
            ...debouncedFilters,
            page: filters.page,
            size: filters.size,
        })
            .then(res => {
                setEstablishments(res.content);
                setTotalPages(res.page.totalPages);
            })
            .finally(() => setLoading(false));
    }, [debouncedFilters, filters.page, filters.size]);

    useDocumentTitle("Search Page | Establishments");

    useEffect(() => {
        const params: Record<string, string> = {};
        if (filters.page >= 0) params.page = String(filters.page + 1);
        if (filters.minRating > 0) params.minRating = String(filters.minRating);
        if (filters.minAverageCheck > 0) params.minAverageCheck = String(filters.minAverageCheck);
        if (filters.searchQuery) params.search = filters.searchQuery;
        if (filters.tagIds.length) params.tags = filters.tagIds.join(",");

        setSearchParams(params, { replace: true });
    }, [filters, setSearchParams]);

    useEffect(() => {
        document.body.style.overflow = filterModal ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [filterModal]);

    const toggleTag = (id: number) => {
        setFilters(prev => ({
            ...prev,
            tagIds: prev.tagIds.includes(id)
                ? prev.tagIds.filter(t => t !== id)
                : [...prev.tagIds, id],
            page: 0,
        }));
    };

    const resetFilters = () => {
        setFilters({
            page: 0,
            size: 4,
            minRating: 0,
            minAverageCheck: 0,
            searchQuery: "",
            tagIds: [],
        });
    };

    const currentPage = filters.page;

    return (
        <div className="establishmentPage-wrapper">
            <div className="establishmentPageFilter-wrapper">
                <div className="establishmentPageFilterInfo">
                    <h3>Precision Filtering</h3>
                    <p>Drill down by rating, average check or amenities.</p>
                </div>

                <div className="establishmentPageFilterPanel-wrapper">
                    <div className="establishmentPageFilterPanel">
                        {filters.minRating.toFixed(1)}
                        <span>Rating</span>
                    </div>

                    <div className="establishmentPageFilterPanel">
                        {filters.searchQuery || "—"}
                        <span>Search</span>
                    </div>

                    <div className="establishmentPageFilterPanel">
                        {filters.minAverageCheck}
                        <span>Average Check</span>
                    </div>

                    <button onClick={() => setFilterModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                             height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 5H3"></path>
                            <path d="M12 19H3"></path>
                            <path d="M14 3v4"></path>
                            <path d="M16 17v4"></path>
                            <path d="M21 12h-9"></path>
                            <path d="M21 19h-5"></path>
                            <path d="M21 5h-7"></path>
                            <path d="M8 10v4"></path>
                            <path d="M8 12H3"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {filterModal && (
                <div className="filterOverlay" onClick={() => setFilterModal(false)}>
                    <div className="filterModal" onClick={e => e.stopPropagation()}>
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={filters.searchQuery}
                            onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                        />

                        <label>Rating: {filters.minRating.toFixed(1)}</label>
                        <input
                            type="range"
                            min={0}
                            max={5}
                            step={0.1}
                            value={filters.minRating}
                            onChange={e => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                        />

                        <label>Average check: {filters.minAverageCheck}</label>
                        <input
                            type="range"
                            min={0}
                            max={2000}
                            step={50}
                            value={filters.minAverageCheck}
                            onChange={e => setFilters(prev => ({ ...prev, minAverageCheck: Number(e.target.value) }))}
                        />

                        <label>Tags</label>
                        <div className="filterTags">
                            {tags.map(tag => (
                                <div
                                    key={tag.id}
                                    className={`filterTag ${filters.tagIds.includes(tag.id) ? "active" : ""}`}
                                    onClick={() => toggleTag(tag.id)}
                                >
                                    {tag.name}
                                </div>
                            ))}
                        </div>

                        <div className="filterActions">
                            <button className="resetFiltersBtn" onClick={resetFilters}>Reset</button>
                            <button className="applyFiltersBtn" onClick={() => setFilterModal(false)}>Apply</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="establishmentPageEstablishments-wrapper">
                {loading && <p>Loading...</p>}
                {!loading && establishments.length === 0 && <p>No results</p>}

                {!loading && establishments.map(est => (
                    <div
                        key={est.id}
                        className="establishmentCard"
                        onClick={() => navigate(`/establishment/${est.id}`)}
                    >
                        <img src={est.photoUrls?.[0]} alt={est.name} />
                        <h4>{est.name}</h4>
                        <p>{est.address}</p>
                        <span>⭐ {est.rating}</span>
                        <span>{est.averageCheck} ₴</span>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button
                    disabled={currentPage <= 0}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                    Prev
                </button>

                <span>
                    Page {currentPage + 1} / {totalPages}
                </span>

                <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                    Next
                </button>
            </div>
        </div>
    );
};