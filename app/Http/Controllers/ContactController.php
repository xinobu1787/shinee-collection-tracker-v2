<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Models\Contact;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact/Index');
    }

    //送信処理
    public function store(ContactRequest $request)
    {
        // 1.バリデーション
        $validated = $request->validated();

        try {
            // 2.処理
            Contact::create($validated);

            // 3.完了画面へリダイレクト
            return redirect()->route('contact.thanks');
        } catch (\Exception $e) {
            Log::error('問い合わせ保存失敗: ' . $e->getMessage());

            // 前の画面に戻して、エラーメッセージを表示させる
            return back()->withInput()->withErrors(['error' => '送信に失敗しました。時間をおいて再度お試しください。']);
        }
    }

    //問い合わせ完了画面の表示
    public function thanks()
    {
        return Inertia::render('Contact/Thanks');
    }
}
