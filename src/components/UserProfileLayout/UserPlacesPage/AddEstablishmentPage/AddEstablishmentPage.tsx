import {useState} from "react";
import {authApi} from "../../../../api/auth/authApi";
import type {TagsEstablishment} from "../../../../api/auth/types";
import "./AddEstablishmentPage.css";
import {MultiSelect} from "../../../SelectsComponents/MultiselectComponent/MultiSelect.tsx";

type Props = {
    onClose: () => void;
};

export const AddEstablishmentPage = ({ onClose }: Props) => {
    const [form, setForm] = useState({
        name: "",
        address: "",
        averageCheck: "",
        phone: "",
        email: "",
        description: "",
    });

    const [images, setImages] = useState<File[]>([]);
    const [selectedTags, setSelectedTags] = useState<TagsEstablishment[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!form.name.trim()) newErrors.name = "Name can't be empty";
        else if (form.name.length > 30) newErrors.name = "Max 30 chars";

        if (!form.address.trim()) newErrors.address = "Address can't be empty";
        else if (form.address.length > 255) newErrors.address = "Max 255 chars";

        const avg = Number(form.averageCheck);
        if (form.averageCheck === "") newErrors.averageCheck = "Average check can't be empty";
        else if (isNaN(avg) || avg < 0) newErrors.averageCheck = "Must be >= 0";

        if (!form.phone.trim()) newErrors.phone = "Phone can't be empty";
        else if (!/^\+?[0-9\- ]{7,20}$/.test(form.phone))
            newErrors.phone = "Invalid phone";

        if (!form.email.trim()) newErrors.email = "Email can't be empty";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            newErrors.email = "Invalid email";

        if (selectedTags.length === 0) newErrors.selectedTags = "Select at least one tag";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if (!validate()) return;

        const formData = new FormData();
        formData.append(
            "data",
            new Blob(
                [
                    JSON.stringify({
                        ...form,
                        averageCheck: Number(form.averageCheck),
                        tagIds: selectedTags.map(t => t.id),
                    }),
                ],
                { type: "application/json" }
            )
        );

        images.forEach(img => formData.append("images", img));

        try {
            await authApi.createEstablishment(formData);
            alert("Establishment created");
            onClose();
        } catch (err: any) {
            alert(err.response?.data?.message || "Error creating establishment");
        }
    };

    return (
        <div className="addEstablishment-overlay" onClick={onClose}>
            <div
                className="addEstablishment-wrapper"
                onClick={e => e.stopPropagation()}
            >
                <div onClick={onClose} className="addEstablishment-closeButton">⨉</div>
                <div className="addEstablishment-title">Add establishment</div>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p className="error-addes">{errors.name}</p>}
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <input
                        placeholder="Address"
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                    {errors.address && <p className="error-addes">{errors.address}</p>}
                </div>

                <div className="form-group">
                    <label>Average Check</label>
                    <input
                        placeholder="Average Check"
                        value={form.averageCheck}
                        onChange={e => setForm({ ...form, averageCheck: e.target.value })}
                    />
                    {errors.averageCheck && <p className="error-addes">{errors.averageCheck}</p>}
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        placeholder="Phone"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                    {errors.phone && <p className="error-addes">{errors.phone}</p>}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <p className="error-addes">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <label>Establishment Tags</label>
                    <MultiSelect
                        placeholder="Select tags"
                        loadItems={authApi.getAllTags}
                        selected={selectedTags}
                        onChange={setSelectedTags}
                    />
                    {errors.selectedTags && <p className="error-addes">{errors.selectedTags}</p>}
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e =>
                            setImages(Array.from(e.target.files || []))
                        }
                    />
                </div>


                <button className="addEstablishment-submit" onClick={onSubmit}>
                    Create
                </button>
            </div>
        </div>
    );
};