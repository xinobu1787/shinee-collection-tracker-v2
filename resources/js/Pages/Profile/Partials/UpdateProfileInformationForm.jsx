import InputError from '@/Components/Breeze/InputError';
import InputLabel from '@/Components/Breeze/InputLabel';
import PrimaryButton from '@/Components/Breeze/PrimaryButton';
import TextInput from '@/Components/Breeze/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            icon: null,
            _method: 'patch',
        });

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.update'));
    };



    return (
        <section className={className}>
            <form onSubmit={submit} className="mt-6 space-y-6">

                {/* --- アイコンエリア --- */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">

                    {/* 1. 💎 のエリアを label で囲むのがコツ！ */}
                    <label htmlFor="icon-input" className="cursor-pointer hover:opacity-80 transition">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                            {/* ここでプレビューを表示（後述） */}
                            {data.icon ? (
                                // 新しく選んだ画像があるときはそれを見せる
                                <img src={URL.createObjectURL(data.icon)} className="w-full h-full object-cover" />
                            ) : user.icon_url ? (
                                // 登録済みの画像があればそれ
                                <img src={user.icon_url} className="w-full h-full object-cover" />
                            ) : (
                                "💎"
                            )}
                        </div>
                    </label>

                    {/* 2. ここに「例のコード」を置く（hiddenなのでどこでもいいけど、近くが安心） */}
                    <input
                        id="icon-input"
                        type="file"
                        className="hidden"
                        accept="image/*" // 画像ファイルだけ選べるようにする優しさ
                        onChange={(e) => setData('icon', e.target.files[0])}
                    />

                    <div className="flex flex-col gap-1">
                        <InputLabel value="プロフィールアイコン" />
                        <p className="text-[10px] text-gray-500">💎をクリックして画像を選択</p>
                        <InputError message={errors.icon} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="お名前" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="メールアドレス" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>保存する</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            保存されました。
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
