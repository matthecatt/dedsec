// Matrix Rain Effect - Green falling letters background
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas to full viewport size
        this.resizeCanvas();
        
        // Characters to use (mix of ASCII and symbols for hacker feel)
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.charArray = this.chars.split('');
        
        // Initialize columns
        this.columns = [];
        this.initializeColumns();
        
        // Animation settings
        this.fontSize = 16;
        this.speed = 0.02;
        
        // Start animation
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initializeColumns();
    }
    
    initializeColumns() {
        this.columns = [];
        const numColumns = Math.ceil(this.canvas.width / this.fontSize);
        
        for (let i = 0; i < numColumns; i++) {
            this.columns[i] = {
                x: i * this.fontSize,
                y: Math.random() * this.canvas.height,
                speed: 1 + Math.random() * 2,
                opacity: 1,
                chars: this.generateCharSequence(Math.floor(Math.random() * 20) + 10)
            };
        }
    }
    
    generateCharSequence(length) {
        let sequence = [];
        for (let i = 0; i < length; i++) {
            sequence.push(this.charArray[Math.floor(Math.random() * this.charArray.length)]);
        }
        return sequence;
    }
    
    animate = () => {
        // Clear canvas with semi-transparent black to create trailing effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw each column
        for (let column of this.columns) {
            // Calculate position in character sequence
            const index = Math.floor(column.y / this.fontSize);
            const char = column.chars[index % column.chars.length];
            
            // Color transitions from bright green to darker green for glow effect
            const distance = (column.y % this.canvas.height) / this.canvas.height;
            
            if (distance < 0.1) {
                // Bright green at the head
                this.ctx.fillStyle = '#00ff00';
                this.ctx.shadowColor = '#00ff00';
                this.ctx.shadowBlur = 15;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
            } else if (distance < 0.3) {
                // Medium green
                this.ctx.fillStyle = '#00cc00';
                this.ctx.shadowColor = '#00cc00';
                this.ctx.shadowBlur = 8;
            } else {
                // Darker green with fade
                const opacity = Math.max(0, 1 - distance);
                this.ctx.fillStyle = `rgba(0, 200, 0, ${opacity * 0.7})`;
                this.ctx.shadowBlur = 0;
            }
            
            // Draw the character
            this.ctx.font = `bold ${this.fontSize}px 'Courier New', monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(char, column.x + this.fontSize / 2, column.y);
            
            // Update position
            column.y += column.speed;
            
            // Reset if off screen
            if (column.y > this.canvas.height) {
                column.y = -this.fontSize;
                column.chars = this.generateCharSequence(Math.floor(Math.random() * 20) + 10);
                column.speed = 1 + Math.random() * 2;
            }
        }
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize matrix rain when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MatrixRain();
});
