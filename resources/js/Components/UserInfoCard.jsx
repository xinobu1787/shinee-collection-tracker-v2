import React from 'react';

export default function UserInfoCard({ user }) {
  return (
    <div className="mx-4 my-4 p-6 bg-white rounded-[2rem] shadow-sm border border-[#e8f5e9]">
      <h2 className="text-[#81d4af] font-bold text-xl mb-4">My Profile</h2>

      {/* ユーザーアイコン（なければ仮の宝石） */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl shadow-inner">
          {user.icon_url ? (
            <img src={user.icon_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            "💎"
          )}
        </div>


        <div className="flex-1 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-black text-gray-800 leading-tight">
            {user.name} <span className="text-sm font-normal text-gray-500">さん</span>
          </h3>
          <div className="flex-shrink-0">
            {/* 編集画面へのクイックリンク */}
            <a href="/profile" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-3 rounded-full transition">
              設定を変更
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}