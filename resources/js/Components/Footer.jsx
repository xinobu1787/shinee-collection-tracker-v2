import { Link, usePage } from "@inertiajs/react";
import React from "react";

export default function Footer() {

    const { url } = usePage();

    return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 py-3 flex justify-around items-center shadow-lg z-[2000]">

        {/*-- トラッカー --*/}
        <Link
            href="/tracker"
            className={`text-xs flex flex-col items-center gap-1 ${
                    url.startsWith('/tracker') ? 'text-green-500' : 'text-gray-400'
            }`}
        >
            <span className="material-symbols-outlined"
                style={{ fontVariationSettings: url.startsWith('/tracker') ? "'FILL' 1" : "'FILL' 0" }}>
                diamond
            </span>
            <span className="font-bold">トラッカー</span>
        </Link>

        {/*-- ランダム管理 --*/}
        <Link
            href="/random"
            className={`text-xs flex flex-col items-center gap-1 ${
                    url.startsWith('/random') ? 'text-green-500' : 'text-gray-400'
            }`}
        >
            <span className="material-symbols-outlined"
                style={{ fontVariationSettings: url.startsWith('/random') ? "'FILL' 1" : "'FILL' 0" }}>
                style
            </span>
            <span className="font-bold">ランダム管理</span>
        </Link>

        {/*-- マイページ --*/}
        <Link
            href="/mypage"
            className={`text-xs flex flex-col items-center gap-1 ${
                    url.startsWith('/mypage') ? 'text-green-500' : 'text-gray-400'
            }`}
        >
            <span className="material-symbols-outlined"
                style={{ fontVariationSettings: url.startsWith('/mypage') ? "'FILL' 1" : "'FILL' 0" }}>
                person
            </span>
            <span className="font-bold">マイページ</span>
        </Link>

        {/*-- 問い合わせ --*/}
        <Link
            href="/contact"
            className={`text-xs flex flex-col items-center gap-1 ${
                    url.startsWith('/contact') ? 'text-green-500' : 'text-gray-400'
            }`}
        >
            <span className="material-symbols-outlined"
                style={{ fontVariationSettings: url.startsWith('/contact') ? "'FILL' 1" : "'FILL' 0" }}>
                mail
            </span>
            <span className="font-bold">問合せ</span>
        </Link>

    </nav>
    );
}