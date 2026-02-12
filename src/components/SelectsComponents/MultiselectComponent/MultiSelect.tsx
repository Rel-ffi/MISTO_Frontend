import {useEffect, useRef, useState} from "react";
import "./MultiSelect.css";

export type BaseTag = {
    id: number;
    name: string;
};

type Props<T extends BaseTag> = {
    placeholder: string;
    loadItems: () => Promise<T[]>;
    selected: T[];
    onChange: (items: T[]) => void;
};

export function MultiSelect<T extends BaseTag>({
                                                   placeholder,
                                                   loadItems,
                                                   selected,
                                                   onChange,
                                               }: Props<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadItems().then(setItems);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggleItem = (item: T) => {
        onChange(
            selected.some(i => i.id === item.id)
                ? selected.filter(i => i.id !== item.id)
                : [...selected, item]
        );
    };

    return (
        <div className="tags-wrapper" ref={ref}>
            <div
                className="tags-input"
                onClick={() => setOpen(prev => !prev)}
            >
                {selected.length === 0
                    ? placeholder
                    : selected.map(i => (
                        <span key={i.id} className="tag-chip">
                            {i.name}
                        </span>
                    ))}
            </div>

            {open && (
                <div className="tags-dropdown">
                    {items.map(item => (
                        <div
                            key={item.id}
                            className={`tag-option ${
                                selected.some(i => i.id === item.id)
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() => toggleItem(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
