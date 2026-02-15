<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Disc;
use App\Models\Edition;
use App\Models\User;
use App\Models\UserStatus;

class TrackerController extends Controller
{
    public function index() {
        $discs = Disc::latestOrder() -> with('editions.userStatus') -> get();
        return view('tracker.index', compact('discs'));
    }

    public function updateStatus(Request $request) {
        UserStatus::updateOrCreate(
            ['user_id' => auth() -> id(), 'edition_id' => $request -> edition_id],
            ['is_purchased' => $request -> is_purchased, 'is_wishlist' => $request -> is_wishlist]
        );
    }
}
