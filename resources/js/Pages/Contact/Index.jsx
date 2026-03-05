import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import BaseCard from '@/Components/BaseCard';
import FaqItem from '@/Components/FaqItem';
import ContactForm from '@/Components/ContactForm';

export default function Index() {
  return (
    <div>
      <Head title="問い合わせ - SHINee Collection Tracker" />

                {/* ヘッダー・コンポーネントに置き換え */}
      <Header title="Help & Support" />

      <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">

        <BaseCard title="よくある質問(FAQ)">
          <div className="space-y-2"> {/* アイテム間の余白 */}
            <FaqItem
              question="新規登録は無料ですか？"
              answer="はい！どなたでも無料でご登録いただけます。"
            />
            <FaqItem
              question="ログインは必要ですか？"
              answer="アルバム情報の閲覧はゲスト状態でもご利用いただけますが、所持状態などを管理するためにはログインが必要です。"
            />
            <FaqItem
              question="登録したデータは他の人からも見えますか？"
              answer="いいえ、登録したデータは他の人からは見えません。安心してご活用ください。"
            />
            {/* コピペ用
            <FaqItem
              question=""
              answer=""
            />
             */}
          </div>
        </BaseCard>

        <BaseCard title="お問い合わせフォーム">
          <ContactForm/>
        </BaseCard>

      </main>
      <Footer />
    </div>
  );
}