import { useEffect, useState } from "react";

export default function DebouncedInput({
  value,
  placeholder,
  onChange,
  debounce = 500,
  className,
}) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setDebouncedValue(value);
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(debouncedValue);
    }, debounce);

    return () => {
      clearTimeout(timeout);
    };
  }, [debouncedValue]);

  return (
    <input
      type="text"
      className={className}
      value={debouncedValue}
      placeholder={placeholder}
      onChange={(e) => setDebouncedValue(e.target.value)}
    />
  );
}
