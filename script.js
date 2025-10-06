// ==============================================
// 検索機能とページの動的な機能を実装するJavaScriptコード
// ==============================================

/**
 * DOMContentLoadedイベント
 * ページのHTML要素が全て読み込まれたタイミングで実行される
 * 画像などの読み込みを待たずに実行されるので高速
 */
document.addEventListener('DOMContentLoaded', function() {
    // ===== 要素の取得 =====
    // getElementById: IDを指定して要素を1つ取得する
    const searchBox = document.getElementById('searchBox'); // 検索ボックスの要素
    
    // querySelectorAll: CSSセレクタで複数の要素を取得する（配列のように扱える）
    const formulaCards = document.querySelectorAll('.formula-card'); // 全ての公式カード
    const categories = document.querySelectorAll('.category'); // 全てのカテゴリ

    // ===== 検索機能の実装 =====
    /**
     * addEventListener: 要素にイベント（出来事）が起きた時の処理を設定
     * 'input': テキストボックスに文字を入力したときに発生するイベント
     */
    searchBox.addEventListener('input', function() {
        // this.value: 検索ボックスに入力された文字列を取得
        // toLowerCase(): 大文字を小文字に変換（検索を大文字小文字区別なしにするため）
        const searchTerm = this.value.toLowerCase();

        /**
         * forEach: 配列の各要素に対して処理を繰り返す（ループ処理）
         * card: 繰り返しの中で、今処理している公式カードを表す
         */
        formulaCards.forEach(card => {
            // querySelector: カード内から特定の要素（h4タグ）を1つ探す
            // textContent: 要素の中のテキスト（文字）を取得
            const title = card.querySelector('h4').textContent.toLowerCase(); // カードのタイトル
            const content = card.textContent.toLowerCase(); // カードの全ての文字

            // includes(): 文字列に特定の文字が含まれているか調べる（trueかfalse）
            // ||（または）: どちらか一方でもtrueならtrue
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                // 検索語が含まれていたら、カードを表示する
                card.classList.remove('hidden'); // hiddenクラスを削除（表示）
            } else {
                // 含まれていなかったら、カードを非表示にする
                card.classList.add('hidden'); // hiddenクラスを追加（非表示）
            }
        });

        // ===== カテゴリの表示/非表示 =====
        // 公式カードが1つも表示されていないカテゴリは非表示にする
        categories.forEach(category => {
            // :not(.hidden): hiddenクラスがついていない要素を探す
            const visibleCards = category.querySelectorAll('.formula-card:not(.hidden)');
            
            // length: 配列の要素数（個数）
            if (visibleCards.length === 0) {
                // 表示されているカードが0個なら、カテゴリごと非表示
                category.classList.add('hidden');
            } else {
                // 1個でもカードが表示されていたら、カテゴリも表示
                category.classList.remove('hidden');
            }
        });
    });

    // ===== スムーススクロール機能 =====
    /**
     * a[href^="#"]: href属性が#で始まるリンクを全て選択
     * ページ内リンク（例: <a href="#math1a">）に対して処理を設定
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // e.preventDefault(): リンクの通常動作（急に飛ぶ）を止める
            e.preventDefault();
            
            // this.getAttribute('href'): リンクのhref属性の値（例: "#math1a"）を取得
            // querySelector(): その値をIDとして持つ要素を探す
            const target = document.querySelector(this.getAttribute('href'));
            
            // 要素が見つかったら
            if (target) {
                // scrollIntoView: その要素まで滑らかにスクロールする
                target.scrollIntoView({
                    behavior: 'smooth', // スムーズにスクロール
                    block: 'start' // 要素を画面の上部に表示
                });
            }
        });
    });

    // ===== 導出方法の展開/折りたたみ機能 =====
    // derivationクラスがついた公式カードを全て取得
    const derivationCards = document.querySelectorAll('.formula-card.derivation');
    
    derivationCards.forEach(card => {
        // カード内の導出内容（derivation-content）を探す
        const derivationContent = card.querySelector('.derivation-content');
        
        // 導出内容が存在する場合
        if (derivationContent) {
            // 初期状態: 導出内容を表示する
            derivationContent.style.display = 'block';
            
            // タイトル（h4）を取得
            const title = card.querySelector('h4');
            
            // タイトルをクリックできるようにする設定
            title.style.cursor = 'pointer'; // マウスカーソルを指の形にする
            title.style.userSelect = 'none'; // 文字選択を無効にする（クリックしやすくする）
            
            // 展開状態を示す絵文字アイコンを作成
            const toggleIcon = document.createElement('span'); // 新しいspan要素を作る
            toggleIcon.textContent = ' 🔽'; // 下向き矢印の絵文字
            toggleIcon.style.fontSize = '0.8em'; // 文字サイズを少し小さく
            title.appendChild(toggleIcon); // タイトルの最後にアイコンを追加
            
            // タイトルをクリックしたときの動作
            title.addEventListener('click', function() {
                // display: 'none' → 非表示、'block' → 表示
                if (derivationContent.style.display === 'none') {
                    // 非表示だったら表示する
                    derivationContent.style.display = 'block';
                    toggleIcon.textContent = ' 🔽'; // 下向き矢印（開いている状態）
                } else {
                    // 表示中だったら非表示にする
                    derivationContent.style.display = 'none';
                    toggleIcon.textContent = ' ▶️'; // 右向き矢印（閉じている状態）
                }
            });
        }
    });

    // ===== 例題の展開/折りたたみ機能 =====
    // 例題コンテンツ（example-content）を全て取得
    const exampleContents = document.querySelectorAll('.example-content');
    
    exampleContents.forEach(exampleContent => {
        // closest(): 一番近い親要素を探す（ここでは公式カードを探す）
        const card = exampleContent.closest('.formula-card');
        
        if (card) {
            // 初期状態: 例題を表示
            exampleContent.style.display = 'block';
            
            const title = card.querySelector('h4');
            
            // 同じタイトルに複数回処理が実行されないようにチェック
            // dataset: HTML要素に独自のデータ属性を設定できる
            if (title && !title.dataset.hasToggle) {
                title.style.cursor = 'pointer'; // クリック可能な見た目
                title.style.userSelect = 'none'; // テキスト選択を無効化
                title.dataset.hasToggle = 'true'; // フラグを立てる（既に処理済み）
                
                // 例題アイコンを追加
                const exampleIcon = document.createElement('span');
                exampleIcon.textContent = ' 📝'; // ノートの絵文字
                exampleIcon.style.fontSize = '0.8em';
                title.appendChild(exampleIcon);
            }
        }
    });

    // ===== MathJax（数式レンダリング）の再処理 =====
    /**
     * MathJax: 数学の公式をきれいに表示するライブラリ
     * 検索で表示内容が変わったら、数式を再レンダリング（再描画）する
     */
    if (window.MathJax) { // MathJaxが読み込まれているか確認
        searchBox.addEventListener('input', function() {
            // setTimeout: 指定した時間（ミリ秒）後に処理を実行
            // 100ms = 0.1秒後に実行（入力が落ち着いてから実行）
            setTimeout(() => {
                MathJax.typesetPromise(); // 数式を再描画
            }, 100);
        });
    }
});

