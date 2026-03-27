<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserStatus;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => '管理者',
            'email' => 'admin@example.com',
            'password' => Hash::make('adminPW'),
        ]);

        // 最初の数件だけ、テスト用に「所持」にしておく
        // UserStatus::create([
        //     'user_id' => $user->id,
        //     'edition_id' => 101, // 存在するIDを適当に
        //     'is_purchased' => true,
        //     'is_wishlist' => false,
        // ]);
    }
}
