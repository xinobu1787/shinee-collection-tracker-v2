import React from 'react';
import Modal from '@/Components/Modal'; // Breeze標準のモーダル
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link } from '@inertiajs/react';

export default function LoginModal({ show, onClose }) {
  return (
    <Modal show={show} onClose={onClose} maxWidth="sm">
      <div className="p-6 text-center">
        <h2 className="text-lg font-bold text-gray-900">ログインが必要です</h2>
        <p className="mt-4 text-sm text-gray-600">
          フラグを更新したり、ウィッシュリストに保存するには<br />
          ログインが必要です。
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <SecondaryButton onClick={onClose}>
            あとで
          </SecondaryButton>
          {/* Linkコンポーネントでログイン画面へ */}
          <Link href={route('login')}>
            <PrimaryButton>ログインする</PrimaryButton>
          </Link>
        </div>
      </div>
    </Modal>
  );
}