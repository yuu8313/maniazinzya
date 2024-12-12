let rightClickCount = 0;
let leftClickCount = 0;
let isLocked = false;
let isAscended = false;
let hasScrolledUp = false;
let orbInterval;

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    rightClickCount++;
    console.log('Right clicks:', rightClickCount);
});

document.addEventListener('click', function () {
    if (rightClickCount >= 20) {
        leftClickCount++;
        console.log('Left clicks:', leftClickCount);

        if (leftClickCount === 3) {
            scrollToBottom();
        }
    }
});

function scrollToBottom() {
    isLocked = true;
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
    });
    setTimeout(showPopup, 1000);
}

function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';

    const passwordInput = document.getElementById('password');
    const ascendBtn = document.getElementById('ascendBtn');

    passwordInput.addEventListener('input', function () {
        if (this.value === '殿様飛蝗') {
            ascendBtn.style.display = 'block';
        } else {
            ascendBtn.style.display = 'none';
        }
    });

    ascendBtn.addEventListener('click', prepareAscension);
}

function prepareAscension() {
    isAscended = true;

    document.body.querySelectorAll('*:not(#orbs-container)').forEach((el) => {
        el.style.display = 'none';
    });

    const mysticalSquare = document.createElement('div');
    mysticalSquare.style.position = 'fixed';
    mysticalSquare.style.left = '50%';
    mysticalSquare.style.top = '50%';
    mysticalSquare.style.width = '100px';
    mysticalSquare.style.height = '100px';
    mysticalSquare.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    mysticalSquare.style.transform = 'translate(-50%, -50%)';
    mysticalSquare.style.animation = 'rotate 3s linear infinite';
    mysticalSquare.style.cursor = 'pointer';
    mysticalSquare.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
    mysticalSquare.style.transition = 'opacity 0.5s ease';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotate {
            from {
                transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
                transform: translate(-50%, -50%) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);

    mysticalSquare.addEventListener('mouseenter', () => {
        mysticalSquare.style.opacity = '0';
        setTimeout(() => {
            mysticalSquare.remove();
            startOrbLoop();
            startColorTransition();
        }, 500);
    });

    document.body.appendChild(mysticalSquare);
}

function startColorTransition() {
    const colors = ['#87CEEB', '#191970', '#000000'];
    let transitionIndex = 0;

    function changeColor() {
        if (transitionIndex < colors.length) {
            document.body.style.backgroundColor = colors[transitionIndex];
            transitionIndex++;
            setTimeout(changeColor, 5000);
        } else {
            setTimeout(showWelcomeText, 1000);
        }
    }

    changeColor();
}

function showWelcomeText() {
    const welcomeText = document.createElement('div');
    welcomeText.id = 'welcome-text';
    welcomeText.className = 'welcome-text';
    welcomeText.textContent = 'おかえりなさい';
    document.body.appendChild(welcomeText);

    requestAnimationFrame(() => {
        welcomeText.style.display = 'block';
        welcomeText.style.opacity = '1';
    });

    setTimeout(() => {
        window.location.href = 'https://yuu8313.github.io/maniakyou/';
    }, 4500);
}

function startOrbLoop() {
    const container = document.getElementById('orbs-container') || createOrbContainer();

    if (orbInterval) clearInterval(orbInterval);

    orbInterval = setInterval(() => {
        createOrbs(2, 'smooth-float', 'orb-white');
        createOrbs(1, 'float-up', 'orb-gold');
        createOrbs(1, 'radial-expand', 'orb-blue');
    }, 500);
}

function createOrbs(count = 1, animationType, orbClass) {
    const container = document.getElementById('orbs-container') || createOrbContainer();

    for (let i = 0; i < count; i++) {
        const orb = document.createElement('div');
        orb.className = `orb ${orbClass}`;

        if (animationType === 'float-up') {
            orb.style.left = `${Math.random() * window.innerWidth}px`;
            orb.style.top = `${window.innerHeight + 20}px`;
        } else if (animationType === 'radial-expand') {
            orb.style.left = `${Math.random() * window.innerWidth}px`;
            orb.style.top = `${Math.random() * window.innerHeight}px`;
        } else {
            orb.style.left = `${Math.random() * window.innerWidth}px`;
            orb.style.top = `${Math.random() * window.innerHeight}px`;
        }

        orb.classList.add(animationType);
        container.appendChild(orb);

        const duration = animationType === 'smooth-float' ? 10000 : 4000;
        setTimeout(() => {
            orb.remove();
        }, duration);
    }
}

function createOrbContainer() {
    const container = document.createElement('div');
    container.id = 'orbs-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '9999';
    container.style.pointerEvents = 'none';
    
    document.body.appendChild(container);
    
    return container;
}

document.addEventListener('DOMContentLoaded', function () {
    const style = document.createElement('style');
    
   style.innerHTML=`
      @keyframes smoothFloat{
         0%,100%{transform:translateY(0);}
         50%{transform:translateY(-20px);}
      }
   `;
   document.head.appendChild(style);
});

window.addEventListener(
   'wheel',
   function (e) {
      if (isLocked) e.preventDefault();
   },
   { passive: false }
);

window.addEventListener(
   'touchmove',
   function (e) {
      if (isLocked) e.preventDefault();
   },
   { passive: false }
);