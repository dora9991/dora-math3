// problemGenerator.jsから問題生成関数をインポート
import { generateProblemByDifficulty } from './seifu_1.js';

let heroBP = parseInt(localStorage.getItem("heroBP")) || 50; // デフォルト値50
let heroHP = parseInt(localStorage.getItem("heroHP")) || 100;
let heroLevel = parseInt(localStorage.getItem("heroLevel")) || 1;
let hero = { name: "勇者", hp: heroHP, attackPower: heroBP, level: heroLevel };
let monster; // グローバル変数として宣言

let correctAnswer;
let correctCount = 0;
let totalQuestions = 0;

// 選択された難易度を取得
const selectedLevel = localStorage.getItem('selectedLevel') || 'beginner'; // デフォルトは beginner

// モンスターを定義
const monsters = {
    beginner: [
        { name: "スライム", hp: 180, attackPower: 35, image: "beginner_1.jpg" },
        { name: "ドラキー", hp: 160, attackPower: 40, image: "beginner_2.jpg" }
    ],
    intermediate: [
        { name: "さまようよろい", hp: 150, attackPower: 50, image: "middle_1.jpg" },
        { name: "ゴーレム", hp: 200, attackPower: 42, image: "middle_2.jpg" }
    ],
    advanced: [
        { name: "キラーマシン", hp: 100, attackPower: 80, image: "advanced_1.jpg" },
        { name: "グレイトドラゴン", hp: 140, attackPower: 70, image: "advanced_2.jpg" }
    ]
};

