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
    
    let animationId;
    
    function draw() {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        
        for (let i = 0; i < drops.length; i++) {
            const x = (i * fontSize) + fontSize / 2;
            const y = drops[i];
            
            // Bright head
            ctx.fillStyle = '#00ff00';
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 15;
            const headChar = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(headChar, x, y);
            
            // Trail 1
            ctx.fillStyle = 'rgba(0, 200, 0, 0.7)';
            ctx.shadowBlur = 8;
            ctx.fillText(charArray[Math.floor(Math.random() * charArray.length)], x, y + fontSize);
            
            // Trail 2
            ctx.fillStyle = 'rgba(0, 150, 0, 0.4)';
            ctx.shadowBlur = 4;
            ctx.fillText(charArray[Math.floor(Math.random() * charArray.length)], x, y + fontSize * 2);
            
            // Trail 3
            ctx.fillStyle = 'rgba(0, 100, 0, 0.2)';
            ctx.shadowBlur = 0;
            ctx.fillText(charArray[Math.floor(Math.random() * charArray.length)], x, y + fontSize * 3);
            
            // Move down faster
            drops[i] += 3;
            
            // Reset if off screen
            if (drops[i] > canvas.height + fontSize * 4) {
                drops[i] = -fontSize * 4;
            }
        }
        
        ctx.shadowColor = 'transparent';
        animationId = requestAnimationFrame(draw);
    }
    
    draw();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
})();
