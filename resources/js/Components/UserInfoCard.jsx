import React from 'react';

export default function UserInfoCard({ user }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 flex items-center gap-6 border border-[#e0f7f4]">
      {/* ユーザーアイコン（なければ仮の宝石） */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl shadow-inner">
        {user.icon_url ? (
          <img src={user.icon_url} alt="" className="w-full h-full rounded-full object-cover" />
        ) : (
          "💎"
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">My Profile</p>
        <h2 className="text-2xl font-black text-gray-800">
          {user.name} <span className="text-sm font-normal text-gray-500">さん</span>
        </h2>
        <div className="mt-2 flex gap-2">
          {/* 編集画面へのクイックリンク */}
          <a href="/profile" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-3 rounded-full transition">
            設定を変更
          </a>
        </div>
      </div>
    </div>
  );
}