import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import LoginModal from '@/Components/LoginModal';
import InputError from '@/\Components/Breeze/InputError';
import InputSuccess from '@/Components/InputSuccess';
import './DiscModal.css';

// isOpen: 開いているか, onClose: 閉じる処理, disc: 表示するデータ
export default function DiscModal({ isOpen, onClose, disc }) {

    // グローバルデータの取得
    const { props } = usePage();
    const { errors } = props;               // バリデーション等のエラー
    const { success } = props.flash || {};  // 処理成功時の通知
    const auth = props.auth;                // ログイン状態

    // ローカル状態（モーダル内のみで使う一時的な状態）
    const [activeDetail, setActiveDetail] = useState(null);         // 曲リストや詳細の表示切り替え
    const [showLoginModal, setShowLoginModal] = useState(false);    // ゲスト用ログイン誘導

    if (!isOpen || !disc) return null; // 開いていない時は何も出さない



    // --- インタラクション制御 ---

    // ボタンのトグル処理（Java版の toggleDetail に相当）
    const toggleDetail = (editionId, type) => {
        if (activeDetail?.id === editionId && activeDetail?.type === type) {
            setActiveDetail(null);                              // 同じボタンを押したら閉じる
        } else {
            setActiveDetail({ id: editionId, type: type });     // 新しく開く
        }
    };

    // discの中にぶら下がっている形態（editions）を取り出す
    const editions = disc.editions || [];

    //ログインガード機能
    //ユーザー操作（所持チェック等）の前に認証状態を確認する
    const checkAuthAndExecute = (action) => {
        console.log("今のauthの状態:", auth);
        if (!auth || !auth.user) {
            setShowLoginModal(true);    // ゲストならモーダルを出す
            return;
        }
        action();                       // ログイン済みなら本来の処理を実行
    };

    return (
        <>
            <LoginModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
            <div className="fixed inset-0 w-full h-full bg-white/80 backdrop-blur-sm flex justify-center items-center z-[1000]" onClick={onClose}>
                {/* stopPropagationで中身をクリックしても閉じないようにする */}
                <div className="w-[38rem] max-w-[92vw] h-auto max-h-[85vh] overflow-y-auto bg-white p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] m-auto" onClick={(e) => e.stopPropagation()}>

                    {/* ヘッダー部分 */}
                    <div className="w-full mb-8 border-b-2 border-[#f0f0f0] pb-4">
                        <div className="modal-title-row">
                            <span className="text-[1.2rem] font-bold">{disc.title}</span>
                            {disc.title_sub && <span className="text-[0.8rem] text-[#888]">{disc.title_sub}</span>}
                        </div>
                    </div>

                    {/* 形態（エディション）一覧： */}
                    <div className="mt-4">
                        {editions.map((ed) => (
                            <div key={ed.id}>
                                {/* labelを使うことでBOX全体をチェック可能にするJava版を継承 */}
                                <label className="edition-box">
                                    {/* 所持チェック入力
                                        router.patch を使用し、非同期でサーバーへ状態を送信。
                                        preserveScroll を有効にし、ユーザーの視点を維持したまま更新を行う。
                                    */}
                                    <input
                                        type="checkbox"
                                        className="purchase-checkbox"
                                        checked={ed.user_status?.is_purchased} // 所持状態
                                        onChange={(e) => {
                                            e.stopPropagation(); // ←詳細モーダルまで反応してしまう場合まず親への伝播を止める
                                            checkAuthAndExecute(() => {
                                                router.patch(route('tracker.update'), {
                                                    edition_id: ed.id,
                                                    is_purchased: !ed.user_status?.is_purchased,
                                                    is_wishlist: !!ed.user_status?.is_wishlist // 今の状態を維持
                                                }, {
                                                    preserveScroll: true, // 画面がガクッと動かないようにする
                                                });
                                            })
                                        }}
                                        style={{ display: 'none' }}
                                    />

                                    <span className="font-bold text-[1.05rem] whitespace-normal flex-shrink mr-2 line-clamp-2">{ed.display_name || '通常盤'}</span>

                                    <div className="flex gap-2 flex-shrink-0 ml-auto">
                                        {/* トラックリストボタン */}
                                        <button
                                            className={`btn-circle ${activeDetail?.id === ed.id && activeDetail?.type === 'track' ? 'active-btn' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); toggleDetail(ed.id, 'track'); }}
                                        >
                                            <span className="material-symbols-outlined">queue_music</span>
                                        </button>
                                        {/* 詳細情報ボタン */}
                                        <button
                                            className="btn-circle"
                                            onClick={(e) => { e.stopPropagation(); toggleDetail(ed.id, 'info'); }}
                                        >
                                            <span className="material-symbols-outlined">info</span>
                                        </button>
                                        {/* ウィッシュリストボタン */}
                                        <button
                                            className={`btn-circle wishlist-btn ${ed.user_status?.is_wishlist ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                checkAuthAndExecute(() => {
                                                    router.patch(route('tracker.update'), {
                                                        edition_id: ed.id,
                                                        is_wishlist: !ed.user_status?.is_wishlist,
                                                        is_purchased: !!ed.user_status?.is_purchased
                                                    }, {
                                                        preserveScroll: true,
                                                    });
                                                })
                                            }}
                                        >
                                            <span className="material-symbols-outlined">
                                                {ed.user_status?.is_wishlist ? 'bookmark_added' : 'bookmark_add'}
                                            </span>
                                        </button>
                                    </div>
                                </label>

                                {/* 詳細表示用の箱（隠し要素） */}
                                <div>
                                    {activeDetail?.id === ed.id && (
                                        <div className="w-[95%] mx-auto mb-4 p-[0.5rem_1rem] bg-[#fdfdfd] border border-[#eee] border-t-0 rounded-b-[1rem] text-[0.9rem] leading-[1.5] animate-slideDown">
                                            {activeDetail.type === 'track' ? (
                                                <TrackList tracklist={ed.tracklist} />
                                            ) : (
                                                <InfoContent ed={ed} />
                                            )}

                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <InputSuccess message={success} className="mt-4 text-center" />
                    <InputError message={errors.error} className="mt-4 text-center" />
                    <button onClick={onClose} className="mt-4 text-gray-400 text-sm w-full text-center">
                        閉じる
                    </button>
                </div>
            </div>

        </>
    );
}


// --- 以下、DiscModal内でのみ使用する Presentational Components ---
// 他の画面での再利用予定がないため、見通しを重視して同一ファイル内にカプセル化

// トラックリストを整形する専用の部品
function TrackList({ tracklist }) {
    if (!tracklist) return <p className="no-data">No Tracklist</p>;

    // Java版のロジックを継承：'///' でDISCごと、',' で曲ごとに分割
    const discUnits = tracklist.split('///');

    return (
        <>
            {discUnits.map((discContent, index) => {
                const tracks = discContent.split(',').filter(t => t.trim() !== "");
                return (
                    <div key={index} className="mb-3 last:mb-0">
                        {discUnits.length > 1 && (
                            <h4 className="text-sm text-[#666] mb-1 border-b border-[#eee]">DISC {index + 1}</h4>
                        )}
                        <ul className="track-list">
                            {tracks.map((t, i) => (
                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                    <span className="font-mono">{String(i + 1).padStart(2, '0')}.</span>
                                    {t.trim()}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </>
    );
}

// 詳細情報（ⓘ）を整形する専用の部品
function InfoContent({ ed }) {
    // 1. 価格のフォーマット処理
    const formattedPrice = ed.price ? new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: ed.currency || 'JPY'
    }).format(ed.price) : null;

    return (
        <div className="info-content space-y-3 text-sm text-gray-700">
            {/* 価格表示 */}
            {formattedPrice && (
                <p className="info-item">
                    <strong className="text-teal-600 mr-2">価格:</strong>
                    {formattedPrice}
                </p>
            )}

            {/* 特典情報：カンマで区切ってリスト表示 */}
            {ed.benefit && (
                <p className="info-item">
                    <strong className="text-teal-600">特典:</strong><br />
                    <span className="inline-block mt-1 pl-2 border-l-2 border-teal-100">
                        {ed.benefit.split(',').map((item, i) => (
                            <React.Fragment key={i}>
                                {item.trim()}<br />
                            </React.Fragment>
                        ))}
                    </span>
                </p>
            )}

            {/* 映像内容 */}
            {ed.video_content && (
                <p className="info-item">
                    <strong className="text-teal-600">映像内容:</strong><br />
                    <span className="inline-block mt-1 pl-2 border-l-2 border-teal-100">
                        {ed.video_content.split(',').map((item, i) => (
                            <React.Fragment key={i}>
                                {item.trim()}<br />
                            </React.Fragment>
                        ))}
                    </span>
                </p>
            )}

            {/* 備考 */}
            {ed.remarks && (
                <div className="mt-4 p-3 bg-[#fff9e6] rounded-lg border border-dashed border-gray-200 text-xs text-gray-500">
                    <strong>備考:</strong> {ed.remarks}
                </div>
            )}
        </div>
    );
}