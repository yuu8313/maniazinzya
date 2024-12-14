class BouncingShape {
    constructor(type, color) {
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.element.setAttribute("width", "30");
        this.element.setAttribute("height", "30");
        this.element.setAttribute("viewBox", "0 0 30 30");
        this.element.style.position = "fixed";
        this.element.style.zIndex = "1001";
        this.element.style.opacity = "0.3"; 
        
        let shape;
        switch(type) {
            case 'triangle':
                shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                shape.setAttribute("points", "15,0 30,30 0,30");
                break;
            case 'square':
                shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                shape.setAttribute("width", "30");
                shape.setAttribute("height", "30");
                break;
            case 'circle':
                shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                shape.setAttribute("cx", "15");
                shape.setAttribute("cy", "15");
                shape.setAttribute("r", "15");
                break;
        }
        
        shape.setAttribute("fill", color);
        this.element.appendChild(shape);
        
        this.x = Math.random() * (window.innerWidth - 30);
        this.y = Math.random() * (window.innerHeight / 2);
        this.dx = (Math.random() - 0.5) * 8; 
        this.dy = (Math.random() - 0.5) * 8; 
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 10; 
        
        this.updatePosition();
        
        setTimeout(() => {
            this.element.remove();
        }, 5000);
    }
    
    createPulseTrail() {
        const trail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        trail.setAttribute("cx", "15");
        trail.setAttribute("cy", "15");
        trail.setAttribute("r", "15");
        trail.setAttribute("fill", "rgba(255, 255, 255, 0.2)");
        
        const trailSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        trailSvg.setAttribute("width", "30");
        trailSvg.setAttribute("height", "30");
        trailSvg.setAttribute("viewBox", "0 0 30 30");
        trailSvg.style.position = "fixed";
        trailSvg.style.left = `${this.x}px`;
        trailSvg.style.top = `${this.y}px`;
        trailSvg.style.zIndex = "1000";
        trailSvg.appendChild(trail);
        
        document.querySelector('.bouncing-shapes-container').appendChild(trailSvg);
        
        trailSvg.animate([
            { transform: 'scale(1)', opacity: 0.5 },
            { transform: 'scale(2)', opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        }).onfinish = () => trailSvg.remove();
    }
    
    updatePosition() {
        this.rotation += this.rotationSpeed;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = `rotate(${this.rotation}deg)`;
    }
    
    move() {
        this.x += this.dx;
        this.y += this.dy;
        
        // Bounce off walls
        if (this.x <= 0 || this.x >= window.innerWidth - 30) {
            this.dx = -this.dx;
        }
        if (this.y <= 0 || this.y >= window.innerHeight / 2 - 30) {
            this.dy = -this.dy;
        }
        
        this.createPulseTrail();
        this.updatePosition();
    }
}

function createBouncingShapes() {
    const shapes = [];
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#ffbe0b', '#ff9a8b'];
    const types = ['triangle', 'square', 'circle'];
    const container = document.createElement('div');
    container.className = 'bouncing-shapes-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < 15; i++) {
        const shape = new BouncingShape(
            types[Math.floor(Math.random() * types.length)],
            colors[Math.floor(Math.random() * colors.length)]
        );
        container.appendChild(shape.element);
        shapes.push(shape);
    }
    
    function animate() {
        shapes.forEach((shape, index) => {
            if (shape.element.parentNode) {
                shape.move();
            } else {
                shapes.splice(index, 1);
            }
        });
        if (shapes.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

const originalCelebrateMidnight = window.celebrateMidnight;
window.celebrateMidnight = function() {
    if (originalCelebrateMidnight) {
        originalCelebrateMidnight();
    }
    createBouncingShapes();
};