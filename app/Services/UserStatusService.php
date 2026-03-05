<?php

namespace App\Services;

use App\Models\Edition;
use App\Models\UserStatus;

class UserStatusService
{
  /**
   * 統計データの集計ロジック
   */
  public function getStatus(int $userId): array
  {
    //1.全体の進捗率
    $totalCount = Edition::count();
    $ownedCount = UserStatus::where('user_id', $userId)
      ->where('is_purchased', true)
      ->count();

    $status = [
      'total' => $totalCount > 0 ? round(($ownedCount / $totalCount) * 100) : 0,
    ];

    //2.メンバー別の進捗率
    $members = ['Onew', 'Jonghyun', 'Key', 'Minho', 'Taemin'];
    foreach ($members as $name) {
      $status[$name] = $this->calRate(['artist' => $name], $userId);
    }

    //3.国別の進捗率
    $status['jp'] = $this->calRate(['country' => 'jp'], $userId);
    $status['kr'] = $this->calRate(['country' => 'kr'], $userId);

    //4.バッジ用
    $status['badges'] = [
      'hello' => $status['total'] >= 5,
      'odd' => $status['total'] >= 50,
      'poet' => $status['Jonghyun'] >= 100,
    ];

    return $status;
  }

  /**
   * アーティスト・国別の購入率計算
   */
  private function calRate(array $cate, int $userId)
  {
    // リレーション先(disc)の条件でEditionを絞り込み、分母(total)を算出
    $total = Edition::whereHas('disc', function ($q) use ($cate) {
      foreach ($cate as $column => $value) {
        $q->where($column, $value);
      }
    })->count();

    // ユーザーの状態(is_purchased)かつ、条件に合うものを分子(owned)として算出
    $owned = UserStatus::where('user_id', $userId)
      ->where('is_purchased', true)
      ->whereHas('edition.disc', function ($q) use ($cate) {
        foreach ($cate as $column => $value) {
          $q->where($column, $value);
        }
      })->count();

    return $total > 0 ? round(($owned / $total) * 100) : 0;
  }
}
