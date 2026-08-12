// ===== FLAPPY BIRD =====
class FlappyBirdGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.gameOver = false;
        this.birdY = 100;
        this.birdVelocity = 0;
        this.gravity = 0.6;
        this.pipes = [];
        this.pipeGap = 100;
        this.pipeWidth = 50;
        this.pipeDistance = 120;
        this.lastPipeX = 250;
        
        this.setup();
        this.gameLoop();
    }

    setup() {
        this.container.innerHTML = `
            <canvas id="flappyCanvas" width="300" height="400"></canvas>
            <p>Score: <span id="score">0</span></p>
            <p>Click to jump! Press R to restart.</p>
        `;
        this.canvas = document.getElementById('flappyCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        document.addEventListener('click', () => this.jump());
        document.addEventListener('keypress', (e) => {
            if (e.key.toLowerCase() === 'r') this.restart();
        });
    }

    jump() {
        if (!this.gameOver) {
            this.birdVelocity = -12;
        }
    }

    gameLoop() {
        if (!this.gameOver) {
            this.update();
            this.draw();
        }
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Bird physics
        this.birdVelocity += this.gravity;
        this.birdY += this.birdVelocity;

        // Generate pipes
        if (this.lastPipeX < 0) {
            this.pipes.push({
                x: this.canvas.width,
                gapY: Math.random() * (this.canvas.height - this.pipeGap - 50) + 25
            });
            this.lastPipeX = this.canvas.width;
        }
        this.lastPipeX -= 5;

        // Move pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].x -= 5;
            if (this.pipes[i].x < -this.pipeWidth) {
                this.pipes.splice(i, 1);
            }
        }

        // Collision detection
        for (let pipe of this.pipes) {
            if (this.birdY < 0 || this.birdY > this.canvas.height) {
                this.endGame();
            }
            if (this.birdX + 10 > pipe.x && this.birdX - 10 < pipe.x + this.pipeWidth) {
                if (this.birdY - 10 < pipe.gapY || this.birdY + 10 > pipe.gapY + this.pipeGap) {
                    this.endGame();
                }
            }
            if (pipe.x < this.birdX && pipe.x + this.pipeWidth > this.birdX && this.lastScoredPipe !== pipe) {
                this.score++;
                this.lastScoredPipe = pipe;
                document.getElementById('score').textContent = this.score;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bird
        this.birdX = 50;
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(this.birdX, this.birdY, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw pipes
        this.ctx.fillStyle = '#00AA00';
        for (let pipe of this.pipes) {
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.gapY);
            this.ctx.fillRect(pipe.x, pipe.gapY + this.pipeGap, this.pipeWidth, this.canvas.height);
        }
    }

    endGame() {
        this.gameOver = true;
        db.saveScore('flappybird', this.score);
        this.showGameOver();
    }

    restart() {
        this.birdY = 100;
        this.birdVelocity = 0;
        this.score = 0;
        this.gameOver = false;
        this.pipes = [];
        this.lastPipeX = 250;
        this.lastScoredPipe = null;
        document.getElementById('score').textContent = '0';
    }

    showGameOver() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }
}

