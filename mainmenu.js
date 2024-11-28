// BGM再生関数
function playBGM(bgmId) {
    const bgm = document.getElementById(bgmId);
    if (bgm) {
        bgm.currentTime = 0;
        bgm.play();
    }
}

// ページ読み込み後の処理
window.onload = function() {
    // ローカルストレージからデータを取得
    let heroLevel = parseInt(localStorage.getItem("heroLevel")) || 1;
    let totalExperiencePoints = parseInt(localStorage.getItem("totalExperiencePoints")) || 0;
    let heroHP = parseInt(localStorage.getItem("heroHP")) || 100;
    let heroBP = 39 + heroLevel; // BPを「39 + レベル」で計算

    // レベルアップのロジック
    let accumulatedExperience = totalExperiencePoints; // 累積経験値
    let experienceNeededForNextLevel = 90 + 10 * heroLevel; // 次のレベルに必要な経験値

    // レベルアップ処理
    while (accumulatedExperience >= experienceNeededForNextLevel) {
        accumulatedExperience -= experienceNeededForNextLevel;
        heroLevel++;
        heroHP += 5; // レベルごとにライフ+5
        heroBP = 39 + heroLevel; // BPを更新
        experienceNeededForNextLevel = 90 + 10 * heroLevel; // 次のレベルに必要な経験値を更新
    }

    // 次のレベルに必要な残り経験値を計算
    const experienceRemaining = experienceNeededForNextLevel - accumulatedExperience;

    // ローカルストレージに最新のデータを保存
    localStorage.setItem("totalExperiencePoints", accumulatedExperience);
    localStorage.setItem("heroLevel", heroLevel);
    localStorage.setItem("heroHP", heroHP);
    localStorage.setItem("heroBP", heroBP); // heroBPを保存

    // HTMLの表示を更新
    document.getElementById("heroLevel").textContent = heroLevel;
    document.getElementById("heroHP").textContent = heroHP;
    document.getElementById("heroBP").textContent = heroBP;
    document.getElementById("experienceRemaining").textContent = experienceRemaining;

    // BGM再生（ユーザー操作が必要な場合があります）
    document.body.addEventListener('click', function playOnInteraction() {
        playBGM("indexBGM");
        document.body.removeEventListener('click', playOnInteraction);
    });

    // 勇者の能力値（レベルに応じて動的に設定）
    const heroAbilities = {
        計算: 50,
        方程式: 55,
        関数: 50,
        図形: 60,
        論理: 50,
        統計: 50
    };

    // レーダーチャートの作成
    createRadarChart(heroAbilities);

    // 単元ボタンのイベントリスナーを設定
    const unitButtonsDiv = document.getElementById('unitButtons');
    const subunitButtonsDiv = document.getElementById('subunitButtons');

    // 単元ボタンのイベントリスナー
    const unitButtons = document.querySelectorAll('.unit-button');
    unitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedUnit = this.getAttribute('data-unit');
            localStorage.setItem('selectedUnit', selectedUnit); // 選択した単元を保存

            // 単元ボタンを非表示
            unitButtonsDiv.style.display = 'none';

            // 小単元ボタンを表示
            displaySubunitButtons(selectedUnit);
        });
    });

    // 小単元ボタンを生成する関数
    function displaySubunitButtons(selectedUnit) {
        subunitButtonsDiv.innerHTML = ''; // 小単元ボタンをクリア

        let subunits = []; // 小単元のリスト

        if (selectedUnit === '式の展開・因数分解') {
            subunits = [
                '多項式と単項式の乗除',
                '多項式の乗除',
                '乗法公式',
                '因数分解',
                '公式を利用する因数分解',
                '式の計算の利用'
            ];
        } else if (selectedUnit === '平方根') {
            subunits = ['平方根の定義', '平方根の計算', '応用問題'];
        }
        // 他の単元も同様に小単元を設定

        // 小単元ボタンを生成
        subunits.forEach(subunit => {
            const button = document.createElement('button');
            button.className = 'subunit-button';
            button.textContent = subunit;
            button.addEventListener('click', function() {
                localStorage.setItem('selectedSubunit', subunit); // 選択した小単元を保存
                window.location.href = 'sentou.html'; // 戦闘画面に遷移
            });
            subunitButtonsDiv.appendChild(button);
        });

        // 小単元ボタンを表示
        subunitButtonsDiv.style.display = 'flex';
    }

    // 難易度ボタンの設定
    const buttons = document.querySelectorAll('.difficulty-button');

    // ローカルストレージから選択された難易度を取得
    const savedDifficulty = localStorage.getItem('selectedDifficulty');

    // 保存されている難易度に基づいてボタンの初期状態を設定
    if (savedDifficulty) {
        buttons.forEach(button => {
            if (button.getAttribute('data-difficulty') === savedDifficulty) {
                button.classList.add('active');
            }
        });
    }

    // ボタンのクリックイベントを設定
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // 他のボタンのアクティブ状態をリセット
            buttons.forEach(btn => btn.classList.remove('active'));

            // クリックされたボタンにアクティブ状態を設定
            this.classList.add('active');

            // 選択した難易度をローカルストレージに保存
            const selectedDifficulty = this.getAttribute('data-difficulty');
            localStorage.setItem('selectedDifficulty', selectedDifficulty);

            console.log(`選択した難易度: ${selectedDifficulty}`);
        });
    });
}; // ← この閉じ括弧を追加

