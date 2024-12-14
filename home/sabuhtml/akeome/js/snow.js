document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snow');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const snowflakes = [];
    const maxSnowflakes = 100;

    class Snowflake {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 2;
            this.speed = Math.random() * 1 + 0.5;
            this.swing = Math.random() * 3;
            this.swingSpeed = Math.random() * 0.02;
            this.angle = 0;
        }

        update() {
            this.angle += this.swingSpeed;
            this.x += Math.sin(this.angle) * this.swing;
            this.y += this.speed;

            if (this.y > height) {
                this.y = -10;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        }
    }

    for (let i = 0; i < maxSnowflakes; i++) {
        snowflakes.push(new Snowflake());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw();
        });
        
        requestAnimationFrame(animate);
    }

    animate();
});