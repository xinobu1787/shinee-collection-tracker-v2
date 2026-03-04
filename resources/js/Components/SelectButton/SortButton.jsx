import React from 'react';
import './SelectButton.css';

export default function SortButton({ options, value, onChange }) {
    return (
        <div className="flex items-center">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="filter-group"
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