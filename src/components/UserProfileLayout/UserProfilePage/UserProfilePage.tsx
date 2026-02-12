import {useEffect, useRef, useState} from "react";
import {authApi} from "../../../api/auth/authApi";
import type {UserResponse} from "../../../api/auth/types";
import "./UserProfilePage.css";

export const UserProfilePage = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [edit, setEdit] = useState(false);
    const [fullName, setFullName] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        authApi.getUserFromToken()
            .then(res => {
                setUser(res.data);
                setFullName(res.data.fullName);
            })
            .finally(() => setLoading(false));
    }, []);

    const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const saveProfile = async () => {
        if (!user) return;

        const formData = new FormData();
        formData.append(
            "data",
            new Blob([JSON.stringify({ fullName })], { type: "application/json" })
        );
        if (avatarFile) formData.append("avatar", avatarFile);

        await authApi.updateUser(formData);

        setUser(prev => prev ? {
            ...prev,
            fullName,
            avatarUrl: avatarPreview || prev.avatarUrl
        } : prev);

        setEdit(false);
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    if (loading || !user) return <p className="loading-p">Loading...</p>;

    return (
        <div className="userprofilepage-wrapper">
            <div className="userprofile-card">
                <div
                    className={`userprofile-avatar ${edit ? "editable" : ""}`}
                    onClick={() => {
                        if (edit && fileInputRef.current) fileInputRef.current.click();
                    }}
                >
                    {avatarPreview || user.avatarUrl ? (
                        <img src={avatarPreview || user.avatarUrl} alt="avatar" />
                    ) : (
                        <div className="userprofile-avatar-placeholder">
                            {fullName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={onAvatarChange}
                        style={{ display: "none" }}
                    />
                </div>

                <div className="userprofile-info">
                    <div className="userprofile-field">
                        <span>Full name</span>
                        {edit ? (
                            <input value={fullName} onChange={e => setFullName(e.target.value)} />
                        ) : (
                            <p>{user.fullName}</p>
                        )}
                    </div>

                    <div className="userprofile-field">
                        <span>Email</span>
                        <p>{user.email}</p>
                    </div>

                    <div className="userprofile-actions">
                        {edit ? (
                            <>
                                <button className="btn primary" onClick={saveProfile}>Save</button>
                                <button
                                    className="btn ghost"
                                    onClick={() => {
                                        setEdit(false);
                                        setFullName(user.fullName);
                                        setAvatarPreview(null);
                                        setAvatarFile(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button className="btn primary" onClick={() => setEdit(true)}>Edit profile</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