// ===== COLOR MATCH =====
class ColorMatchGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.combo = 0;
        this.gameTime = 60;
        this.gameActive = true;
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
        
        this.setup();
        this.startTimer();
    }

    setup() {
        this.container.innerHTML = `
            <canvas id="colorCanvas" width="300" height="400"></canvas>
            <p>Match the colors! Time: <span id="time">60</span>s | Score: <span id="score">0</span></p>
        `;
        this.canvas = document.getElementById('colorCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.generateRound();
        this.draw();
        
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    generateRound() {
        this.targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.buttons = this.colors.map((color, i) => ({
            color,
            x: (i % 2) * 150,
            y: Math.floor(i / 2) * 80 + 50,
            width: 140,
            height: 70,
            correct: color === this.targetColor
        }));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw target
        this.ctx.fillStyle = this.targetColor;
        this.ctx.fillRect(50, 10, 200, 30);
        this.ctx.fillStyle = '#000';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Match this color', 150, 27);
        
        // Draw buttons
        for (let btn of this.buttons) {
            this.ctx.fillStyle = btn.color;
            this.ctx.fillRect(btn.x + 5, btn.y, btn.width, btn.height);
        }
    }

    handleClick(e) {
        if (!this.gameActive) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let btn of this.buttons) {
            if (x > btn.x + 5 && x < btn.x + 5 + btn.width &&
                y > btn.y && y < btn.y + btn.height) {
                if (btn.correct) {
                    this.score += 10 + this.combo * 5;
                    this.combo++;
                    document.getElementById('score').textContent = this.score;
                    this.generateRound();
                    this.draw();
                } else {
                    this.combo = 0;
                    this.generateRound();
                    this.draw();
                }
            }
        }
    }

    startTimer() {
        const timer = setInterval(() => {
            this.gameTime--;
            document.getElementById('time').textContent = this.gameTime;
            if (this.gameTime <= 0) {
                clearInterval(timer);
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        this.gameActive = false;
        db.saveScore('colormatch', this.score);
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '25px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Time Up!', 150, 150);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, 150, 200);
    }
}

// ===== SNAKE =====
class SnakeGame {
    constructor(container) {
        this.container = container;
        this.gridSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.food = {x: 15, y: 15};
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.score = 0;
        this.gameOver = false;
        
        this.setup();
        this.gameLoop();
    }

    setup() {
        this.container.innerHTML = `
            <canvas id="snakeCanvas" width="300" height="400"></canvas>
            <p>Score: <span id="score">0</span></p>
            <p>Use arrow keys to move! Press R to restart.</p>
        `;
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridWidth = this.canvas.width / this.gridSize;
        this.gridHeight = this.canvas.height / this.gridSize;
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowUp':
                if (this.direction.y === 0) this.nextDirection = {x: 0, y: -1};
                break;
            case 'ArrowDown':
                if (this.direction.y === 0) this.nextDirection = {x: 0, y: 1};
                break;
            case 'ArrowLeft':
                if (this.direction.x === 0) this.nextDirection = {x: -1, y: 0};
                break;
            case 'ArrowRight':
                if (this.direction.x === 0) this.nextDirection = {x: 1, y: 0};
                break;
            case 'r':
            case 'R':
                this.restart();
                break;
        }
    }

    gameLoop() {
        if (!this.gameOver) {
            this.update();
            this.draw();
            setTimeout(() => this.gameLoop(), 100);
        }
    }

    update() {
        this.direction = this.nextDirection;
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        
        // Wrap around edges
        head.x = (head.x + this.gridWidth) % this.gridWidth;
        head.y = (head.y + this.gridHeight) % this.gridHeight;
        
        // Check collision with self
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.endGame();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            this.food = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            };
        } else {
            this.snake.pop();
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#00FF00';
        for (let segment of this.snake) {
            this.ctx.fillRect(segment.x * (this.canvas.width / this.gridWidth), 
                             segment.y * (this.canvas.height / this.gridHeight),
                             this.canvas.width / this.gridWidth - 2,
                             this.canvas.height / this.gridHeight - 2);
        }
        
        // Draw food
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(this.food.x * (this.canvas.width / this.gridWidth),
                         this.food.y * (this.canvas.height / this.gridHeight),
                         this.canvas.width / this.gridWidth - 2,
                         this.canvas.height / this.gridHeight - 2);
    }

    endGame() {
        this.gameOver = true;
        db.saveScore('snake', this.score);
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }

    restart() {
        this.snake = [{x: 10, y: 10}];
        this.food = {x: 15, y: 15};
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.score = 0;
        this.gameOver = false;
        document.getElementById('score').textContent = '0';
        this.gameLoop();
    }
}

// ===== MEMORY PUZZLE =====
class MemoryPuzzleGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.moves = 0;
        this.matched = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.cards = [];
        this.symbols = ['⭐', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];
        
        this.setup();
    }

    setup() {
        this.container.innerHTML = `
            <canvas id="memoryCanvas" width="300" height="400"></canvas>
            <p>Moves: <span id="moves">0</span> | Matched: <span id="matched">0</span>/8</p>
        `;
        this.canvas = document.getElementById('memoryCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.createCards();
        this.draw();
        
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    createCards() {
        const deck = [...this.symbols, ...this.symbols];
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        
        this.cards = deck.map((symbol, i) => ({
            symbol,
            flipped: false,
            matched: false,
            x: (i % 4) * 75,
            y: Math.floor(i / 4) * 100,
            width: 70,
            height: 90
        }));
    }

    draw() {
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let card of this.cards) {
            this.ctx.fillStyle = card.matched ? '#90EE90' : (card.flipped ? '#87CEEB' : '#FFB6C1');
            this.ctx.fillRect(card.x, card.y, card.width, card.height);
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(card.x, card.y, card.width, card.height);
            
            if (card.flipped || card.matched) {
                this.ctx.fillStyle = '#000';
                this.ctx.font = '40px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(card.symbol, card.x + card.width / 2, card.y + card.height / 2);
            }
        }
    }

    handleClick(e) {
        if (this.lockBoard) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let card of this.cards) {
            if (x > card.x && x < card.x + card.width &&
                y > card.y && y < card.y + card.height) {
                if (!card.flipped && !card.matched) {
                    card.flipped = true;
                    
                    if (!this.firstCard) {
                        this.firstCard = card;
                    } else if (!this.secondCard && card !== this.firstCard) {
                        this.secondCard = card;
                        this.moves++;
                        document.getElementById('moves').textContent = this.moves;
                        
                        this.lockBoard = true;
                        setTimeout(() => this.checkMatch(), 1000);
                    }
                }
            }
        }
        
        this.draw();
    }

    checkMatch() {
        if (this.firstCard.symbol === this.secondCard.symbol) {
            this.firstCard.matched = true;
            this.secondCard.matched = true;
            this.matched++;
            document.getElementById('matched').textContent = this.matched;
            
            if (this.matched === 8) {
                this.endGame();
            }
        } else {
            this.firstCard.flipped = false;
            this.secondCard.flipped = false;
        }
        
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.draw();
    }

    endGame() {
        this.score = Math.max(0, 100 - this.moves * 5);
        db.saveScore('puzzle', this.score);
        setTimeout(() => {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '25px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('You Won!', 150, 150);
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`Score: ${this.score}`, 150, 200);
            this.ctx.fillText(`Moves: ${this.moves}`, 150, 230);
        }, 500);
    }
}