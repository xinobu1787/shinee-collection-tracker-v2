import React from "react";

export default function DiscCard({ disc, onClick }) {
    return (
        <div 
            className="bg-white p-5 rounded-full shadow-sm flex justify-between items-center border border-white hover:border-[var(--member-color)] transition-all cursor-pointer group shadow-[var(--card-shadow)]"
            onClick={onClick}
        >
            {/* 左側：メインタイトル */}
            <span className="font-bold text-gray-700 ml-6 group-hover:text-[var(--member-color)] transition-colors">
                {disc.title}
            </span>

            {/* 右側：サブタイトル（形態名など） */}
            <span className="text-xs text-gray-400 mr-6 italic">
                {disc.title_sub}
            </span>
        </div>
    );
}