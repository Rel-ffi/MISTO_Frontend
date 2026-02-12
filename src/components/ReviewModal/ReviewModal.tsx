import {useState} from "react";
import "./ReviewModal.css";
import {authApi} from "../../api/auth/authApi.ts";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    establishmentId: number;
    onReviewAdded: () => void;
}

export function ReviewModal({ isOpen, onClose, establishmentId, onReviewAdded }: ReviewModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [text, setText] = useState<string>("");
    const [isComplaint, setIsComplaint] = useState<boolean>(false);
    const [checkAmount, setCheckAmount] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert("Please enter review text");
            return;
        }

        setLoading(true);
        try {
            await authApi.addReview(
                BigInt(establishmentId),
                rating,
                text,
                isComplaint,
                checkAmount ? parseFloat(checkAmount) : undefined
            );

            onReviewAdded();
            handleClose();
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRating(5);
        setText("");
        setIsComplaint(false);
        setCheckAmount("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={handleClose}>
            <div className="modalContent" onClick={e => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Add Review</h2>
                    <button className="closeButton" onClick={handleClose}>×</button>
                </div>

                <div className="formGroup">
                    <label>Rating</label>
                    <div className="ratingStars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`starButton ${star <= rating ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                        <span className="ratingValue">{rating}.0</span>
                    </div>
                </div>

                <div className="formGroup">
                    <label>Review Text *</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share your experience..."
                        rows={4}
                        maxLength={500}
                    />
                    <div className="charCount">{text.length}/500</div>
                </div>

                <div className="formGroup">
                    <label>Check Amount (optional)</label>
                    <input
                        type="number"
                        value={checkAmount}
                        onChange={(e) => setCheckAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="formGroup checkboxGroup">
                    <label className="checkboxLabel">
                        <input
                            type="checkbox"
                            checked={isComplaint}
                            onChange={(e) => setIsComplaint(e.target.checked)}
                        />
                        <span className="checkboxText">This is a complaint</span>
                    </label>
                </div>

                <div className="modalActions">
                    <button
                        className="cancelButton"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="submitButton"
                        onClick={handleSubmit}
                        disabled={loading || !text.trim()}
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}