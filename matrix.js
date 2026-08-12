// Matrix Rain Effect - Green falling letters background
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        
        // Wait for canvas to exist
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
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
        
        console.log('MatrixRain initialized with', this.columns.length, 'columns');
        
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
                speed: 0.5 + Math.random() * 3,
                opacity: 1,
                chars: this.generateCharSequence(Math.floor(Math.random() * 30) + 15)
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
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw each column
        for (let column of this.columns) {
            // Calculate position in character sequence - draw multiple chars vertically
            for (let i = 0; i < 15; i++) {
                const charY = column.y - (i * this.fontSize);
                const index = (Math.floor(column.y / this.fontSize) + i) % column.chars.length;
                const char = column.chars[index];
                
                // Skip if off screen
                if (charY < -this.fontSize || charY > this.canvas.height) continue;
                
                // Color transitions from bright green to darker green for glow effect
                const brightness = Math.max(0, 1 - (i / 15));
                
                if (i === 0) {
                    // Bright green at the head
                    this.ctx.fillStyle = '#00ff00';
                    this.ctx.shadowColor = '#00ff00';
                    this.ctx.shadowBlur = 20;
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 0;
                } else if (i < 5) {
                    // Medium green
                    this.ctx.fillStyle = `rgba(0, ${Math.floor(255 * brightness)}, 0, ${brightness})`;
                    this.ctx.shadowColor = '#00cc00';
                    this.ctx.shadowBlur = 10;
                } else {
                    // Darker green with fade
                    this.ctx.fillStyle = `rgba(0, 200, 0, ${brightness * 0.5})`;
                    this.ctx.shadowBlur = 0;
                }
                
                // Draw the character
                this.ctx.font = `bold ${this.fontSize}px 'Courier New', monospace`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'top';
                this.ctx.fillText(char, column.x + this.fontSize / 2, charY);
            }
            
            // Update position
            column.y += column.speed;
            
            // Reset if off screen
            if (column.y > this.canvas.height) {
                column.y = -this.fontSize * 15;
                column.chars = this.generateCharSequence(Math.floor(Math.random() * 30) + 15);
                column.speed = 0.5 + Math.random() * 3;
            }
        }
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize matrix rain when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MatrixRain();
    });
} else {
    new MatrixRain();
}
