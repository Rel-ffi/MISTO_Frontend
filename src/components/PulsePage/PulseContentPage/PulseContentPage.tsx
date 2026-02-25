import type { NewsEstablishment, NewsType } from "../../../api/auth/types";
import { useEffect, useState } from "react";
import { authApi } from "../../../api/auth/authApi";
import "./PulseContentPage.css";
import { useNavigate, useSearchParams } from "react-router-dom";

type Props = {
    type: NewsType | null;
};

const PulseContentPage = ({ type }: Props) => {
    const [news, setNews] = useState<NewsEstablishment[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? Number(pageParam) : 1;

    const backendPage = currentPage - 1;

    const formatDate = (date: string) => {
        const formattedDate = new Date(date);
        return new Intl.DateTimeFormat("en", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(formattedDate);
    };

    const loadNewsEstablishment = async () => {
        try {
            setLoading(true);

            const res = type
                ? await authApi.getNewsByNewsType(type.id, backendPage, 2)
                : await authApi.getAllNews(backendPage, 2);

            setNews(res.content);
            setTotalPages(res.page.totalPages);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNewsEstablishment();
    }, [backendPage, type]);

    const changePage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setSearchParams({ page: String(newPage) });
    };

    return (
        <div className="pulsecontent-wrapper">
            {loading && <p className="pulsecontent-loading">Loading...</p>}

            {!loading && news.length === 0 && (
                <p className="pulsecontent-loading">News not found yet.</p>
            )}

            {news.map(item => (
                <div
                    key={item.id}
                    className="pulsecontent-card"
                    onClick={() =>
                        navigate(`/establishment/${item.establishmentId}`)
                    }
                >
                    <div className="pulsecontent-cardimage">
                        <img src={item.photoUrls[0]} alt="NewsImage" />
                        {item.paid && <div>SPONSORED</div>}
                    </div>
                    <p>{formatDate(item.createdAt)}</p>
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                </div>
            ))}

            <div className="pagination pulsecontent-pagination">
                <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                <span>
                    {currentPage} / {totalPages}
                </span>

                <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PulseContentPage;