<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact/Index');
    }

    //送信処理
    public function store(Request $request)
    {
        // 1.バリデーション
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        // 2.処理(テスト用)
        Log::info('問合わせ受信:', $request->all());

        // 3.完了画面へリダイレクト
        return redirect()->route('contact.thanks');
    }

    //問い合わせ完了画面の表示
    public function thanks()
    {
        return Inertia::render('Contact/Thanks');
    }
}
