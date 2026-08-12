// Matrix Rain Effect - Green falling letters background
(function() {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');
    
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fontSize = 20;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }
    
    function draw() {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            const x = (i * fontSize) + fontSize / 2;
            const y = drops[i];
            
            // Bright at head
            ctx.fillStyle = '#00ff00';
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillText(text, x, y);
            
            // Fading trail
            ctx.shadowBlur = 8;
            ctx.fillStyle = 'rgba(0, 200, 0, 0.6)';
            ctx.fillText(charArray[Math.floor(Math.random() * charArray.length)], x, y + fontSize);
            
            ctx.shadowBlur = 4;
            ctx.fillStyle = 'rgba(0, 150, 0, 0.3)';
            ctx.fillText(charArray[Math.floor(Math.random() * charArray.length)], x, y + fontSize * 2);
            
            drops[i] += 2;
            
            if (drops[i] * fontSize > canvas.height) {
                drops[i] = 0;
            }
        }
        
        ctx.shadowColor = 'transparent';
        requestAnimationFrame(draw);
    }
    
    draw();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
})();
