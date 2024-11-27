// 難易度ごとの問題自動生成
export function generateProblemByDifficulty(difficulty) {
    let num1, num2, operator, correctAnswer;

    switch (difficulty) {
        case 'beginner':
            // 初級: 簡単な加減算
            num1 = Math.floor(Math.random() * 20) + 1; // 1〜20のランダムな数
            num2 = Math.floor(Math.random() * 20) + 1;
            operator = Math.random() > 0.5 ? '+' : '-'; // 加算または減算
            correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
            break;

        case 'intermediate':
            // 中級: 加減算、簡単な乗除
            num1 = Math.floor(Math.random() * 50) + 1; // 1〜50のランダムな数
            num2 = Math.floor(Math.random() * 20) + 1;
            operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
            if (operator === '+') {
                correctAnswer = num1 + num2;
            } else if (operator === '-') {
                correctAnswer = num1 - num2;
            } else if (operator === '*') {
                correctAnswer = num1 * num2;
            } else {
                correctAnswer = Math.floor(num1 / num2); // 割り算の整数部分
            }
            break;

        case 'advanced':
            // 上級: 平方根や累乗など
            const isSquareRoot = Math.random() > 0.5;
            if (isSquareRoot) {
                // 平方根
                const square = Math.pow(Math.floor(Math.random() * 10) + 1, 2);
                correctAnswer = Math.sqrt(square);
                return {
                    question: `√${square} = ?`,
                    correctAnswer,
                    wrongAnswers: generateWrongAnswers(correctAnswer)
                };
            } else {
                // 累乗
                num1 = Math.floor(Math.random() * 5) + 2; // 底 2〜6
                num2 = Math.floor(Math.random() * 3) + 2; // 指数 2〜4
                correctAnswer = Math.pow(num1, num2);
                return {
                    question: `${num1}^${num2} = ?`,
                    correctAnswer,
                    wrongAnswers: generateWrongAnswers(correctAnswer)
                };
            }

        default:
            throw new Error(`不明な難易度: ${difficulty}`);
    }

    return {
        question: `${num1} ${operator} ${num2} = ?`,
        correctAnswer,
        wrongAnswers: generateWrongAnswers(correctAnswer)
    };
}

// 誤答を生成
function generateWrongAnswers(correctAnswer) {
    const wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
        const offset = Math.floor(Math.random() * 10) - 5; // -5〜5の範囲で誤差を作る
        const wrongAnswer = correctAnswer + offset;
        if (wrongAnswer !== correctAnswer && !wrongAnswers.has(wrongAnswer)) {
            wrongAnswers.add(wrongAnswer);
        }
    }
    return Array.from(wrongAnswers);
}
