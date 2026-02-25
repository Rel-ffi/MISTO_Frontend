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

    const [errors, setErrors] = useState({
        title: "",
        content: "",
        newsType: "",
        images: "",
    });

    const validate = () => {
        const newErrors = {
            title: "",
            content: "",
            newsType: "",
            images: "",
        };

        if (!newsType) newErrors.newsType = "Select news type";

        if (!form.title.trim()) newErrors.title = "Title can't be empty";
        else if (form.title.length > 20) newErrors.title = "Max 20 characters";

        if (!form.content.trim()) newErrors.content = "Content can't be empty";
        else if (form.content.length > 255) newErrors.content = "Max 255 characters";

        if (images.length === 0) newErrors.images = "At least one image is required";

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    const handlerSubmit = async () => {
        if (!validate()) return;

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
                            typeId: newsType!.id,
                        }),
                    ],
                    { type: "application/json" }
                )
            );

            images.forEach(file => formData.append("images", file));

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

                <div className="form-group">
                    <label>Title</label>
                    <input
                        placeholder="Title"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                    {errors.title && <p className="error">{errors.title}</p>}
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        placeholder="Content"
                        value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                    />
                    {errors.content && <p className="error">{errors.content}</p>}
                </div>
                <div className="form-group">
                    <label>News Type</label>
                    <SingleSelect
                        placeholder="Select news type"
                        loadItems={authApi.getAllNewsType}
                        value={newsType}
                        onChange={setNewsType}
                    />
                    {errors.newsType && <p className="error">{errors.newsType}</p>}
                </div>
                <label className="addNews-checkbox">
                    <input
                        type="checkbox"
                        checked={form.paid}
                        onChange={e => setForm({ ...form, paid: e.target.checked })}
                    />
                    Sponsored news
                </label>
                <div className="form-group">
                    <label>Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => setImages(Array.from(e.target.files || []))}
                    />
                    {errors.images && <p className="error">{errors.images}</p>}
                </div>
                <div className="addNews-actions">
                    <button
                        onClick={handlerSubmit}
                        disabled={loading}
                        className="addNews-submit"
                    >
                        {loading ? "Saving..." : "Create"}
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