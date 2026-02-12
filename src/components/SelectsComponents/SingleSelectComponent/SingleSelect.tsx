import {useEffect, useRef, useState} from "react";
import "../MultiselectComponent/MultiSelect.css"

type Item = {
    id: number;
    name: string;
};

type Props<T extends Item> = {
    placeholder: string;
    loadItems: () => Promise<T[]>;
    value: T | null;
    onChange: (item: T) => void;
};

export function SingleSelect<T extends Item>({
                                                 placeholder,
                                                 loadItems,
                                                 value,
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

    const selectItem = (item: T) => {
        onChange(item);
        setOpen(false);
    };

    return (
        <div className="tags-wrapper" ref={ref}>
            <div
                className="tags-input"
                onClick={() => setOpen(prev => !prev)}
            >
                {value ? (
                    <span className="tag-chip">{value.name}</span>
                ) : (
                    placeholder
                )}
            </div>

            {open && (
                <div className="tags-dropdown">
                    {items.map(item => (
                        <div
                            key={item.id}
                            className={`tag-option ${
                                value?.id === item.id ? "selected" : ""
                            }`}
                            onClick={() => selectItem(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
