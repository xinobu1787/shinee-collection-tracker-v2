<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RandomItemUploadRequest extends FormRequest
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
            'item_id' => [
                'required',
                'exists:random_items,id'
            ],
            'image' => [
                'required',
                'image',     // jpg, png, bmp, gif, svg, webpであることを確認
                'mimes:jpeg,png,jpg',
                'max:2048',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'item_id' => 'アイテムID',
            'image' => '画像',
        ];
    }

    public function messages(): array
    {
        return [
            'item_id.required' => 'アイテムの特定に失敗しました。もう一度やり直してください。',
            'item_id.exists'   => '指定されたアイテムが見つかりませんでした。',
            'image.required' => '画像を添付してください。',
            'image.image' => '画像ファイルをアップロードしてください。',
            'image.mimes' => 'アップロード可能な拡張子はjpeg・png・jpgです。',
            'image.max' => 'アップロード可能なファイルサイズは2MBまでです。',
        ];
    }
}
