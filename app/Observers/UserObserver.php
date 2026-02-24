<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UserObserver
{

    public function updating(User $user): void
    {
        // 1. icon_url が変更されるかチェック
        if ($user->isDirty('icon_url')) {

            // 2. 変更前の「古いURL」を取得
            $oldUrl = $user->getOriginal('icon_url');

            if ($oldUrl) {
                // 3. URLからストレージ内のパスを特定
                // （ドメイン部分を削って 'UserIcon/filename.jpg' の形にする）
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
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        //
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        if ($user->icon_url) {
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('supabase');
            $baseUrl = $disk->url('');
            $path = str_replace($baseUrl, '', $user->icon_url);
            Storage::disk('supabase')->delete($path);
        }
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
