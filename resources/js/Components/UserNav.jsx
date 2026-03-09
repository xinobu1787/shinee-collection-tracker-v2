import React from 'react';
import { Link } from '@inertiajs/react';

export default function UserNav({ auth }) {

  const navLinkClass = `
    bg-white border
    border-solid border-[var(--member-color)]
    rounded-[2rem] py-[0.4rem] px-[1rem]
    text-[0.8rem] text-[#666]
    shadow-sm
    transition-all duration-200 ease-in-out
    hover:-translate-y-[1px] hover:bg-[#f0fdfa]
`;

  return (
    <nav className="w-full flex justify-end gap-4 px-4">
      {auth.user ? (
        // ログイン中の表示
        <Link href={route('logout', { redirect: window.location.pathname })} method="post" as="button"
          className={navLinkClass}
        >
          ログアウト
        </Link>
      ) : (
        // ゲストの表示
        <>
            <Link href={route('login', { redirect: window.location.pathname })} className={navLinkClass}>
            ログイン
          </Link>

            <Link href={route('register', { redirect: window.location.pathname })} className={navLinkClass}>
            新規登録
          </Link>
        </>
      )}
    </nav>
  );
}