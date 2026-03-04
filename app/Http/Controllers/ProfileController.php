<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * ユーザー情報編集画面の表示
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * ユーザー情報の編集更新
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // ★ チェック1: バリデーションを通ったあとの値に、iconが含まれているか？
        // dd($request->validated());

        $user = $request->user();
        $user->fill($request->validated());

        try {
            //画像がアップロードされたとき
            if ($request->hasFile('icon_url')) {

                // ★ チェック2: ちゃんと画像ファイルとして認識されているか？
                // dd($request->file('icon'));

                $path = $request->file('icon_url')
                    ->store('UserIcon', 'supabase');

                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('supabase');

                // 一旦、現在のURL（/s3/ が含まれるもの）を取得
                $rawUrl = $disk->url($path);
                // 【ここを追加！】/s3/ を /object/public/ に置換して、表示用のURLにする
                $user->icon_url = str_replace('/s3/', '/object/public/', $rawUrl);
                
            }

            $user->save();

            // ★ チェック3: 保存直前のUserモデルの中身を確認
            // dd($user->toArray());

            return Redirect::route('profile.edit');

        } catch (\Exception $e) {
            Log::error('プロフィール更新失敗: ' . $e->getMessage());
            return back()->withErrors(['error' => '更新に失敗しました。']);
        }
    }

    /**
     * アカウントの削除
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
