const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

Promise.all([
  loadScript('https://cdn.quilljs.com/1.3.6/quill.min.js'),
  loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
]).then(() => {
  initializeEditor();
}).catch(console.error);

function initializeEditor() {
  const canvas = document.getElementById('emaCanvas');
  const ctx = canvas.getContext('2d');
  const textInput = document.getElementById('textInput');
  const fontSizeInput = document.getElementById('fontSize');
  const addTextBtn = document.getElementById('addText');
  const downloadBtn = document.getElementById('download');
  
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image'],
        ['clean']
      ]
    }
  });

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
      ctx.save();
      applyTextStyles(ctx, text);
      ctx.fillText(text.content, text.x, text.y);
      if (text === selectedText) {
        drawSelectionBox(ctx, text);
      }
      ctx.restore();
    });
  }

  function applyTextStyles(ctx, text) {
    ctx.font = `${text.style || ''} ${text.size}px ${text.font || 'serif'}`;
    ctx.fillStyle = text.color || 'black';
    if (text.shadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }
  }

  function drawSelectionBox(ctx, text) {
    const metrics = ctx.measureText(text.content);
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      text.x - 5,
      text.y - text.size - 5,
      metrics.width + 10,
      text.size + 10
    );
  }

  addTextBtn.addEventListener('click', () => {
    let content;
    if (quill) {
      const delta = quill.getContents();
      content = quill.getText();
    } else {
      content = textInput.value;
    }

    if (window.marked && content.includes('*') || content.includes('#') || content.includes('`')) {
      content = marked.parse(content);
      // Strip HTML tags but keep basic formatting
      content = content.replace(/<[^>]*>/g, '');
    }

    const text = {
      content,
      size: parseInt(fontSizeInput.value),
      x: canvas.width / 2,
      y: canvas.height / 2,
      style: quill ? getQuillStyles(quill) : '',
      font: 'serif',
      color: quill ? quill.getFormat().color || 'black' : 'black',
      shadow: false
    };

    texts.push(text);
    drawCanvas();
    showNotification('テキストを追加しました');
  });

  function getQuillStyles(quill) {
    const format = quill.getFormat();
    let styles = [];
    if (format.bold) styles.push('bold');
    if (format.italic) styles.push('italic');
    return styles.join(' ');
  }

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    texts.forEach((text, index) => {
      ctx.font = `${text.style || ''} ${text.size}px ${text.font}`;
      const metrics = ctx.measureText(text.content);
      if (x >= text.x - 5 && x <= text.x + metrics.width + 5 &&
          y >= text.y - text.size - 5 && y <= text.y + 5) {
        
        clickCount++;
        
        if (clickCount === 1) {
          clickTimer = setTimeout(() => {
            clickCount = 0;
            isDragging = true;
            selectedText = text;
            dragStartX = x - text.x;
            dragStartY = y - text.y;
            drawCanvas(); // Redraw to show selection
          }, 200);
        } else if (clickCount === 2) {
          clearTimeout(clickTimer);
          clickCount = 0;
          editText(text, index);
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

  function editText(text, index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = text.content;
    input.style.position = 'absolute';
    input.style.left = `${text.x}px`;
    input.style.top = `${text.y}px`;
    input.style.fontSize = `${text.size}px`;
    
    input.addEventListener('blur', () => {
      text.content = input.value;
      drawCanvas();
      input.remove();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        text.content = input.value;
        drawCanvas();
        input.remove();
      }
    });

    document.body.appendChild(input);
    input.focus();
  }

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
    drawCanvas();
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
  if (window.anime) {
    anime({
      targets: risingSun,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 2000,
      easing: 'easeOutQuad'
    });
  }
}
