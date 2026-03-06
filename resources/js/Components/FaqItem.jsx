import React from 'react';

export default function FaqItem({ question, answer }) {
  return (
    <details className="group border-b border-gray-100 pb-2">
      <summary className="flex justify-between items-center cursor-pointer list-none font-medium text-gray-700 hover:text-emerald-600 transition-colors">
        {/* 質問文 */}
        <span>{question}</span>

        {/* 右側のプラスアイコン */}
        <span className="material-symbols-outlined text-xl text-emerald-600 transition-transform duration-300 group-open:rotate-45">
          add
        </span>
      </summary>
      <div className="mt-2 text-sm text-gray-600 leading-relaxed">
        {answer}
      </div>
    </details>
  );
}