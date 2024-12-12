document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('emaCanvas');
    const ctx = canvas.getContext('2d');
    const textInput = document.getElementById('textInput');
    const fontSizeInput = document.getElementById('fontSize');
    const addTextBtn = document.getElementById('addText');
    const downloadBtn = document.getElementById('download');

    let texts = [];
    let isDragging = false;
    let selectedText = null;
    let dragStartX, dragStartY;
    let clickCount = 0;
    let clickTimer = null;

    const emaImage = new Image();
    emaImage.crossOrigin = "anonymous";  
    emaImage.src = 'ema.webp';
    emaImage.onload = () => {
        canvas.width = emaImage.width;
        canvas.height = emaImage.height;
        drawCanvas();
    };

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(emaImage, 0, 0);
        texts.forEach(text => {
            ctx.font = `${text.size}px serif`;
            ctx.fillStyle = 'black';
            ctx.fillText(text.content, text.x, text.y);
        });
    }

    addTextBtn.addEventListener('click', () => {
        const text = {
            content: textInput.value,
            size: parseInt(fontSizeInput.value),
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        texts.push(text);
        drawCanvas();
        showNotification('テキストを追加しました');
    });

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        texts.forEach((text, index) => {
            ctx.font = `${text.size}px serif`;
            const metrics = ctx.measureText(text.content);
            if (x >= text.x && x <= text.x + metrics.width &&
                y >= text.y - text.size && y <= text.y) {
                
                clickCount++;
                
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                        isDragging = true;
                        selectedText = text;
                        dragStartX = x - text.x;
                        dragStartY = y - text.y;
                    }, 200);
                } else if (clickCount === 3) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    texts.splice(index, 1);
                    drawCanvas();
                    showNotification('テキストを削除しました');
                }
            }
        });
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging && selectedText) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);

            selectedText.x = x - dragStartX;
            selectedText.y = y - dragStartY;
            drawCanvas();
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        selectedText = null;
    });

    downloadBtn.addEventListener('click', () => {
        try {
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = '絵馬.png';
            link.href = dataURL;
            link.click();
            showNotification('画像をダウンロードしました');
        } catch (error) {
            console.error('ダウンロードエラー:', error);
            showNotification('画像のダウンロードに失敗しました');
        }
    });

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }


    function createSakura() {
    const sakura = document.createElement('div');
    sakura.className = 'sakura';
    sakura.style.left = Math.random() * 100 + 'vw';
    sakura.style.width = Math.random() * 10 + 5 + 'px';
    sakura.style.height = sakura.style.width;
    
    document.getElementById('sakura-container').appendChild(sakura);
    setTimeout(() => {
      sakura.remove();
    }, 10000);
  }
  setInterval(createSakura, 200);

    const risingSun = document.getElementById('rising-sun');
    anime({
        targets: risingSun,
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 2000,
        easing: 'easeOutQuad'
    });
});