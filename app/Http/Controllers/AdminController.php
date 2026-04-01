<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Disc;
use App\Models\Edition;
use App\Models\RandomItem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request) {

    $tab = $request->query('tab', 'discs');
    $data = match ($tab) {
         'discs' => Disc::with('editions')->get(),
         'editions' => Edition::with('disc')->get(),
         'random_items' => RandomItem::with(['disc', 'edition'])->get(),
         'users' => User::all(),
         'contacts' => Contact::all(),
         default => [],     // 想定外の値が入ってエラーになるのを防ぐため
    };

        return Inertia::render('Admin/Index', [
            'selectTab' => $tab,
            'masterData' => $data,
        ]);
    }

    public function store() {
        //
    }

    public function update() {
        //
    }

    public function destroy() {
        //
    }
}
