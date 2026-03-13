import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
// import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import BaseCard from '@/Components/BaseCard';
import Header from '@/Components/Header';

export default function Edit({ status }) {
    return (
        <div>
            <Head title="ユーザー情報 - SHINee Collection Tracker" />

            {/* ヘッダー・コンポーネントに置き換え */}
            <Header title="Profile Information" />

            <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">
                <BaseCard title="ユーザー情報編集">
                    <UpdateProfileInformationForm
                        status={status}
                        className="max-w-xl"
                    />
                </BaseCard>


                {/*<div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>*/}

                <BaseCard title="退会">
                    <DeleteUserForm className="max-w-xl" />
                </BaseCard>


                {/* カードの外に「戻る」を配置 */}
                <div className="mt-8 flex justify-center">
                    <Link
                        href={route('mypage')} // マイページのルートへ
                        className="flex items-center gap-2 text-gray-500 hover:text-[var(--base-color)] transition-colors"
                    >
                        <span>←</span>
                        <span className="text-sm font-medium">マイページへ戻る</span>
                    </Link>
                </div>
            </main>
        </div>

    );
}
