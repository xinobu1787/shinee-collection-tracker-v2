import React, { useMemo } from 'react';
import FilterButton from '@Components/FilterButton';
import SortButton from '@Components/SortButton';
import { artistOptions, countryOptions, purchasedOptions, sortOptions } from '@/options';

export default function RefineBar({ allDiscs, filters, setFilters }) {

  // 1. データからカテゴリー一覧を抽出するロジック
  const categoryOptions = useMemo(() => {
    // データがまだ無い時のための安全策
    if (!allDiscs || allDiscs.length === 0) {
      return [{ value: 'All', label: 'All Category' }];
    }

    // Java版のロジックを移植：flatMap と split('/') の合わせ技！
    const allCategoriesRaw = allDiscs.flatMap(disc => {
      if (!disc.category) return [];
      // 「Mini/Album」を ["Mini", "Album"] に分割
      return disc.category.split('/');
    });

    // 重複を削除して、プルダウン用の形式 { value, label } に変換
    const uniqueCategories = [...new Set(allCategoriesRaw)];

    // 「All」を先頭に追加して完成
    return [
      { value: 'All', label: 'All Category' },
      ...uniqueCategories.map(cat => ({
        value: cat,
        label: cat
      }))
    ];
  }, [allDiscs]); // allDiscsが書き換わった時だけ再計算するよ

  return (
    <nav className="flex flex-wrap justify-center gap-[0.8rem] py-[1.5rem] px-[1rem] w-[95%] max-w-[55rem] my-[1rem] mx-auto">
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