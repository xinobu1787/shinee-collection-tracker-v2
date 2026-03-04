import React from 'react';
import PrimaryButton from '@/Components/Breeze/PrimaryButton';
import SecondaryButton from '@/Components/Breeze/SecondaryButton';
import { Link } from '@inertiajs/react';

export default function LoginModal({ show, onClose }) {
    if (!show) return null; // showがfalseなら何も出さない

    return (
        // z-indexを2000にして、既存のディスクモーダル(1000)より確実に上に持ってくる
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            {/* 白い箱部分：stopPropagationでクリックしても閉じないようにする */}
            <div
                className="w-[90%] max-w-md bg-white p-8 rounded-[2rem] shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-gray-900">ログインが必要です</h2>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                    フラグを更新したり、ウィッシュリストに保存するには<br />
                    ログインが必要です。
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <SecondaryButton onClick={onClose}>
                        あとで
                    </SecondaryButton>
                    <Link href={route('login', { redirect: window.location.pathname })}>
                        <PrimaryButton>ログインする</PrimaryButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}