import React from 'react';

export default function SortButton({ options, value, onChange }) {
    return (
        <div className="flex items-center">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
                    appearance-none bg-white
                    border-[1.5px] border-[var(--member-color)]
                    rounded-[2rem] py-[0.6rem] px-[1.2rem]
                    text-[0.9rem] text-[#555] text-center
                    cursor-pointer min-w-[8rem]
                    shadow-[var(--card-shadow)]
                    transition-all duration-200 ease-in-out
                    hover:-translate-y-[2px] hover:bg-[#f0fdfa]
                    focus:outline-none
                "
            >
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>
        </div>
    );
}