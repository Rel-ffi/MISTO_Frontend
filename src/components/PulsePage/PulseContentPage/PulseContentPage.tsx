import type {NewsEstablishment, NewsType} from "../../../api/auth/types";
import {useEffect, useState} from "react";
import {authApi} from "../../../api/auth/authApi";
import "./PulseContentPage.css"

type Props = {
    type: NewsType | null;
};

const PulseContentPage = ({ type }: Props) => {
    const [news, setNews] = useState<NewsEstablishment[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const formateDate = (date:string) => {
        const formattedData = new Date(date);
        return new Intl.DateTimeFormat("en", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(formattedData)
    }

    const loadNewsEstablishment = async (pageNumber = 0) => {
        try {
            setLoading(true);

            const res = type
                ? await authApi.getNewsByNewsType(type.id, pageNumber, 2)
                : await authApi.getAllNews(pageNumber, 2);

            setNews(res.content);
            setTotalPages(res.totalPages);
            setPage(pageNumber);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNewsEstablishment(0);
    }, [type]);

    return (
        <div className="pulsecontent-wrapper">
            {loading && <p className="pulsecontent-loading">Loading...</p>}

            {!loading && news.length === 0 && <p className="pulsecontent-loading">News not found yet.</p>}

            {news.map(item => (
                <div key={item.id} className="pulsecontent-card" onClick={() => location.href=`/establishment/${item.establishmentId}`}>
                    <div className="pulsecontent-cardimage">
                        <img src={item.photoUrls[0]} alt="NewsImage"></img>
                        {item.paid && (<div>SPONSORED</div>)}
                    </div>
                    <p>{formateDate(item.createdAt)}</p>
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                </div>
            ))}

            <div className="pagination pulsecontent-pagination">
                <button onClick={() => loadNewsEstablishment(page - 1)} disabled={page === 0}>
                    Prev
                </button>
                <span>{page + 1} / {totalPages}</span>
                <button onClick={() => loadNewsEstablishment(page + 1)} disabled={page + 1 >= totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default PulseContentPage;
