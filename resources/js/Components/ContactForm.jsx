import React from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from './Breeze/InputLabel';
import InputError from './Breeze/InputError';
import TextInput from './Breeze/TextInput';
import PrimaryButton from './Breeze/PrimaryButton';

export default function ContactForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',    // お名前
    email: '',   // メールアドレス
    subject: '', // 件名
    body: '',    // お問い合わせ内容
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('contact.store'), {
      onSuccess: () => reset(), // 送信成功したらフォームを空にする
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <InputLabel htmlFor="name" value="お名前" />
        <TextInput
          id="name"
          type="text"
          value={data.name}
          className="mt-1 block w-full"
          placeholder="SHINee World Name"
          onChange={(e) => setData('name', e.target.value)}
        />
        <InputError message={errors.name} className="mt-2" />
      </div>

      <div>
        <InputLabel htmlFor="email" value="メールアドレス" />
        <TextInput
          id="email"
          type="email"
          value={data.email}
          className="mt-1 block w-full"
          placeholder="example@mail.com"
          onChange={(e) => setData('email', e.target.value)}
        />
        <InputError message={errors.email} className="mt-2" />
      </div>

      <div>
        <InputLabel htmlFor="subject" value="件名" />
        <TextInput
          id="subject"
          type="text"
          value={data.subject}
          className="mt-1 block w-full"
          placeholder="件名をご入力ください"
          onChange={(e) => setData('subject', e.target.value)}
        />
        <InputError message={errors.subject} className="mt-2" />
      </div>

      <div>
        <InputLabel htmlFor="body" value="お問い合わせ内容" />
        <textarea
          id="body"
          value={data.body}
          placeholder="お問い合わせ内容をご入力ください"
          className="mt-1 block w-full border-solid border-gray-300 focus:border-[var(--base-color)] focus:ring-[var(--base-color)] rounded-md shadow-sm"
          rows="5" // ここで高さを調整
          onChange={(e) => setData('body', e.target.value)}
        ></textarea>
        <InputError message={errors.body} className="mt-2" />
      </div>

      <div className="flex items-center justify-end mt-4">
        <PrimaryButton className="ml-4" disabled={processing}>
          送信する
        </PrimaryButton>
        <InputError message={errors.error} className="mt-2" />
      </div>
    </form>
  );
 }