window.onload = function () {
    const screen = document.getElementById("screen");
    const game = document.getElementById("game");
    const heroHPLabel = document.getElementById("heroHP");
    const monsterHPLabel = document.getElementById("monsterHP");
    const battleLog = document.getElementById("battleLog");
    const answersDiv = document.getElementById("answers");
    const monsterImage = document.getElementById("monsterImage");
    const accuracyLabel = document.getElementById("accuracy");
    const returnButton = document.getElementById("returnButton");
    const monsterNameLabel = document.getElementById("monsterName");
    const heroBPLabel = document.getElementById("heroBP");
    const monsterBPLabel = document.getElementById("monsterBP");

    // レベルに応じたモンスターを選択
    const levelMonsters = monsters[selectedLevel];
    const monsterData = levelMonsters[Math.floor(Math.random() * levelMonsters.length)];
    // 深いコピー
    monster = JSON.parse(JSON.stringify(monsterData));

    // Hero BPとMonster BPを表示
    heroBPLabel.textContent = `BP: ${hero.attackPower}`;
    heroHPLabel.textContent = `HP: ${hero.hp}`;
    monsterHPLabel.textContent = `HP: ${monster.hp}`;
    monsterBPLabel.textContent = `BP: ${monster.attackPower}`;
    monsterNameLabel.textContent = monster.name;

    // モンスターの画像を設定
    monsterImage.src = `images/${monster.image}`;
    console.log('Image source set to:', monsterImage.src);

    monsterImage.onerror = function() {
        console.error('Failed to load image:', monsterImage.src);
    };

    // 戦闘終了後の選択画面ボタン処理
    returnButton.onclick = () => {
        localStorage.setItem("currentExperience", "0"); // 一時的な経験値をリセット
        window.location.href = "mainmenu.html"; // mainmenu.html にリダイレクト
    };

    // ダメージ計算
    function calculateDamage(attacker, defender) {
        const randomAdjustment = Math.floor(Math.random() * 7) - 3; // -3から3のランダム値
        const damage = Math.max(
            0,
            Math.floor(attacker.attackPower - defender.attackPower / 4 + randomAdjustment)
        );
        return damage;
    }

    // ローカルストレージから難易度を取得
    const selectedDifficulty = selectedLevel; // 既に selectedLevel を取得済み

    // 問題生成
    function generateQuestion() {
        try {
            const problem = generateProblemByDifficulty(selectedDifficulty);

            // 問題文と正解を設定
            correctAnswer = problem.correctAnswer;
            battleLog.innerHTML += `次の問題:<br>${problem.question}<br>`;

            // 選択肢を生成
            const correctIndex = Math.floor(Math.random() * 4);
            answersDiv.innerHTML = "";

            for (let i = 0; i < 4; i++) {
                const button = document.createElement("button");
                if (i === correctIndex) {
                    button.textContent = correctAnswer; // 正解
                } else {
                    button.textContent = problem.wrongAnswers.pop(); // 誤答
                }
                button.onclick = () => checkAnswer(parseInt(button.textContent));
                answersDiv.appendChild(button);
            }
        } catch (error) {
            console.error('問題の生成中にエラーが発生しました:', error);
            battleLog.innerHTML += `問題の生成中にエラーが発生しました。<br>`;
        }
    }

    // 解答チェック
    function checkAnswer(selectedAnswer) {
        battleLog.innerHTML = ""; // ログをクリア
        answersDiv.innerHTML = ""; // 答えの選択肢をクリア

        if (selectedAnswer === correctAnswer) {
            const damageToMonster = calculateDamage(hero, monster);
            battleLog.innerHTML += `正解！ ${monster.name} に ${damageToMonster} のダメージ！<br>`;
            monster.hp -= damageToMonster;
            correctCount++; // 正解数をカウント
        } else {
            const damageToHero = calculateDamage(monster, hero);
            battleLog.innerHTML += `ミス！ ${hero.name} は ${damageToHero} のダメージを受けた！<br>`;
            hero.hp -= damageToHero;
        }
        totalQuestions++;
        updateHPLabels();
        checkGameOver();
    }

    // HPラベル更新
    function updateHPLabels() {
        heroHPLabel.textContent = `HP: ${Math.max(hero.hp, 0)}`; // 0以下にならないように修正
        monsterHPLabel.textContent = `HP: ${Math.max(monster.hp, 0)}`; // 0以下にならないように修正
    }

    // ゲーム終了判定
    function checkGameOver() {
        if (hero.hp <= 0) {
            battleLog.innerHTML += `${hero.name} は ${monster.name} にやられてしまった！<br>`;
            disableButtons();
            updateHPLabels();
            showResult(false);
        } else if (monster.hp <= 0) {
            battleLog.innerHTML += `${hero.name} は ${monster.name} を倒した！<br>`;
            monsterImage.style.display = "none";
            disableButtons();
            updateHPLabels();
            showResult(true);
            playBGM("endBGM");
        } else {
            generateQuestion();
        }
    }

    // 結果を表示
    function showResult(isVictory) {
        const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);
        const currentExperience = correctCount * 10; // 現在の経験値

        // トータル経験値を更新
        const totalExperiencePoints = parseInt(localStorage.getItem("totalExperiencePoints")) || 0;
        const updatedTotalExperience = totalExperiencePoints + currentExperience;

        console.log(`現在の経験値: ${currentExperience}`);
        console.log(`以前のトータル経験値: ${totalExperiencePoints}`);
        console.log(`更新後のトータル経験値: ${updatedTotalExperience}`);

        localStorage.setItem("totalExperiencePoints", updatedTotalExperience); // トータル経験値を保存
        localStorage.setItem("currentExperience", currentExperience); // currentExperienceを保存

        accuracyLabel.textContent = `問題数: ${totalQuestions} 正答率: ${accuracy}% 獲得経験値: ${currentExperience}`;

        // 戦闘後に経験値を初期化
        correctCount = 0; // 正解数をリセット
        totalQuestions = 0; // 問題数をリセット

        returnButton.style.display = "inline-block"; // ボタンを表示
        disableButtons();
    }

    // ボタン無効化
    function disableButtons() {
        const buttons = answersDiv.getElementsByTagName("button");
        for (let button of buttons) {
            button.disabled = true;
        }
    }

    // BGM再生
    function playBGM(bgmId) {
        const bgmElements = document.querySelectorAll("audio");
        bgmElements.forEach((audio) => audio.pause()); // 全てのBGMを停止
        const bgm = document.getElementById(bgmId);
        if (bgm) {
            bgm.currentTime = 0; // 再生位置を先頭に戻す
            bgm.play();
        }
    }

    // 戦闘開始
    function startBattle() {
        playBGM("battleBGM"); // 戦闘用BGM再生
    }

    // ゲーム開始処理
    screen.style.transition = "opacity 1s ease-in-out";
    screen.style.opacity = "0";
    setTimeout(() => {
        screen.style.display = "none";
    }, 1000);

    startBattle(); // 戦闘開始
    updateHPLabels();
    isFirstRun();
    generateQuestion();
};

// 初回ログ
function isFirstRun() {
    const battleLog = document.getElementById("battleLog");
    battleLog.innerHTML += `${monster.name} が現れた！<br>`;
}