// ===== ページ読み込み完了時の処理 =====
/**
 * loadイベント: ページ全体（画像なども含む）が読み込まれた時に実行
 */
window.addEventListener('load', function() {
    // 数式のレンダリング完了を待つ
    if (window.MathJax) {
        // startup.promise.then(): MathJaxの初期化が完了したら実行
        MathJax.startup.promise.then(() => {
            // console.log(): ブラウザの開発者ツールにメッセージを表示（デバッグ用）
            console.log('数式のレンダリングが完了しました');
        });
    }
});

// ===== トップに戻るボタンの追加 =====
/**
 * 即時関数: (function(){ ... })();
 * 定義と同時に実行される関数。変数の競合を防ぐため
 */
(function() {
    // createElement: 新しいHTML要素を作成
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑'; // ボタンの中身（上向き矢印）
    backToTopButton.setAttribute('aria-label', 'トップに戻る'); // アクセシビリティ用のラベル
    
    // cssTextでまとめてスタイルを設定（CSS in JS）
    backToTopButton.style.cssText = `
        position: fixed;          /* 画面に固定（スクロールしても動かない） */
        bottom: 30px;             /* 画面の下から30px */
        right: 30px;              /* 画面の右から30px */
        width: 50px;              /* 幅50px */
        height: 50px;             /* 高さ50px */
        border-radius: 50%;       /* 角を丸く（50%で円形） */
        background: #2563eb;      /* 背景色（青） */
        color: white;             /* 文字色（白） */
        border: none;             /* 枠線なし */
        font-size: 24px;          /* 文字サイズ */
        cursor: pointer;          /* マウスを重ねると指のカーソル */
        display: none;            /* 最初は非表示 */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 影をつける */
        z-index: 1000;            /* 他の要素より前面に表示 */
        transition: all 0.3s ease; /* 変化をなめらかに（0.3秒） */
    `;

    // appendChild: body要素の最後にボタンを追加
    document.body.appendChild(backToTopButton);

    // ===== スクロール時の表示/非表示制御 =====
    // scrollイベント: ページをスクロールするたびに実行される
    window.addEventListener('scroll', function() {
        // pageYOffset: 現在のスクロール位置（上からの距離）
        if (window.pageYOffset > 300) { // 300px以上スクロールしたら
            backToTopButton.style.display = 'block'; // ボタンを表示
        } else {
            backToTopButton.style.display = 'none'; // ボタンを非表示
        }
    });

    // ===== ボタンをクリックしたときの動作 =====
    backToTopButton.addEventListener('click', function() {
        // scrollTo: 指定した位置にスクロール
        window.scrollTo({
            top: 0,              // 一番上（0px）に移動
            behavior: 'smooth'   // なめらかにスクロール
        });
    });

    // ===== ホバー効果（マウスを重ねたとき） =====
    // mouseenter: マウスが要素に入ったとき
    backToTopButton.addEventListener('mouseenter', function() {
        this.style.background = '#1e40af'; // 背景色を濃い青に変更
        this.style.transform = 'translateY(-3px)'; // 3px上に浮かせる
    });

    // mouseleave: マウスが要素から出たとき
    backToTopButton.addEventListener('mouseleave', function() {
        this.style.background = '#2563eb'; // 背景色を元に戻す
        this.style.transform = 'translateY(0)'; // 元の位置に戻す
    });
})();

