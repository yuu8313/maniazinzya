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
    createYuki();
});

const styleSheet = document.styleSheet || (function() {
    const style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet;
})();

styleSheet.insertRule(`
    @keyframes fall {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`, 0);