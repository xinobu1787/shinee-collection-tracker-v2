import React from 'react';
import BaseCard from '../BaseCard';

export default function ProgressSection({ status, memberConfig }) {
  return (
    <BaseCard title="Collection Progress">

      {/* トータル進捗バー */}
      <div className="relative w-full h-20 bg-gray-100 rounded-[2rem] overflow-hidden shadow-inner">
        {/* ゲージ部分 */}
        <div
          className="h-full bg-[#81d4af] flex items-center justify-center transition-all duration-1000 ease-out"
          style={{ width: `${status.total}%` }}
        >
          <span className="text-white font-bold text-lg">
            {status.total}%
          </span>
        </div>
      </div>

      {/* メンバー別円形進捗バー */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 my-8">
        {memberConfig.map((member) => (
          <div key={member.key} className="flex flex-col items-center w-[calc(33.33%-1rem)] min-w-[90px] md:flex-1">
            <div
              className={`circle-progress ${member.className} shadow-sm`}
              style={{ '--percent': `${status[member.key]}%` }}
            >
              <span className="kaomoji absolute inset-0 flex items-center justify-center z-10">{member.emoji}</span>

              <span className="absolute bottom-6 w-full text-center text-[11px] font-black text-[#81d4af] z-10 tracking-tighter">
                {status[member.key]}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 国別進捗バー：横に2つ並べる */}
      <div className="flex flex-row justify-between gap-4 mt-4 mb-8">
        {[
          { label: 'JP', key: 'jp' },
          { label: 'KR', key: 'kr' }
        ].map((country) => (
          /* 2.各国の枠 */
          <div key={country.key} className="flex-1 flex items-center min-h-[3rem] relative">

            {/* 3.バーの背景 */}
            <div className="flex-1 h-[2.8rem] bg-[#f0f0f0] rounded-[1.2rem] overflow-hidden flex shadow-inner">

              {/* 4.伸びるバー本体 */}
              <div
                className="h-full bg-[#81d4af] flex items-center justify-between px-4 transition-all duration-1000 ease-in-out min-w-[5rem]"
                style={{ width: `${status[country.key]}%` }}
              >
                {/* 5.バーの中のラベル */}
                <span className="text-white text-sm font-black italic tracking-wider flex-shrink-0 leading-none">
                  {country.label}
                </span>

                {/* 6.バーの中の数字 */}
                <span className="text-white text-[0.75rem] font-bold drop-shadow-sm flex-shrink-0 leading-none">
                  {status[country.key]}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>

  );
}