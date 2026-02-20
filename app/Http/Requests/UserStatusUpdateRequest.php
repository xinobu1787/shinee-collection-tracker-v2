<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UserStatusUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // どのディスクのフラグを変えるか。editionsテーブルに存在するかチェック
            'edition_id' => [
                'required',
                'exists:editions,id'
            ],
            // フラグが0か1、またはtrue/falseであること
            'is_purchased' => [
                'required',
                'boolean'
            ],
            // 「欲しい（wishlist）」フラグ。同じくboolean
            'is_wishlist' => [
                'required',
                'boolean'
            ],
        ];
    }
}
