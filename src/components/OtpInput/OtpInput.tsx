import * as React from "react";
import {useRef, useState} from "react";
import "./OtpInput.css";

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
                                                      length = 6,
                                                      onComplete,
                                                  }) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }

        if (newOtp.every(d => d !== "")) {
            onComplete(newOtp.join(""));
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData
            .getData("Text")
            .trim()
            .replace(/\D/g, "")
            .slice(0, length)
            .split("");

        const newOtp = [...otp];
        for (let i = 0; i < pasteData.length; i++) {
            if (/^\d$/.test(pasteData[i])) {
                newOtp[i] = pasteData[i];
            }
        }
        setOtp(newOtp);
        const nextEmptyIndex = newOtp.findIndex(d => d === "");
        if (nextEmptyIndex !== -1) {
            inputsRef.current[nextEmptyIndex]?.focus();
        } else {
            inputsRef.current[length - 1]?.focus();
            onComplete(newOtp.join(""));
        }
    };

    return (
        <div className="otp-inputs">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={el => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onPaste={handlePaste}
                    onChange={e => handleChange(e.target.value, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    className="otp-input"
                />
            ))}
        </div>
    );
};
