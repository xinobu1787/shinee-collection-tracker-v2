import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Thanks() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--base-color)] pt-6 sm:justify-center sm:pt-0">
      <Head title="送信完了 - SHINee Collection Tracker" />
      <div>
        <p className="text-3xl font-bold text-white">
          送信完了！
        </p>
      </div>

      <div className="mt-6 w-full overflow-hidden bg-white px-10 py-8 shadow-[var(--card-shadow)] sm:max-w-md sm:rounded-lg">
        <div className="space-y-2">
          <p className="text-xl font-bold text-gray-800">
            お問い合わせありがとうございます！
          </p>
          <p className="text-gray-600 leading-relaxed">
            メッセージは無事に送信されました。<br />
            内容を確認次第、折り返しご連絡させていただきます。
          </p>
        </div>

        <div className="pt-6">
          {/* 戻るボタン */}
          <Link
            href={route('contact.index')}
            className="flex items-center gap-2 text-gray-500 hover:text-[var(--base-color)] transition-colors"
          >
            <span>←</span>
            <span className="text-sm font-medium">問い合わせページへ戻る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}