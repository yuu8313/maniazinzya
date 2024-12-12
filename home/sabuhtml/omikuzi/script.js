// 雪とサクラのアニメーション生成
function createParticles(containerClass, particleClass, count, isSnow = true) {
    const container = document.querySelector(containerClass);
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = particleClass;
        
        if (isSnow) {
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = Math.random() * 0.8 + 0.2;
        }
        
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
    }
}

// おみくじの結果
const fortunes = [
    { result: '大吉', message: '最高の幸運が訪れます！' },
    { result: '中吉', message: '良い出来事が待っています' },
    { result: '小吉', message: '穏やかな日々が続きます' },
    { result: '末吉', message: '努力が実を結ぶでしょう' },
    { result: '凶', message: '慎重に行動しましょう' },
    { result: '大凶', message: '今日は静かに過ごしましょう' },
    { result: '超大吉', message: '奇跡のような良いことが起きるでしょう' },
    { result: '中吉', message: '望んでいたことが実現しそうです' },
    { result: '吉', message: '運気が徐々に上昇しています' },
    { result: '小吉', message: '些細な幸運を見逃さないで' },
    { result: '半吉', message: '小さな成功を楽しんでください' },
    { result: '末吉', message: '希望に向かって進みましょう' },
    { result: '凶', message: '思い切った決断は避けましょう' },
    { result: '小凶', message: '控えめに行動するのが吉です' },
    { result: '中凶', message: '計画の見直しが必要かも' },
    { result: '大凶', message: '慎重さが最も重要です' },
    { result: '微吉', message: 'わずかな進展を大切に' },
    { result: '吉', message: '穏やかで幸せな一日です' },
    { result: '中吉', message: '心配事が解決する兆し' },
    { result: '大吉', message: '新しいことに挑戦すると吉' },
    { result: '小吉', message: '気分転換に最適な日' },
    { result: '吉凶混合', message: '良いことも悪いことも受け入れよう' },
    { result: '中吉', message: '思いやりが幸運を呼ぶでしょう' },
    { result: '小吉', message: '周囲の助けを感謝しましょう' },
    { result: '末凶', message: '小さな注意で大きな問題を避けられます' },
    { result: '吉', message: '努力が報われる日です' },
    { result: '中吉', message: '良い結果が得られる日です' },
    { result: '半吉', message: '小さな喜びが見つかるかも' },
    { result: '末吉', message: '焦らずゆっくり進むのが吉' },
    { result: '凶', message: '不安定な状況に注意' },
    { result: '小凶', message: '急な判断は避けましょう' },
    { result: '中凶', message: '問題解決に時間をかけてください' },
    { result: '大凶', message: '今日は安全第一で' },
    { result: '吉', message: '幸運の兆しがあります' },
    { result: '微吉', message: '小さな努力が成功を呼びます' },
    { result: '吉凶混合', message: '柔軟な対応が求められる日' },
    { result: '中吉', message: '目標に近づく予感がします' },
    { result: '大吉', message: '一生に一度のチャンスが来るかも' },
    { result: '小吉', message: '小さな幸せを大切に' },
    { result: '末吉', message: '仲間との絆が深まります' },
    { result: '凶', message: '安全を最優先に考えましょう' },
    { result: '小凶', message: '慎重な計画が必要です' },
    { result: '中凶', message: '負の連鎖を断ち切りましょう' },
    { result: '大凶', message: '休息を大切にする日です' },
    { result: '吉', message: '新しいアイデアが生まれる日' },
    { result: '微吉', message: '積極的な一歩が大切です' },
    { result: '超大吉', message: '信じられないほどの幸運が舞い込みます' },
    { result: '中吉', message: '努力が実を結ぶ予感がします' },
    { result: '小吉', message: '笑顔が幸運を呼びます' },
    { result: '末吉', message: '計画通りに進むでしょう' },
    { result: '凶', message: '人とのトラブルに注意しましょう' },
    { result: '大凶', message: '焦らずに休息をとりましょう' },
    { result: '吉', message: '物事がスムーズに運ぶ一日です' },
    { result: '半吉', message: 'ほんの少しの努力が実を結びます' },
    { result: '微吉', message: 'ちょっとした良いニュースが舞い込みます' },
    { result: '吉凶混合', message: '判断が分かれる一日となるでしょう' },
    { result: '中吉', message: '心の平穏を取り戻す日です' },
    { result: '小吉', message: '友人との時間を大切にしましょう' },
    { result: '大吉', message: '迷わず行動して成功を掴む日です' },
    { result: '末吉', message: 'ゆっくりと進むことで成功します' },
    { result: '凶', message: '身近な問題に注意を払いましょう' },
    { result: '小凶', message: '思わぬミスに気をつけましょう' },
    { result: '中凶', message: '変化を恐れずに受け入れましょう' },
    { result: '大凶', message: '何事も慎重に行うべき日です' },
    { result: '吉', message: '新しい出会いがありそうです' },
    { result: '微吉', message: '少しの親切が大きな感謝を生むでしょう' },
    { result: '吉凶混合', message: '未知の挑戦が待ち受けています' },
    { result: '中吉', message: '感謝の気持ちが幸運を呼びます' },
    { result: '小吉', message: '小さな勝利を祝福しましょう' },
    { result: '末吉', message: '忍耐が結果を生むでしょう' },
    { result: '凶', message: '不用意な発言に注意してください' },
    { result: '大凶', message: '今日は一人の時間を大切にしましょう' },
    { result: '超大吉', message: '周囲を驚かせる幸運が待っています' },
    { result: '特大吉', message: '運命が味方している日です！' },
    { result: '極小吉', message: '控えめながらも嬉しい出来事が' },
    { result: '中吉', message: '努力が実り、成果が見えます' },
    { result: '吉', message: '家族との絆が深まる予感' },
    { result: '微吉', message: 'ちょっとした贈り物が幸運を運ぶ' },
    { result: '大吉', message: '迷いなく進むことで成功する' },
    { result: '吉', message: '趣味に打ち込むと良いことが' },
    { result: '中吉', message: '新しい友達ができそう' },
    { result: '吉凶混合', message: '計画の調整が必要な日' },
    { result: '小凶', message: '慎重に物事を進めて吉' },
    { result: '凶', message: '周囲への配慮が必要です' },
    { result: '末吉', message: '何事も焦らず慎重に' },
    { result: '小吉', message: '日常の中に小さな幸せが' },
    { result: '吉', message: '新しい挑戦が好結果を生む' },
    { result: '微吉', message: '周囲の支えに感謝する日' },
    { result: '中凶', message: '冷静な判断が必要です' },
    { result: '大凶', message: '今日はゆっくり休むのが吉' },
    { result: '超大吉', message: '思わぬ幸運が舞い込みます' },
    { result: '吉凶混合', message: '物事のバランスが重要です' },
    { result: '中吉', message: '親切が幸運を引き寄せる' },
    { result: '半吉', message: 'ささやかな努力が実る日' },
    { result: '大吉', message: '願いが叶う絶好のタイミング' },
    { result: '末吉', message: '穏やかな一日を楽しんで' },
    { result: '小凶', message: '注意深く行動すると良いことが' },
    { result: '特大吉', message: '周囲を驚かせるような幸運が' },
    { result: '極小吉', message: 'ささやかな喜び'}

];

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    createParticles('.snow-container', 'snow', 50, true);
    createParticles('.sakura-container', 'sakura', 30, false);
    
    const drawButton = document.getElementById('drawButton');
    const purificationModal = document.getElementById('purificationModal');
    const resultModal = document.getElementById('resultModal');
    const resultText = document.getElementById('resultText');
    const drawAgainButton = document.getElementById('drawAgainButton');
    const toriiGate = document.querySelector('.torii-gate');
    const hiddenElement = document.querySelector('.hidden-element');
    const omikujiBox = document.querySelector('.omikuji-box');
    
    toriiGate.addEventListener('click', () => {
        hiddenElement.classList.toggle('visible');
        
        anime({
            targets: '.torii-gate',
            scale: [1, 1.1, 1],
            duration: 500,
            easing: 'easeInOutQuad'
        });
    });

    // おみくじを引く処理
    drawButton.addEventListener('click', () => {
        purificationModal.style.display = 'block';
        
        // お祓いアニメーション
        anime({
            targets: '.purification-animation i',
            rotate: 360,
            duration: 1000,
            loop: true
        });

        // おみくじボックスの位置を取得
        const boxRect = omikujiBox.getBoundingClientRect();
        const modalContent = resultModal.querySelector('.modal-content');

        // 5秒後に結果を表示
        setTimeout(() => {
            purificationModal.style.display = 'none';
            const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
            resultText.innerHTML = `
                <div class="fortune-result">${fortune.result}</div>
                <div class="fortune-message">${fortune.message}</div>
            `;
            resultModal.style.display = 'block';
            
            // モーダルコンテンツの位置をおみくじボックスの位置に設定
            modalContent.style.top = `${boxRect.top}px`;
            modalContent.style.left = `${boxRect.left + (boxRect.width / 2) - (modalContent.offsetWidth / 2)}px`;
            
            // 結果表示アニメーション
            anime({
                targets: '.fortune-result',
                scale: [0, 1],
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutElastic(1, .8)'
            });
        }, 5000);
    });

    // もう一度引くボタン
    drawAgainButton.addEventListener('click', () => {
        resultModal.style.display = 'none';
    });
});


// パフォーマンス最適化のためのデバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ウィンドウリサイズ時のパーティクル再生成
window.addEventListener('resize', debounce(() => {
    document.querySelector('.snow-container').innerHTML = '';
    document.querySelector('.sakura-container').innerHTML = '';
    createParticles('.snow-container', 'snow', 50, true);
    createParticles('.sakura-container', 'sakura', 30, false);
}, 250));