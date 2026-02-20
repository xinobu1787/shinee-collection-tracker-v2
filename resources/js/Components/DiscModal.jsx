import React, { useState } from 'react';

// isOpen: 開いているか, onClose: 閉じる処理, disc: 表示するデータ
export default function DiscModal({ isOpen, onClose, disc }) {
    const [activeDetail, setActiveDetail] = useState(null);

    if (!isOpen || !disc) return null; // 開いていない時は何も出さない

    // トグル関数（Java版の toggleDetail に相当）
    const toggleDetail = (editionId, type) => {
        if (activeDetail?.id === editionId && activeDetail?.type === type) {
            setActiveDetail(null); // 同じボタンを押したら閉じる
        } else {
            setActiveDetail({ id: editionId, type: type }); // 新しく開く
        }
    };

    // discの中にぶら下がっている形態（editions）を取り出す
    const editions = disc.editions || [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagationで中身をクリックしても閉じないようにする */}
            <div id="modal-body" onClick={(e) => e.stopPropagation()}>

                {/* ヘッダー部分 */}
                <div className="modal-header-section">
                    <div className="modal-title-row">
                        <span className="modal-main-title">{disc.title}</span>
                        {disc.title_sub && <span className="modal-sub-title">{disc.title_sub}</span>}
                    </div>
                </div>

                {/* 形態（エディション）一覧： */}
                <div className="mt-4">
                    {editions.map((ed) => (
                        <div key={ed.id}>
                            {/* labelを使うことでBOX全体をチェック可能にするJava版の知恵を継承！ */}
                            <label className="edition-box">
                                <input
                                    type="checkbox"
                                    className="purchase-checkbox"
                                    checked={ed.user_status?.is_purchased} // 所持状態
                                    onChange={() => console.log(ed.id, "の所持状態を更新")}
                                    style={{ display: 'none' }}
                                />

                                <span className="edition-name">{ed.display_name || '通常盤'}</span>

                                <div className="edition-controls">
                                    {/* 曲リストボタン */}
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
                                    <button className={`btn-circle wishlist-btn ${ed.wishlist ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); console.log('ウィッシュリスト'); }}>
                                        <span className="material-symbols-outlined">
                                            {ed.wishlist ? 'shopping_cart' : 'add_shopping_cart'}
                                        </span>
                                    </button>
                                </div>
                            </label>

                            {/* 3. 詳細表示用の箱（隠し要素） */}
                            {/* ここは後で「クリックしたら開く」状態管理を作ろうね */}
                            <div>
                                {activeDetail?.id === ed.id && (
                                <div className="edition-detail">
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

                <button onClick={onClose} className="mt-4 text-gray-400 text-sm w-full text-center">
                    閉じる
                </button>
            </div>
        </div>
    );
}

// 4. トラックリストを整形する専用の部品（同じファイル内に書いてOK）
function TrackList({ tracklist }) {
    if (!tracklist) return <p className="no-data">No Tracklist</p>;

    // Java版のロジックを継承：'///' でDISCごと、',' で曲ごとに分割
    const discUnits = tracklist.split('///');

    return (
        <>
            {discUnits.map((discContent, index) => {
                const tracks = discContent.split(',').filter(t => t.trim() !== "");
                return (
                    <div key={index} className="disc-unit mb-3 last:mb-0">
                        {discUnits.length > 1 && (
                            <h4 className="disc-label text-xs font-bold text-teal-600 mb-1">DISC {index + 1}</h4>
                        )}
                        <ul className="track-list space-y-1">
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

// 5. 詳細情報（ⓘ）を整形する専用の部品
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
                <div className="remarks-box mt-4 p-3 bg-white rounded-lg border border-dashed border-gray-200 text-xs text-gray-500 italic">
                    <strong>備考:</strong> {ed.remarks}
                </div>
            )}
        </div>
    );
}