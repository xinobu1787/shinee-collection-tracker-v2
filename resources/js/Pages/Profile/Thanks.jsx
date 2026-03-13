import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Thanks() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--base-color)] pt-6 sm:justify-center sm:pt-0">
      <Head title="退会完了 - SHINee Collection Tracker" />
      <div>
        <p className="text-6xl font-bold text-white">
          {"THANK YOU ！".split("").map((char, index) => (
            <span
              key={index}
              className="inline-block animate-bounce"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '1s'
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-6 w-full overflow-hidden bg-white px-10 py-8 shadow-[var(--card-shadow)] sm:max-w-md sm:rounded-lg">
        <div className="space-y-2">
          <p className="text-xl font-bold text-gray-800">
            ご利用ありがとうございました。
          </p>
          <p className="text-gray-600 leading-relaxed">
            退会処理が無事に完了いたしました。<br />
            これからもアナタだけの素敵なシャヲルライフをお過ごしください！
          </p>
        </div>

        <div className="pt-6">
          {/* 戻るボタン */}
          <Link
            href={route('tracker.index')}
            className="flex items-center gap-2 text-gray-500 hover:text-[var(--base-color)] transition-colors"
          >
            <span>←</span>
            <span className="text-sm font-medium">トップページへ戻る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}