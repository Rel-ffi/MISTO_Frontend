import {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import type {Establishment, NewsType, Page, TagsEstablishment} from "../../api/auth/types";
import {authApi} from "../../api/auth/authApi";
import "./AdminPage.css";
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";

export const AdminPage = () => {
    const [data, setData] = useState<Page<Establishment> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const [tags,setTags] = useState<TagsEstablishment[] | null>(null);
    const [newsType, setNewsType] = useState<NewsType[] | null>(null);
    const [addTagOpen, setAddTagOpen] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [tagLoading, setTagLoading] = useState(false);
    const [typeLoading,setTypeLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalEstablishments, setTotalEstablishments] = useState<number>(0);

    const [page, setPage] = useState(0);
    type Tab = "Establishments" | "Tags" | "NewsType";
    const [activeTab, setActiveTab] = useState<Tab>("Establishments");
    const [configOpen, setConfigOpen] = useState(false);


    const size = 10;

    const [rejectId, setRejectId] = useState<number | null>(null);


    const rejectOpen = (id: number) => {
        setRejectId(id);
    };

    const rejectClose = () => {
        setRejectId(null);
    };

    const approve = async (id: number) => {
        await authApi.approveEstablishmentAdmin(id);
        await loadData();
    };

    const reject = async () => {
        if (!rejectId) return;

        await authApi.deleteEstablishmentAdmin(rejectId);
        setRejectId(null);
        await loadData();
    };


    const loadData = async () => {
        try {
            setLoading(true);

            const res = await authApi.getEstablishmentNotApprovedAdmin({
                page,
                size,
            });

            setData(res);

            const users = await authApi.getTotalViewsAdmin();
            const pending = await authApi.getTotalNotApprovedEstablishmentsAdmin();

            setTotalUsers(users);
            setTotalEstablishments(pending);
        } catch (e) {
            console.error(e);
            setError("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const loadTags = async () => {
        const res = await authApi.getAllTags();
        setTags(res);
    }

    const loadNewsType = async () => {
        const res = await authApi.getAllNewsType();
        setNewsType(res);
    }

    const addTag = async () => {
        if (!newTagName.trim()) return;

        try {
            setTagLoading(true);
            await authApi.addNewTag(newTagName);
            setNewTagName("");
            setAddTagOpen(false);
            await loadTags();
        } catch (e) {
            console.error(e);
            alert("Failed to add tag");
        } finally {
            setTagLoading(false);
        }
    };

    const addNewsType = async () => {
        try {
            setTypeLoading(true);
            await authApi.addNewsTypeAdmin(form);
            setAddTagOpen(false);
            await loadNewsType();
        } catch (e) {
            console.error(e)
            alert("Failed to add type")
        } finally {
            setTypeLoading(false);
        }
    }


    useEffect(() => {
        loadData();
        loadTags();
        loadNewsType();
    }, [page]);

    useDocumentTitle(`${activeTab} | Admin Page`);


    if (loading) return <div className="adminpage-loading">Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!data) return null;

    return (
        <div className="adminpage-wrapper">
            <div className="adminpage">

                <div className="adminpageTextInfo">
                    <h2>God Mode</h2>
                    <div>
                        <span>SUPER ADMIN</span>
                    </div>
                </div>

                <div className="adminpageConfig-wrapper">
                    <div className="adminpageConfigCard">
                        <h5>{totalEstablishments}</h5>
                        <p>Pending Moderation</p>
                    </div>

                    <div className="adminpageConfigCard">
                        <h5>{totalUsers}</h5>
                        <p>Total Users</p>
                    </div>

                    <div className="adminpageConfigCard">
                        <h5>24/7</h5>
                        <p>System Status</p>
                    </div>

                    <div className="adminpageConfigCard">
                        <div className="adminpageConfigDropdown">
                            <button onClick={() => setConfigOpen(prev => !prev)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34
                                    0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34
                                    0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0
                                    0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0
                                    0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0
                                    0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                Global Config
                            </button>

                            {configOpen && (
                                <div className="adminpageConfigMenu">
                                    <button
                                        className={activeTab === "Establishments" ? "active" : ""}
                                        onClick={() => {
                                            setActiveTab("Establishments");
                                            setConfigOpen(false);
                                        }}
                                    >
                                        Establishments
                                    </button>

                                    <button
                                        className={activeTab === "Tags" ? "active" : ""}
                                        onClick={() => {
                                            setActiveTab("Tags");
                                            setConfigOpen(false);
                                        }}
                                    >
                                        Tags
                                    </button>
                                    <button
                                        className={activeTab === "NewsType" ? "active" : ""}
                                        onClick={() => {
                                            setActiveTab("NewsType");
                                            setConfigOpen(false);
                                        }}
                                    >
                                        News Type
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className="adminpageQueue-wrapper">

                    {activeTab === "Establishments" && (
                        <>
                            <h5>MODERATION QUEUE</h5>

                            <div className="adminpageEstablishment-wrapper">
                                {data.content.map(e => (
                                    <div key={e.id} className="adminpageEstablishmentCard">
                                        <NavLink to={`/establishment/${e.id}`}>
                                            New Place: {e.name}
                                        </NavLink>

                                        <div>
                                            <button
                                                style={{ color: "green" }}
                                                onClick={() => approve(e.id)}
                                            >
                                                APPROVE
                                            </button>

                                            <button
                                                style={{ color: "red" }}
                                                onClick={() => rejectOpen(e.id)}
                                            >
                                                REJECT
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === "Tags" && (
                        <>
                            <h5>TAGS MANAGEMENT</h5>
                            <div className="adminpageTagsButtons-wrapper">
                                <div className="adminpageTags-wrapper">
                                    {tags?.map(tag => (
                                        <div key={tag.id} className="adminpage-tag">
                                            <span>{tag.name}</span>
                                            <button key={tag.id}
                                                    onClick={async () => {
                                                        await authApi.deleteTagAdmin(tag.id);
                                                        await loadTags();
                                                    }}
                                            >X</button>
                                        </div>
                                    ))}
                                </div>
                                <div className="adminpageButtons-wrapper">
                                    <div className="adminpageAddTag">
                                        <button onClick={() => setAddTagOpen(prev => !prev)}>
                                            Add Tag
                                        </button>

                                        {addTagOpen && (
                                            <div className="adminpageAddTagDropdown">
                                                <input
                                                    placeholder="Tag name"
                                                    value={newTagName}
                                                    onChange={e => setNewTagName(e.target.value)}
                                                />

                                                <button
                                                    disabled={tagLoading}
                                                    onClick={addTag}
                                                >
                                                    {tagLoading ? "Adding..." : "Create"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </>
                    )}

                    {activeTab == "NewsType" && (
                        <>
                            <h5>NEWS TYPE MANAGMENT</h5>
                            <div className="adminpageTagsButtons-wrapper">
                                <div className="adminpageTags-wrapper">
                                    {newsType?.map(type => (
                                        <div key={type.id} className="adminpage-tag">
                                            <span>{type.name}</span>
                                            <button key={type.id}
                                                    onClick={async () => {
                                                        await authApi.deleteNewsTypeAdmin(type.id);
                                                        await loadNewsType();
                                                    }}
                                            >X</button>
                                        </div>
                                    ))}
                                </div>
                                <div className="adminpageButtons-wrapper">
                                    <div className="adminpageAddTag">
                                        <button onClick={() => setAddTagOpen(prev => !prev)}>
                                            Add Tag
                                        </button>

                                        {addTagOpen && (
                                            <div className="adminpageAddTagDropdown">
                                                <input
                                                    placeholder="Type name"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                />
                                                <textarea
                                                    placeholder="Type description"
                                                    value={form.description}
                                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                />

                                                <button
                                                    disabled={tagLoading}
                                                    onClick={addNewsType}
                                                >
                                                    {typeLoading ? "Adding..." : "Create"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </>
                    )}

                </div>
            </div>

            {rejectId && (
                <div className="adminpage-modal">
                    <div
                        className="adminpage-modal-backdrop"
                        onClick={rejectClose}
                    />

                    <div className="adminpage-modal-content">
                        <h3>Reject establishment?</h3>
                        <p>This action cannot be undone.</p>

                        <div className="adminpage-modal-actions">
                            <button
                                className="danger"
                                onClick={reject}
                            >
                                Yes, reject
                            </button>

                            <button
                                className="secondary"
                                onClick={rejectClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
