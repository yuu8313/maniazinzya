function createYuki() {
    const yukiContainer = document.querySelector('.yuki');
    const yukiCount = 50;

    for (let i = 0; i < yukiCount; i++) {
        const yuki = document.createElement('div');
        yuki.style.cssText = `
            position: absolute;
            top: -10px;
            background: white;
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            border-radius: 50%;
            left: ${Math.random() * 100}vw;
            opacity: ${Math.random() * 0.3 + 0.7};
            animation: fall ${Math.random() * 3 + 2}s linear infinite;
            animation-delay: -${Math.random() * 5}s;
        `;

        yukiContainer.appendChild(yuki);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const himo = document.getElementById('himo');
    const suzu = document.getElementById('suzu');
    const bellSound = document.getElementById('bellSound');
    const notification = document.getElementById('notification');
    let lastPlayedAngle = 0;
    let isAnimating = false; 

    createSakura();
    createYuki();

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }, 1000);

    himo.addEventListener('click', () => {
        if (isAnimating) return;
        
        isAnimating = true;
        let currentRotation = 0;
        const duration = 1800; 
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            currentRotation = 30 * Math.sin(progress * Math.PI * 2);

            if (Math.abs(currentRotation - lastPlayedAngle) >= 15) {
                playBellSound();
                lastPlayedAngle = currentRotation;
            }

            himo.style.transform = `rotate(${currentRotation}deg)`;
            suzu.style.transform = `rotate(${currentRotation * 0.5}deg)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                himo.style.transform = 'rotate(0deg)';
                suzu.style.transform = 'rotate(0deg)';
                lastPlayedAngle = 0;
                isAnimating = false; 
            }
        }

        requestAnimationFrame(animate);
    });

    function playBellSound() {
        if (bellSound.error) {
            createFallingText();
        } else {
            bellSound.currentTime = 0;
            bellSound.play();
        }
    }

    function createFallingText() {
        const text = document.createElement('div');
        text.textContent = 'シャンシャシャンシャン';
        text.style.position = 'absolute';
        text.style.top = '-50px';
        text.style.left = '50%';
        text.style.transform = 'translateX(-50%)';
        text.style.color = 'var(--shu-iro)';
        document.body.appendChild(text);

        anime({
            targets: text,
            translateY: window.innerHeight + 50,
            opacity: [1, 0],
            duration: 2000,
            easing: 'easeInQuad',
            complete: () => text.remove()
        });
    }

    function createSakura() {
        const container = document.querySelector('.sakura-container');
        for (let i = 0; i < 30; i++) {
            const sakura = document.createElement('div');
            sakura.className = 'sakura';
            sakura.style.left = `${Math.random() * 100}vw`;
            sakura.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(sakura);
        }
    }

    function createYuki() {
        const container = document.querySelector('.yuki-container');
        for (let i = 0; i < 50; i++) {
            const yuki = document.createElement('div');
            yuki.className = 'yuki';
            yuki.style.left = `${Math.random() * 100}vw`;
            yuki.style.width = yuki.style.height = `${Math.random() * 5 + 2}px`;
            yuki.style.opacity = Math.random() * 0.6 + 0.4;
            yuki.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(yuki);
        }
    }
});