<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

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
                'max:255',
                'regex:/^[a-zA-Z0-9ぁ-んァ-ヶー一-龠々\s]+$/u',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
            ],
            'subject' => [
                'required',
                'string',
                'max:255',
            ],
            'body' => [
                'required',
                'string',
                'max:10000',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'お名前',
            'email' => 'メールアドレス',
            'subject' => '件名',
            'body' => 'お問い合わせ内容',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'お名前は必須項目です。入力してください。',
            'name.regex' => 'お名前は漢字、ひらがな、カタカナ、英数字で入力してください。',
            'name.max' => 'お名前は255文字以内で入力してください。',
            'email.required' => 'メールアドレスは必須項目です。入力してください。',
            'email.email' => '正しいメールアドレスの形式で入力してください。',
            'email.max' => 'メールアドレスは255文字以内で入力してください。',
            'subject.required' => '件名は必須項目です。入力してください。',
            'subject.max' => '件名は255文字以内で入力してください。',
            'body.required' => 'お問い合わせ内容を入力してください。',
            'body.max' => 'お問い合わせ内容は10000字以内でお願いします。',
        ];
    }
}
