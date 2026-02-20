<?php

namespace App\Observers;

use App\Models\UserRandom;
use Illuminate\Support\Facades\Storage;

class UserRandomObserver
{

    /**
     * 更新される直前に実行される（updating）
     */
    public function updating(UserRandom $userRandom): void
    {
        // 1. image_url が変更されるかチェック
        if ($userRandom->isDirty('image_url')) {

            // 2. 変更前の「古いURL」を取得
            $oldUrl = $userRandom->getOriginal('image_url');

            if ($oldUrl) {
                // 3. URLからストレージ内のパスを特定
                // （ドメイン部分を削って 'RandomItem/filename.jpg' の形にする）
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('supabase');
                $baseUrl = $disk->url('');
                $oldPath = str_replace($baseUrl, '', $oldUrl);

                // 4. Supabaseから削除
                if (Storage::disk('supabase')->exists($oldPath)) {
                    Storage::disk('supabase')->delete($oldPath);
                }
            }
        }
    }

    /**
     * Handle the UserRandom "created" event.
     */
    public function created(UserRandom $userRandom): void
    {
        //
    }

    /**
     * Handle the UserRandom "updated" event.
     */
    public function updated(UserRandom $userRandom): void
    {
        //
    }

    /**
     * Handle the UserRandom "deleted" event.
     */
    public function deleted(UserRandom $userRandom): void
    {
        if ($userRandom->image_url) {
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('supabase');
            $baseUrl = $disk->url('');
            $path = str_replace($baseUrl, '', $userRandom->image_url);
            Storage::disk('supabase')->delete($path);
        }
    }

    /**
     * Handle the UserRandom "restored" event.
     */
    public function restored(UserRandom $userRandom): void
    {
        //
    }

    /**
     * Handle the UserRandom "force deleted" event.
     */
    public function forceDeleted(UserRandom $userRandom): void
    {
        //
    }
}
