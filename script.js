document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('magic-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let state = 'snow';

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(type) {
            this.type = type;
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = this.type === 'snow' ? Math.random() * -height : height + Math.random() * 100;
            this.size = this.type === 'snow' ? Math.random() * 3 + 1 : Math.random() * 6 + 4;
            this.speedY = this.type === 'snow' ? Math.random() * 1 + 0.5 : Math.random() * -1 - 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.wobble = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.wobble) * 0.5;
            this.wobble += 0.05;
            if (this.type === 'snow') {
                if (this.y > height) this.y = -10;
            } else {
                if (this.y < -50) this.reset();
            }
        }

        draw() {
            ctx.fillStyle = this.type === 'snow' ?
                `rgba(255, 255, 255, ${this.opacity})` :
                `rgba(253, 186, 116, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            if (this.type === 'lantern') {
                ctx.shadowBlur = 15;
                ctx.shadowColor = "rgba(253, 186, 116, 0.5)";
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    function initParticles(count, type) {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(type));
        }
    }

    initParticles(100, 'snow');

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    const toggle = document.getElementById('atmosphere-toggle');
    const stateLabel = document.getElementById('state-label');
    const body = document.body;
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            body.setAttribute('data-theme', 'warm');
            stateLabel.textContent = "Current State: Warmth";
        } else {
            body.setAttribute('data-theme', 'frost');
            stateLabel.textContent = "Current State: Frost";
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelector('.scroll-prompt').addEventListener('click', () => {
        document.getElementById('chapter-2').scrollIntoView({ behavior: 'smooth' });
    });
    const lanternBtn = document.getElementById('lantern-btn');
    lanternBtn.addEventListener('click', () => {
        lanternBtn.textContent = "Releasing Magic...";
        lanternBtn.style.pointerEvents = "none";
        let replacementCount = 0;
        const total = particles.length;
        const interval = setInterval(() => {
            if (replacementCount >= total) {
                clearInterval(interval);
                lanternBtn.textContent = "Magic Released ✨";
                return;
            }
            for (let i = 0; i < 5 && replacementCount < total; i++) {
                particles[replacementCount] = new Particle('lantern');
                particles[replacementCount].y = height + Math.random() * 100;
                replacementCount++;
            }
        }, 50);
    });

});
