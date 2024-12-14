function startFinalCountdown() {
    anime({
        targets: '.countdown',
        scale: [1, 1.2],
        duration: 500,
        direction: 'alternate',
        easing: 'easeInOutQuad',
        loop: true
    });
}

function celebrateMidnight() {
    // Clear any existing celebration texts and elements
    const existingTexts = document.querySelectorAll('.celebration-text');
    existingTexts.forEach(text => text.remove());
    
    const existingWrappers = document.querySelectorAll('.particles-wrapper, .svg-wrapper');
    existingWrappers.forEach(wrapper => wrapper.remove());

    // Get the position of the current time display
    const timeDisplay = document.querySelector('.clock-section');
    const timeRect = timeDisplay.getBoundingClientRect();
    const maxY = timeRect.top;

    const sunrise = anime.timeline({
        easing: 'easeInOutQuad'
    });

    sunrise
        .add({
            targets: '.container',
            backgroundColor: [
                { value: '#1a1a2e', duration: 0 },
                { value: '#2a4858', duration: 2000 },
                { value: '#d35400', duration: 2000 },
                { value: '#ff7e5f', duration: 2000 },
                { value: '#feb47b', duration: 2000 },
                { value: '#FCFAF2', duration: 2000 }
            ],
            easing: 'cubicBezier(.17,.67,.83,.67)'
        })
        .add({
            targets: '.fa-torii-gate',
            scale: [1, 1.8],
            rotate: ['0deg', '360deg'],
            duration: 4000,
            opacity: [0.5, 1]
        }, '-=10000')
        .add({
            targets: '.glass',
            backgroundColor: ['rgba(252, 250, 242, 0.1)', 'rgba(252, 250, 242, 0.3)'],
            backdropFilter: ['blur(5px)', 'blur(15px)'],
            duration: 3000
        }, '-=10000');

    // SVG生成１
    const svgWrapper = document.createElement('div');
    svgWrapper.className = 'svg-wrapper';
    svgWrapper.style.position = 'fixed';
    svgWrapper.style.top = '0';
    svgWrapper.style.left = '0';
    svgWrapper.style.width = '100%';
    svgWrapper.style.height = '100%';
    svgWrapper.style.pointerEvents = 'none';
    svgWrapper.style.zIndex = '1002';
    document.body.appendChild(svgWrapper);

    // はっぱSVG
    for (let i = 0; i < 30; i++) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.style.position = 'absolute';
        svg.style.width = '30px';
        svg.style.height = '30px';
        
        const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        petal.setAttribute('d', 'M50 0 C60 40 90 50 50 100 C10 50 40 40 50 0');
        petal.setAttribute('fill', ['#ffd700', '#ff9a8b', '#ffb7c5'][Math.floor(Math.random() * 3)]);
        svg.appendChild(petal);
        svgWrapper.appendChild(svg);

        const randomX = anime.random(0, window.innerWidth);
        const randomY = anime.random(0, maxY);

        anime({
            targets: svg,
            translateX: randomX,
            translateY: randomY,
            rotate: anime.random(-360, 360),
            scale: anime.random(0.5, 1.5),
            opacity: [1, 0],
            duration: anime.random(4000, 8000),
            delay: anime.random(0, 3000),
            easing: 'easeOutExpo'
        });
    }

    // 波紋
    for (let i = 0; i < 8; i++) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.position = 'fixed';
        ripple.style.zIndex = '1002';
        document.body.appendChild(ripple);

        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * maxY;
        ripple.style.left = `${randomX}px`;
        ripple.style.top = `${randomY}px`;

        anime({
            targets: ripple,
            scale: [0, 5],
            opacity: [1, 0],
            easing: 'easeOutExpo',
            duration: 4000,
            delay: i * 500
        });
    }

    // 障子
    anime({
        targets: '.shoji.left',
        translateX: [0, '-100%'],
        duration: 4000,
        easing: 'cubicBezier(0.645, 0.045, 0.355, 1.000)',
        delay: 1000
    });

    anime({
        targets: '.shoji.right',
        translateX: [0, '100%'],
        duration: 4000,
        easing: 'cubicBezier(0.645, 0.045, 0.355, 1.000)',
        delay: 1000
    });

    // もじ（バグるのは気にしない）
    const messages = ['あけおめ', 'ことよろ'];
    let currentMessageIndex = 0;

    function displayNextMessage() {
        if (currentMessageIndex >= messages.length) return;

        const textEl = document.createElement('div');
        textEl.className = 'celebration-text';
        textEl.textContent = messages[currentMessageIndex];
        textEl.style.top = `${maxY / 2}px`;
        document.body.appendChild(textEl);

        anime({
            targets: textEl,
            opacity: [0, 1],
            translateY: [-50, 0],
            scale: [0.5, 1],
            duration: 2000,
            easing: 'easeOutElastic(1, .5)',
            complete: () => {
                setTimeout(() => {
                    anime({
                        targets: textEl,
                        opacity: 0,
                        duration: 1000,
                        complete: () => {
                            textEl.remove();
                            currentMessageIndex++;
                            displayNextMessage();
                        }
                    });
                }, 2000);
            }
        });
    }

    displayNextMessage();
}

let konamiCode = '';
const validCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';

document.addEventListener('keydown', (e) => {
    konamiCode += e.key;
    if (konamiCode.length > validCode.length) {
        konamiCode = konamiCode.substring(1);
    }
    if (konamiCode.includes(validCode)) {
        celebrateMidnight();
        konamiCode = '';
    }
});