// ===== キーボードショートカット =====
/**
 * keydownイベント: キーボードのキーが押されたときに実行
 * e: イベント情報（どのキーが押されたかなど）
 */
document.addEventListener('keydown', function(e) {
    // Ctrl+K または Cmd+K（Macの場合）で検索ボックスにフォーカス
    // ctrlKey: Ctrlキーが押されているか、metaKey: Cmdキーが押されているか
    // &&（かつ）: 両方がtrueのときだけtrue
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault(); // ブラウザのデフォルト動作を止める
        document.getElementById('searchBox').focus(); // 検索ボックスにフォーカス（カーソル移動）
    }
    
    // ESCキーで検索をクリア
    if (e.key === 'Escape') {
        const searchBox = document.getElementById('searchBox');
        if (searchBox.value) { // 検索ボックスに何か入力されていたら
            searchBox.value = ''; // 検索ボックスを空にする
            // dispatchEvent: プログラムからイベントを発生させる
            // new Event('input'): inputイベントを作成
            searchBox.dispatchEvent(new Event('input')); // 検索処理を実行（検索結果をリセット）
        }
    }
});

// ===== ローカルストレージを使用した検索履歴機能 =====
/**
 * localStorage: ブラウザにデータを保存する仕組み
 * ページを閉じても、データが消えない
 */
(function() {
    const searchBox = document.getElementById('searchBox');
    const HISTORY_KEY = 'math-formula-search-history'; // 保存するときの名前（キー）
    const MAX_HISTORY = 10; // 保存する検索履歴の最大数

    // ===== 検索履歴を読み込む関数 =====
    function loadHistory() {
        // getItem: localStorageから値を取り出す
        const history = localStorage.getItem(HISTORY_KEY);
        
        // 三項演算子: 条件 ? 真の場合 : 偽の場合
        // history ? JSON.parse(history) : []
        // → historyがあればJSON形式から配列に変換、なければ空の配列
        return history ? JSON.parse(history) : [];
    }

    // ===== 検索履歴を保存する関数 =====
    function saveHistory(term) {
        // trim(): 文字列の前後の空白を削除
        if (!term.trim()) return; // 空文字なら何もしない（returnで関数を終了）
        
        let history = loadHistory(); // 今までの履歴を読み込む
        
        // filter: 条件に合う要素だけを残す（配列の絞り込み）
        // item !== term: termと違う要素だけを残す（重複削除）
        history = history.filter(item => item !== term);
        
        // unshift: 配列の先頭に要素を追加
        history.unshift(term); // 最新の検索を一番前に追加
        
        // 配列が最大数を超えたら古いものを削除
        if (history.length > MAX_HISTORY) {
            // slice(0, MAX_HISTORY): 0番目からMAX_HISTORY個だけ取り出す
            history = history.slice(0, MAX_HISTORY);
        }
        
        // setItem: localStorageに値を保存
        // JSON.stringify(): 配列をJSON形式の文字列に変換（保存用）
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    // ===== 検索時に履歴を保存 =====
    let searchTimeout; // タイマーを保存する変数
    searchBox.addEventListener('input', function() {
        // clearTimeout: 以前のタイマーをキャンセル
        clearTimeout(searchTimeout);
        
        // setTimeout: 1秒後に実行（連続入力中は実行されない）
        searchTimeout = setTimeout(() => {
            if (this.value.trim()) { // 入力があれば
                saveHistory(this.value.trim()); // 履歴に保存
            }
        }, 1000); // 1000ミリ秒 = 1秒
    });
})();

// ===== デバッグ用のメッセージ =====
// console.log: ブラウザの開発者ツール（F12）のコンソールに表示される
console.log('高校数学公式集が読み込まれました！');
console.log('ショートカット: Ctrl+K (Cmd+K) で検索、ESC で検索クリア');
