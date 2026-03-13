import React from 'react';
import BaseCard from '../BaseCard';

export default function BadgeSection({ status }) {
  // バッジ表示用のマスタデータ
  const badgeMaster = [
    { id: 'hello', name: 'Hello', icon: 'waving_hand' },
    { id: 'odd', name: 'Odd', icon: 'wb_sunny' },
    { id: 'poet', name: 'Poet', icon: 'menu_book' },
    // 今後ここに追加するだけでOK！
  ];

  return (
    <BaseCard title="Collection Badges">

      {/* バッジを並べるコンテナ */}
      <div className="flex flex-wrap justify-center gap-6 p-4 w-full">
        {badgeMaster.map((m) => {
          // サーバーからの $status['badges'] の中身を参照して判定
          const isUnlocked = status.badges?.[m.id] || false;

          return (
            <div
              key={m.id}
              className={`
                      flex flex-col items-center gap-2 flex-none w-[4.5rem] transition-all duration-500
                      ${isUnlocked
                  ? 'grayscale-0 opacity-100 text-[#81d4af] animate-badge-pop'
                  : 'grayscale opacity-20 text-gray-400'}
                      `}
            >
              {/* アイコン部分の枠 */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-100">
                <span className="material-symbols-outlined text-3xl">
                  {m.icon}
                </span>
              </div>

              {/* バッジ名 */}
              <span className="text-[10px] font-black text-center leading-tight tracking-tighter">
                {m.name}
              </span>
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
}