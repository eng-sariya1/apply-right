import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
    autoComplete?: string;
    className?: string;
}

// Mirrors the Tailwind class string used at every password-input site today;
// `pr-12` leaves room for the eye toggle on the right.
const defaultInputClass =
    'w-full px-4 py-3 pr-12 border border-[var(--color-border)] rounded-xl '
    + 'focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 '
    + 'transition-all outline-none bg-[var(--color-surface-50)]';

export default function PasswordInput({
    id,
    value,
    onChange,
    required,
    placeholder,
    autoComplete,
    className,
}: PasswordInputProps) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                required={required}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className={className ?? defaultInputClass}
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                aria-pressed={show}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-[var(--color-text-light)] hover:text-[#017A8C] transition-colors"
            >
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
        </div>
    );
}
