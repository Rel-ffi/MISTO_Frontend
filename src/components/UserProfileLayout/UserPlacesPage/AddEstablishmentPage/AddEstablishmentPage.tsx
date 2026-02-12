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

    const onSubmit = async () => {
        const formData = new FormData();

        formData.append(
            "data",
            new Blob(
                [
                    JSON.stringify({
                        ...form,
                        tagIds: selectedTags.map(t => t.id),
                    }),
                ],
                { type: "application/json" }
            )
        );

        images.forEach(img => formData.append("images", img));

        await authApi.createEstablishment(formData);
        alert("Establishment created");
        onClose();
    };

    return (
        <div className="addEstablishment-overlay" onClick={onClose}>
            <div
                className="addEstablishment-wrapper"
                onClick={e => e.stopPropagation()}
            >
                <div onClick={onClose} className="addEstablishment-closeButton">⨉</div>
                <div className="addEstablishment-title">
                    Add establishment
                </div>

                <input placeholder="Name"
                       onChange={e => setForm({ ...form, name: e.target.value })}
                       id="name"
                />

                <input placeholder="Address"
                       onChange={e => setForm({ ...form, address: e.target.value })}
                       id="address"
                />

                <input placeholder="Average Check"
                       onChange={e => setForm({ ...form, averageCheck: e.target.value })}
                       id="averageCheck"
                />

                <input placeholder="Phone"
                       onChange={e => setForm({ ...form, phone: e.target.value })}
                       id="phone"
                />

                <input placeholder="Email"
                       onChange={e => setForm({ ...form, email: e.target.value })}
                       id="email"
                />

                <MultiSelect
                    placeholder="Select tags"
                    loadItems={authApi.getAllTags}
                    selected={selectedTags}
                    onChange={setSelectedTags}
                />


                <textarea
                    placeholder="Description"
                    key="description"
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />

                <input
                    type="file"
                    key="file"
                    multiple
                    accept="image/*"
                    onChange={e =>
                        setImages(Array.from(e.target.files || []))
                    }
                />

                <button className="addEstablishment-submit" onClick={onSubmit}>
                    Create
                </button>
            </div>
        </div>
    );
};
