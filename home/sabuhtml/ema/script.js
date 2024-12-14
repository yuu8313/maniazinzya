function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function loadLibraries() {
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js');
    console.log('Libraries loaded successfully');
  } catch (error) {
    console.error('Error loading libraries:', error);
  }
}

function processMarkdown(text) {
  const styles = {
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false
  };
  
  text = text.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    return content;
  });
  
  text = text.replace(/\*(.*?)\*/g, (match, content) => {
    return content;
  });
  
  text = text.replace(/~~(.*?)~~/g, (match, content) => {
    return content;
  });
  
  text = text.replace(/<u>(.*?)<\/u>/g, (match, content) => {
    return content;
  });
  
  return text;
}

function drawText(ctx, text, x, y, style) {
  ctx.save();
  
  if (text.match(/\*\*(.*?)\*\*/)) {
    ctx.font = `bold ${style.size}px ${style.font}`;
  }
  
  if (text.match(/\*(.*?)\*/)) {
    ctx.font = `italic ${style.size}px ${style.font}`;
  }
  
  const hasStrikethrough = text.match(/~~(.*?)~~/);
  const hasUnderline = text.match(/<u>(.*?)<\/u>/);
  
  const cleanText = processMarkdown(text);
  ctx.fillText(cleanText, x, y);
  
  if (hasStrikethrough) {
    const metrics = ctx.measureText(cleanText);
    const strikeY = y - style.size * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, strikeY);
    ctx.lineTo(x + metrics.width, strikeY);
    ctx.stroke();
  }
  
  if (hasUnderline) {
    const metrics = ctx.measureText(cleanText);
    ctx.beginPath();
    ctx.moveTo(x, y + 2);
    ctx.lineTo(x + metrics.width, y + 2);
    ctx.stroke();
  }
  
  ctx.restore();
}

function showContextMenu(e, textIndex, texts, drawCanvas) {
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.innerHTML = `
    <div class="menu-item" data-action="delete">削除</div>
    <div class="menu-item" data-action="edit">編集</div>
  `;
  
  menu.style.position = 'absolute';
  menu.style.left = `${e.clientX}px`;
  menu.style.top = `${e.clientY}px`;
  
  document.body.appendChild(menu);
  
  menu.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (action === 'delete') {
      texts.splice(textIndex, 1);
      drawCanvas();
      showNotification('テキストを削除しました');
    } else if (action === 'edit') {
      document.getElementById('textInput').value = texts[textIndex].content;
      document.getElementById('fontSize').value = texts[textIndex].size;
    }
    menu.remove();
  });
  
  document.addEventListener('click', function removeMenu() {
    menu.remove();
    document.removeEventListener('click', removeMenu);
  });
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

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function initializeAnimations() {
  setInterval(createSakura, 200);

  const risingSun = document.getElementById('rising-sun');
  if (risingSun && window.anime) {
    anime({
      targets: risingSun,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 2000,
      easing: 'easeOutQuad'
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadLibraries();

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
  let isLeftButtonPressed = false;

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
      ctx.font = `${text.size}px ${text.font || 'serif'}`;
      ctx.fillStyle = text.color || 'black';
      
      if (text === selectedText) {
        const metrics = ctx.measureText(text.content);
        ctx.fillStyle = 'rgba(0, 123, 255, 0.2)';
        ctx.fillRect(
          text.x - 2,
          text.y - text.size,
          metrics.width + 4,
          text.size + 4
        );
      }
      
      ctx.fillStyle = text.color || 'black';
      drawText(ctx, text.content, text.x, text.y, {
        size: text.size,
        font: text.font || 'serif'
      });
    });
  }

  addTextBtn.addEventListener('click', () => {
    const text = {
      content: textInput.value,
      size: parseInt(fontSizeInput.value),
      x: canvas.width / 2,
      y: canvas.height / 2,
      font: document.getElementById('fontFamily')?.value || 'serif',
      color: document.getElementById('textColor')?.value || 'black'
    };
    texts.push(text);
    drawCanvas();
    showNotification('テキストを追加しました');
  });

  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      isLeftButtonPressed = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      selectedText = null;

      texts.forEach((text, index) => {
        ctx.font = `${text.size}px ${text.font || 'serif'}`;
        const metrics = ctx.measureText(processMarkdown(text.content));
        if (x >= text.x && x <= text.x + metrics.width &&
            y >= text.y - text.size && y <= text.y) {
          
          selectedText = text;
          isDragging = true;
          dragStartX = x - text.x;
          dragStartY = y - text.y;

          if (e.button === 2) {
            e.preventDefault();
            showContextMenu(e, index, texts, drawCanvas);
          }
        }
      });
      
      drawCanvas();
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDragging && selectedText && isLeftButtonPressed) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      selectedText.x = x - dragStartX;
      selectedText.y = y - dragStartY;
      drawCanvas();
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      isLeftButtonPressed = false;
      isDragging = false;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && selectedText) {
      const index = texts.indexOf(selectedText);
      if (index > -1) {
        texts.splice(index, 1);
        selectedText = null;
        drawCanvas();
        showNotification('テキストを削除しました');
      }
    }
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

  initializeAnimations();
});
