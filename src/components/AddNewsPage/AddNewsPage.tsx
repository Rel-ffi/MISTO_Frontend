import {useState} from "react";
import {authApi} from "../../api/auth/authApi";
import {SingleSelect} from "../SelectsComponents/SingleSelectComponent/SingleSelect";
import type {NewsType} from "../../api/auth/types";
import "./AddNewsPage.css";

type Props = {
    onClose: () => void;
    establishmentId: number;
};

export const AddNewsPage = ({ onClose, establishmentId }: Props) => {
    const [loading, setLoading] = useState(false);
    const [newsType, setNewsType] = useState<NewsType | null>(null);
    const [images, setImages] = useState<File[]>([]);

    const [form, setForm] = useState({
        title: "",
        content: "",
        paid: false,
    });

    const handlerSubmit = async () => {
        if (!newsType) {
            alert("Select news type");
            return;
        }

        if (!form.title.trim() || !form.content.trim()) {
            alert("Fill title and description");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "data",
                new Blob(
                    [
                        JSON.stringify({
                            establishmentId,
                            title: form.title,
                            content: form.content,
                            paid: form.paid,
                            typeId: newsType.id,
                        }),
                    ],
                    { type: "application/json" }
                )
            );

            images.forEach(file => {
                formData.append("images", file);
            });

            await authApi.addNewsToEstablishmentOwner(formData);

            onClose();
        } catch (e) {
            console.error(e);
            alert("Failed to create news");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addNews-overlay" onClick={onClose}>
            <div
                className="addNews-wrapper"
                onClick={e => e.stopPropagation()}
            >
                <span className="addNews-closeButton" onClick={onClose}>
                    ✕
                </span>

                <h3 className="addNews-title">Add new</h3>

                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={e =>
                        setForm({ ...form, title: e.target.value })
                    }
                />

                <textarea
                    placeholder="Content"
                    value={form.content}
                    onChange={e =>
                        setForm({ ...form, content: e.target.value })
                    }
                />

                <SingleSelect
                    placeholder="Select news type"
                    loadItems={authApi.getAllNewsType}
                    value={newsType}
                    onChange={setNewsType}
                />

                <label className="addNews-checkbox">
                    <input
                        type="checkbox"
                        checked={form.paid}
                        onChange={e =>
                            setForm({ ...form, paid: e.target.checked })
                        }
                    />
                    Sponsored news
                </label>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e =>
                        setImages(Array.from(e.target.files || []))
                    }
                />

                <div className="addNews-actions">
                    <button
                        onClick={handlerSubmit}
                        disabled={loading}
                        className="addNews-submit"
                    >
                        {loading ? "Saving. . ." : "Create"}
                    </button>

                    <button
                        onClick={onClose}
                        type="button"
                        className="addNews-cancel"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
