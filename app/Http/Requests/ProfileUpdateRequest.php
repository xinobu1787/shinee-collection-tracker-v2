<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:20',
                'regex:/^[a-zA-Z0-9ぁ-んァ-ヶー一-龠々]+$/u',
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:50',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'icon_url' =>  [
                'nullable',
                'image',     // jpg, png, bmp, gif, svg, webpであることを確認
                'mimes:jpeg,png,jpg',
                'max:2048',
            ],
        ];
    }
}
