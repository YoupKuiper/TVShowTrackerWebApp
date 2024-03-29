import { useEffect, useState } from "react";

export const useStickyState = (defaultValue: unknown, key: string) => {
    const [value, setValue] = useState(() => {
        const stickyValue = localStorage.getItem(key);
        return stickyValue !== null
            ? JSON.parse(stickyValue)
            : defaultValue;
    });
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
}
