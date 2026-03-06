import React from 'react';
import FilterButton from '@/Components/SelectButton/FilterButton';
import { memberOptions, typeOptions } from '@/options';
import { router } from '@inertiajs/react';
import './RandomRefine.css'

export default function RandomRefine({
  artists,
  selected_artist,
  discs,
  selected_disc,
  editions,
  selected_type,
  filters,
  setFilters
}) {

  // アーティストが選ばれた時の処理（URLを書き換えてリロードする）
  const handleArtistChange = (e) => {
    router.get('/random-dev', { artist: e.target.value }, {
      preserveState: true, // 入力状態をキープ
      replace: true        // 戻るボタンの履歴を増やしすぎない
    });
  };

  // 円盤を選んだ時の処理
  const handleDiscChange = (e) => {
    // アーティストは今の値をキープしつつ、選んだ円盤IDを追加して送る
    router.get('/random-dev', {
      artist: selected_artist, // 現在のアーティスト
      disc_id: e.target.value
    }, {
      preserveState: true,
      replace: true
    });
  };

  // 形態を選んだ時の処理
  const handleEditionChange = (e) => {
    // アーティストは今の値をキープしつつ、選んだ円盤IDを追加して送る
    router.get('/random-dev', {
      artist: selected_artist, // 現在のアーティスト
      disc_id: selected_disc,
      edition_id: e.target.value
    }, {
      preserveState: true,
      replace: true
    });
  };

  return (
    <div>
      <div className="mx-4 my-2 px-6 py-2">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex flex-col gap-4">
            {/* アーティスト選択 */}
            <select
              className="select-box"
              onChange={handleArtistChange}
            >
              <option value="">Select Artist</option>
              {/* Laravelから届いた artists (6人) をループで回して選択肢にする */}
              {artists && artists.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* 円盤選択（追加！） */}
            <select
              className="select-box"
              onChange={handleDiscChange}
              disabled={!discs || discs.length === 0} // 円盤がない時はお休み
            >
              <option value="">Select Disc</option>
              {discs && discs.map((disc) => (
                <option key={disc.id} value={disc.id}>
                  {disc.title}　{disc.title_sub}
                </option>
              ))}
            </select>

            {/* 形態選択（追加！） */}
            <select
              className="select-box"
              onChange={handleEditionChange}
              disabled={!editions || editions.length === 0} // 円盤がない時はお休み
            >
              <option value="">Select Edition</option>
              {editions && editions.map((ed) => (
                <option key={ed.id} value={ed.id}>{ed.display_name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-[0.8rem] py-[0.8rem] px-[1rem] w-[95%] max-w-[55rem] my-[0.5rem] mx-auto">
        <FilterButton
          options={memberOptions}
          value={filters.member}
          onChange={(val) => setFilters({ ...filters, member: val })}
        />

        <FilterButton
          options={typeOptions}
          value={filters.selected_type}
          onChange={(val) => setFilters({ ...filters, selected_type: val })}
        />
      </div>

    </div>

  );
}