import React from 'react';

export default function BaseCard({ title, children }) {
  return (
    <div className="mx-4 my-4 p-6 bg-white rounded-[2rem] shadow-sm border border-[#e8f5e9]">
      {title && (
        <h2 className="text-[#81d4af] font-bold text-xl mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}