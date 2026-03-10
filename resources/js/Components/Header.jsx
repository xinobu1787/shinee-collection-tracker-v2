import React from 'react';

export default function Header({ title }) {
    return (
        <header className="py-8 text-center bg-gradient-to-b from-[var(--base-color)] to-[var(--member-bg)]">
            <h1 className="text-[2rem] font-bold text-white drop-shadow-md"
                style={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.8)' }}>
                {title}
            </h1>
        </header>
    );
}