// レーダーチャートの作成関数
function createRadarChart(heroAbilities) {
    const ctx = document.getElementById('radarChart').getContext('2d');

    const data = {
        labels: ['計算', '方程式', '関数', '図形', '論理', '統計'], // 各軸のラベル
        datasets: [{
            label: '勇者の能力値',
            data: [
                heroAbilities.計算,
                heroAbilities.方程式,
                heroAbilities.関数,
                heroAbilities.図形,
                heroAbilities.論理,
                heroAbilities.統計
            ],
            backgroundColor: 'rgba(0, 123, 255, 0.2)', // データセットの半透明背景色
            borderColor: 'rgba(0, 123, 255, 1)',       // データセットの外枠の色
            borderWidth: 2,                            // 外枠の太さ
            pointBackgroundColor: '#007BFF',           // データポイントの色
            pointBorderColor: '#FFF',                  // データポイントの枠線色
            pointBorderWidth: 2,                       // データポイントの枠線の太さ
            pointRadius: 6                             // データポイントの大きさ
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // レスポンシブ対応で比率を調整
        scales: {
            r: {
                min: 40, // 最小値を40に設定
                max: 100, // 最大値を100に設定
                ticks: {
                    stepSize: 10, // グリッド間隔
                    color: 'black', // ラベルの色
                    font: { size: 14, family: 'Arial, sans-serif' } // ラベルのフォント
                },
                grid: {
                    color: 'rgba(100, 100, 100, 0.5)', // グリッド線の色（濃いグレー）
                    lineWidth: 1.5                      // グリッド線の太さ
                },
                angleLines: {
                    color: 'rgba(100, 100, 100, 0.7)', // 放射線の色（濃いグレー）
                    lineWidth: 1.5                      // 放射線の太さ
                },
                pointLabels: {
                    font: { size: 16, family: 'Arial, sans-serif', weight: 'bold' }, // 軸ラベルのフォント
                    color: 'black' // 軸ラベルの色
                }
            }
        },
        plugins: {
            legend: {
                display: true, // 凡例を表示
                position: 'top', // 凡例をグラフの上部に配置
                labels: {
                    color: 'black', // 凡例ラベルの色
                    font: { size: 14, family: 'Arial, sans-serif' } // 凡例ラベルのフォント
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)', // ツールチップの背景色
                titleFont: { size: 14, weight: 'bold' }, // ツールチップタイトルのフォント
                bodyFont: { size: 12 },                 // ツールチップ本文のフォント
                borderColor: '#FFF',                    // ツールチップの枠線色
                borderWidth: 1                          // ツールチップの枠線の太さ
            }
        }
    };

    // 背景色を設定
    const radarChartContainer = document.querySelector('.radar-chart-container');
    radarChartContainer.style.backgroundColor = '#F6F6F6'; // 薄いグレー
    radarChartContainer.style.borderRadius = '10px';       // 角を丸く
    radarChartContainer.style.padding = '20px';           // 内側の余白を追加

    // レーダーチャートを生成
    new Chart(ctx, {
        type: 'radar', // レーダーチャートを指定
        data: data,
        options: options
    });
}
