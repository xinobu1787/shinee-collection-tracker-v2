import React, { useMemo } from 'react';
import FilterButton from '@/Components/SelectButton/FilterButton';
import SortButton from '@/Components/SelectButton/SortButton';
import { artistOptions, countryOptions, purchasedOptions, sortOptions } from '@/options';

export default function RefineBar({ allDiscs, filters, setFilters }) {

  // データからカテゴリー一覧を抽出するロジック
  // useMemo を使い、全データ(allDiscs)に変更があった時のみ再計算することで負荷を軽減
  const categoryOptions = useMemo(() => {
    // データがまだ無い時のための安全策
    if (!allDiscs || allDiscs.length === 0) {
      return [{ value: 'All', label: 'All Category' }];
    }

    // flatMapとsplitを用いて、入れ子になったカテゴリーをフラットな配列に変換
    const allCategoriesRaw = allDiscs.flatMap(disc => {
      if (!disc.category) return [];
      // 「Mini/Album」を ["Mini", "Album"] に分割
      return disc.category.split('/');
    });

    // 重複削除とフォーマット整形
    const uniqueCategories = [...new Set(allCategoriesRaw)];

    return [
      { value: 'All', label: 'All Category' },
      ...uniqueCategories.map(cat => ({
        value: cat,
        label: cat
      }))
    ];
  }, [allDiscs]);

  return (
    <nav className="flex flex-wrap justify-center gap-[0.8rem] py-[1.5rem] px-[1rem] w-[95%] max-w-[55rem] my-[0.5rem] mx-auto">
      {/* onChangeでスプレッド構文 (...filters) を用いて状態を部分更新する */}
      <FilterButton
        options={artistOptions}
        value={filters.artist}
        onChange={(val) => setFilters({ ...filters, artist: val })}
      />

      <FilterButton
        options={countryOptions}
        value={filters.country}
        onChange={(val) => setFilters({ ...filters, country: val })}
      />

      <FilterButton
        options={categoryOptions}
        value={filters.category}
        onChange={(val) => setFilters({ ...filters, category: val })}
      />

      <FilterButton
        options={purchasedOptions}
        value={filters.is_purchased}
        onChange={(val) => setFilters({ ...filters, is_purchased: val })}
      />

      <SortButton
        options={sortOptions}
        value={filters.sort}
        onChange={(val) => setFilters({ ...filters, sort: val })}
      />
    </nav>
  );
}