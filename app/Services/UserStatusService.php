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
    $status['jp'] = $this->calRate(['country' => 'Japan'], $userId);
    $status['kr'] = $this->calRate(['country' => 'Korea'], $userId);

    return $status;
  }

  /**
   * アーティスト・国別の購入率計算
   */
  private function calRate(array $cate, int $userId)
  {
    //該当の全形態数
    $total = Edition::whereHas('disc', function ($q) use ($cate) {
      foreach ($cate as $column => $value) {
        $q->where($column, $value);
      }
    })->count();


    //ユーザーが所持済の数
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