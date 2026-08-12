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
        this.lastPipeX = 250;
        this.setup();
        this.gameLoop();
    }
    setup() {
        this.container.innerHTML = `<canvas id="flappyCanvas" width="300" height="400"></canvas><div class="game-info">Score: <span id="score">0</span> | Click to jump! Press R to restart.</div>`;
        this.canvas = document.getElementById('flappyCanvas');
        this.ctx = this.canvas.getContext('2d');
        document.addEventListener('click', () => this.jump());
        document.addEventListener('keypress', (e) => { if (e.key.toLowerCase() === 'r') this.restart(); });
    }
    jump() { if (!this.gameOver) this.birdVelocity = -12; }
    gameLoop() {
        if (!this.gameOver) { this.update(); this.draw(); }
        requestAnimationFrame(() => this.gameLoop());
    }
    update() {
        this.birdVelocity += this.gravity;
        this.birdY += this.birdVelocity;
        if (this.lastPipeX < 0) {
            this.pipes.push({ x: this.canvas.width, gapY: Math.random() * (this.canvas.height - this.pipeGap - 50) + 25 });
            this.lastPipeX = this.canvas.width;
        }
        this.lastPipeX -= 5;
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].x -= 5;
            if (this.pipes[i].x < -this.pipeWidth) this.pipes.splice(i, 1);
        }
        for (let pipe of this.pipes) {
            if (this.birdY < 0 || this.birdY > this.canvas.height) this.endGame();
            if (this.birdX + 10 > pipe.x && this.birdX - 10 < pipe.x + this.pipeWidth) {
                if (this.birdY - 10 < pipe.gapY || this.birdY + 10 > pipe.gapY + this.pipeGap) this.endGame();
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
        this.birdX = 50;
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(this.birdX, this.birdY, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#00AA00';
        for (let pipe of this.pipes) {
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.gapY);
            this.ctx.fillRect(pipe.x, pipe.gapY + this.pipeGap, this.pipeWidth, this.canvas.height);
        }
    }
    endGame() { this.gameOver = true; db.saveScore('flappybird', this.score); this.showGameOver(); }
    restart() {
        this.birdY = 100; this.birdVelocity = 0; this.score = 0; this.gameOver = false; this.pipes = [];
        this.lastPipeX = 250; this.lastScoredPipe = null; document.getElementById('score').textContent = '0';
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
        this.score = 0; this.combo = 0; this.gameTime = 60; this.gameActive = true;
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
        this.setup(); this.startTimer();
    }
    setup() {
        this.container.innerHTML = `<canvas id="colorCanvas" width="300" height="400"></canvas><div class="game-info">Time: <span id="time">60</span>s | Score: <span id="score">0</span></div>`;
        this.canvas = document.getElementById('colorCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.generateRound(); this.draw();
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }
    generateRound() {
        this.targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.buttons = this.colors.map((color, i) => ({
            color, x: (i % 2) * 150, y: Math.floor(i / 2) * 80 + 50, width: 140, height: 70,
            correct: color === this.targetColor
        }));
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.targetColor;
        this.ctx.fillRect(50, 10, 200, 30);
        this.ctx.fillStyle = '#000';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Match this color', 150, 27);
        for (let btn of this.buttons) {
            this.ctx.fillStyle = btn.color;
            this.ctx.fillRect(btn.x + 5, btn.y, btn.width, btn.height);
        }
    }
    handleClick(e) {
        if (!this.gameActive) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        for (let btn of this.buttons) {
            if (x > btn.x + 5 && x < btn.x + 5 + btn.width && y > btn.y && y < btn.y + btn.height) {
                if (btn.correct) {
                    this.score += 10 + this.combo * 5; this.combo++;
                    document.getElementById('score').textContent = this.score; this.generateRound(); this.draw();
                } else { this.combo = 0; this.generateRound(); this.draw(); }
            }
        }
    }
    startTimer() {
        const timer = setInterval(() => {
            this.gameTime--;
            document.getElementById('time').textContent = this.gameTime;
            if (this.gameTime <= 0) { clearInterval(timer); this.endGame(); }
        }, 1000);
    }
    endGame() {
        this.gameActive = false; db.saveScore('colormatch', this.score);
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
        this.container = container; this.gridSize = 20; this.snake = [{x: 10, y: 10}]; this.food = {x: 15, y: 15};
        this.direction = {x: 1, y: 0}; this.nextDirection = {x: 1, y: 0}; this.score = 0; this.gameOver = false;
        this.setup(); this.gameLoop();
    }
    setup() {
        this.container.innerHTML = `<canvas id="snakeCanvas" width="300" height="400"></canvas><div class="game-info">Score: <span id="score">0</span> | Arrow keys to move! Press R to restart.</div>`;
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridWidth = this.canvas.width / this.gridSize; this.gridHeight = this.canvas.height / this.gridSize;
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowUp': if (this.direction.y === 0) this.nextDirection = {x: 0, y: -1}; break;
            case 'ArrowDown': if (this.direction.y === 0) this.nextDirection = {x: 0, y: 1}; break;
            case 'ArrowLeft': if (this.direction.x === 0) this.nextDirection = {x: -1, y: 0}; break;
            case 'ArrowRight': if (this.direction.x === 0) this.nextDirection = {x: 1, y: 0}; break;
            case 'r': case 'R': this.restart(); break;
        }
    }
    gameLoop() {
        if (!this.gameOver) { this.update(); this.draw(); setTimeout(() => this.gameLoop(), 100); }
    }
    update() {
        this.direction = this.nextDirection;
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        head.x = (head.x + this.gridWidth) % this.gridWidth; head.y = (head.y + this.gridHeight) % this.gridHeight;
        for (let segment of this.snake) { if (head.x === segment.x && head.y === segment.y) { this.endGame(); return; } }
        this.snake.unshift(head);
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10; document.getElementById('score').textContent = this.score;
            this.food = {x: Math.floor(Math.random() * this.gridWidth), y: Math.floor(Math.random() * this.gridHeight)};
        } else { this.snake.pop(); }
    }
    draw() {
        this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#00FF00';
        for (let segment of this.snake) {
            this.ctx.fillRect(segment.x * (this.canvas.width / this.gridWidth), segment.y * (this.canvas.height / this.gridHeight),
                this.canvas.width / this.gridWidth - 2, this.canvas.height / this.gridHeight - 2);
        }
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(this.food.x * (this.canvas.width / this.gridWidth), this.food.y * (this.canvas.height / this.gridHeight),
            this.canvas.width / this.gridWidth - 2, this.canvas.height / this.gridHeight - 2);
    }
    endGame() { this.gameOver = true; db.saveScore('snake', this.score);
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#FFF'; this.ctx.font = '30px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '20px Arial'; this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }
    restart() {
        this.snake = [{x: 10, y: 10}]; this.food = {x: 15, y: 15}; this.direction = {x: 1, y: 0}; this.nextDirection = {x: 1, y: 0};
        this.score = 0; this.gameOver = false; document.getElementById('score').textContent = '0'; this.gameLoop();
    }
}

// ===== MEMORY PUZZLE =====
class MemoryPuzzleGame {
    constructor(container) {
        this.container = container; this.score = 0; this.moves = 0; this.matched = 0; this.firstCard = null; this.secondCard = null; this.lockBoard = false;
        this.cards = []; this.symbols = ['⭐', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];
        this.setup();
    }
    setup() {
        this.container.innerHTML = `<canvas id="memoryCanvas" width="300" height="400"></canvas><div class="game-info">Moves: <span id="moves">0</span> | Matched: <span id="matched">0</span>/8</div>`;
        this.canvas = document.getElementById('memoryCanvas'); this.ctx = this.canvas.getContext('2d');
        this.createCards(); this.draw(); this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }
    createCards() {
        const deck = [...this.symbols, ...this.symbols];
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        this.cards = deck.map((symbol, i) => ({
            symbol, flipped: false, matched: false, x: (i % 4) * 75, y: Math.floor(i / 4) * 100, width: 70, height: 90
        }));
    }
    draw() {
        this.ctx.fillStyle = '#f0f0f0'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let card of this.cards) {
            this.ctx.fillStyle = card.matched ? '#90EE90' : (card.flipped ? '#87CEEB' : '#FFB6C1');
            this.ctx.fillRect(card.x, card.y, card.width, card.height);
            this.ctx.strokeStyle = '#333'; this.ctx.lineWidth = 2; this.ctx.strokeRect(card.x, card.y, card.width, card.height);
            if (card.flipped || card.matched) {
                this.ctx.fillStyle = '#000'; this.ctx.font = '40px Arial'; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
                this.ctx.fillText(card.symbol, card.x + card.width / 2, card.y + card.height / 2);
            }
        }
    }
    handleClick(e) {
        if (this.lockBoard) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        for (let card of this.cards) {
            if (x > card.x && x < card.x + card.width && y > card.y && y < card.y + card.height) {
                if (!card.flipped && !card.matched) {
                    card.flipped = true;
                    if (!this.firstCard) { this.firstCard = card; }
                    else if (!this.secondCard && card !== this.firstCard) {
                        this.secondCard = card; this.moves++; document.getElementById('moves').textContent = this.moves;
                        this.lockBoard = true; setTimeout(() => this.checkMatch(), 1000);
                    }
                }
            }
        }
        this.draw();
    }
    checkMatch() {
        if (this.firstCard.symbol === this.secondCard.symbol) {
            this.firstCard.matched = true; this.secondCard.matched = true; this.matched++; document.getElementById('matched').textContent = this.matched;
            if (this.matched === 8) this.endGame();
        } else {
            this.firstCard.flipped = false; this.secondCard.flipped = false;
        }
        this.firstCard = null; this.secondCard = null; this.lockBoard = false; this.draw();
    }
    endGame() {
        this.score = Math.max(0, 100 - this.moves * 5); db.saveScore('puzzle', this.score);
        setTimeout(() => {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFF'; this.ctx.font = '25px Arial'; this.ctx.textAlign = 'center';
            this.ctx.fillText('You Won!', 150, 150); this.ctx.font = '20px Arial';
            this.ctx.fillText(`Score: ${this.score}`, 150, 200); this.ctx.fillText(`Moves: ${this.moves}`, 150, 230);
        }, 500);
    }
}

// ===== PONG =====
class PongGame {
    constructor(container) {
        this.container = container; this.score = 0; this.gameOver = false; this.paddleY = 150; this.ballX = 150; this.ballY = 200;
        this.ballSpeedX = 3; this.ballSpeedY = 3; this.paddleHeight = 60; this.setup(); this.gameLoop();
    }
    setup() {
        this.container.innerHTML = `<canvas id="pongCanvas" width="300" height="400"></canvas><div class="game-info">Score: <span id="score">0</span> | Mouse to move | R to restart</div>`;
        this.canvas = document.getElementById('pongCanvas'); this.ctx = this.canvas.getContext('2d');
        document.addEventListener('mousemove', (e) => { const rect = this.canvas.getBoundingClientRect(); this.paddleY = e.clientY - rect.top - this.paddleHeight / 2; });
        document.addEventListener('keypress', (e) => { if (e.key.toLowerCase() === 'r') this.restart(); });
    }
    gameLoop() {
        if (!this.gameOver) { this.update(); this.draw(); } requestAnimationFrame(() => this.gameLoop());
    }
    update() {
        this.ballX += this.ballSpeedX; this.ballY += this.ballSpeedY;
        if (this.ballY <= 0 || this.ballY >= this.canvas.height) this.ballSpeedY *= -1;
        if (this.ballX >= this.canvas.width - 20 && this.ballY > this.paddleY && this.ballY < this.paddleY + this.paddleHeight) {
            this.ballSpeedX *= -1; this.score++; document.getElementById('score').textContent = this.score;
        }
        if (this.ballX > this.canvas.width) this.endGame();
    }
    draw() {
        this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#FFF'; this.ctx.fillRect(this.canvas.width - 10, this.paddleY, 10, this.paddleHeight);
        this.ctx.beginPath(); this.ctx.arc(this.ballX, this.ballY, 5, 0, Math.PI * 2); this.ctx.fill();
    }
    endGame() { this.gameOver = true; db.saveScore('pong', this.score); this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); this.ctx.fillStyle = '#FFF'; this.ctx.font = '25px Arial';
        this.ctx.textAlign = 'center'; this.ctx.fillText('Game Over!', 150, 150); this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 150, 200); this.ctx.fillText('Press R to restart', 150, 250);
    }
    restart() { this.score = 0; this.gameOver = false; this.ballX = 150; this.ballY = 200; this.ballSpeedX = 3; this.ballSpeedY = 3; document.getElementById('score').textContent = '0'; }
}

// ===== CLICK SPEED =====
class ClickSpeedGame {
    constructor(container) {
        this.container = container; this.clicks = 0; this.gameTime = 10; this.gameActive = false; this.setup(); setTimeout(() => this.startGame(), 1000);
    }
    setup() {
        this.container.innerHTML = `<div id="clickZone" style="width: 300px; height: 300px; background: #667eea; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 2em; color: white; user-select: none;">Click me!</div><div class="game-info" style="margin-top: 20px;">Time: <span id="time">10</span>s | Clicks: <span id="clicks">0</span></div>`;
        const zone = document.getElementById('clickZone'); zone.addEventListener('click', () => { if (this.gameActive) { this.clicks++; document.getElementById('clicks').textContent = this.clicks; } });
    }
    startGame() { this.gameActive = true; this.gameTime = 10; const timer = setInterval(() => {
        this.gameTime--; document.getElementById('time').textContent = this.gameTime;
        if (this.gameTime <= 0) { clearInterval(timer); this.endGame(); }
    }, 1000); }
    endGame() { this.gameActive = false; db.saveScore('clickspeed', this.clicks); document.getElementById('clickZone').innerHTML = `Game Over!<br>Clicks: ${this.clicks}`; document.getElementById('clickZone').style.background = '#764ba2'; }
}

// ===== MATH QUIZ =====
class MathQuizGame {
    constructor(container) {
        this.container = container; this.score = 0; this.questionNum = 0; this.gameActive = true; this.setup(); this.newQuestion();
    }
    setup() {
        this.container.innerHTML = `<div id="quiz" style="padding: 20px; text-align: center;"><h3 id="question" style="font-size: 1.5em; color: #1a1a2e; margin-bottom: 20px;"></h3><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;"><button id="ans1" onclick="app.games.currentGame.answer(0)" style="padding: 20px; font-size: 1em;"></button><button id="ans2" onclick="app.games.currentGame.answer(1)" style="padding: 20px; font-size: 1em;"></button><button id="ans3" onclick="app.games.currentGame.answer(2)" style="padding: 20px; font-size: 1em;"></button><button id="ans4" onclick="app.games.currentGame.answer(3)" style="padding: 20px; font-size: 1em;"></button></div><div class="game-info" style="margin-top: 20px;">Score: <span id="score">0</span> | Question: <span id="question-num">1</span>/10</div></div>`;
        app.games = { currentGame: this };
    }
    newQuestion() {
        const a = Math.floor(Math.random() * 20) + 1; const b = Math.floor(Math.random() * 20) + 1;
        const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        let correct = op === '+' ? a + b : op === '-' ? a - b : a * b;
        this.correct = correct;
        document.getElementById('question').textContent = `${a} ${op} ${b} = ?`;
        const answers = [correct];
        while (answers.length < 4) {
            let wrong = correct + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1);
            if (!answers.includes(wrong)) answers.push(wrong);
        }
        answers.sort(() => Math.random() - 0.5);
        for (let i = 0; i < 4; i++) document.getElementById(`ans${i + 1}`).textContent = answers[i];
        this.answers = answers;
    }
    answer(idx) {
        if (this.answers[idx] === this.correct) { this.score++; document.getElementById('score').textContent = this.score; this.questionNum++; document.getElementById('question-num').textContent = this.questionNum; }
        if (this.questionNum >= 10) { this.endGame(); } else { this.newQuestion(); }
    }
    endGame() { db.saveScore('mathquiz', this.score); document.getElementById('quiz').innerHTML = `<h2 style="color: #1a1a2e;">Quiz Complete!</h2><p style="font-size: 1.5em; color: #667eea;">Final Score: ${this.score}/10</p>`; }
}

// ===== TETRIS (SIMPLIFIED) =====
class TetrisGame {
    constructor(container) {
        this.container = container; this.score = 0; this.gameOver = false; this.cols = 10; this.rows = 20; this.blockSize = 15;
        this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0)); this.currentBlock = this.randomBlock(); this.setup(); this.gameLoop();
    }
    setup() {
        this.container.innerHTML = `<canvas id="tetrisCanvas" width="300" height="300"></canvas><div class="game-info">Score: <span id="score">0</span> | Arrow keys to move | Space to rotate</div>`;
        this.canvas = document.getElementById('tetrisCanvas'); this.ctx = this.canvas.getContext('2d');
        document.addEventListener('keydown', (e) => this.handleKey(e));
        this.draw();
    }
    randomBlock() { return {x: 4, y: 0, shape: [[[1, 1], [1, 1]]], color: '#667eea', type: 0}; }
    gameLoop() { if (!this.gameOver) { this.update(); this.draw(); setTimeout(() => this.gameLoop(), 500); } }
    update() {
        this.currentBlock.y++;
        if (this.collides()) { this.currentBlock.y--; this.placeBlock(); this.clearLines(); this.currentBlock = this.randomBlock(); }
        if (this.currentBlock.y <= 0 && this.collides()) { this.endGame(); }
    }
    collides() {
        for (let i = 0; i < this.currentBlock.shape[0].length; i++) {
            for (let j = 0; j < this.currentBlock.shape[0][i].length; j++) {
                if (this.currentBlock.shape[0][i][j]) {
                    const x = this.currentBlock.x + j; const y = this.currentBlock.y + i;
                    if (x < 0 || x >= this.cols || y >= this.rows || (y >= 0 && this.grid[y][x])) return true;
                }
            }
        }
        return false;
    }
    placeBlock() {
        for (let i = 0; i < this.currentBlock.shape[0].length; i++) {
            for (let j = 0; j < this.currentBlock.shape[0][i].length; j++) {
                if (this.currentBlock.shape[0][i][j]) {
                    const x = this.currentBlock.x + j; const y = this.currentBlock.y + i;
                    if (y >= 0) this.grid[y][x] = 1;
                }
            }
        }
    }
    clearLines() {
        for (let i = this.rows - 1; i >= 0; i--) {
            if (this.grid[i].every(cell => cell === 1)) {
                this.grid.splice(i, 1); this.grid.unshift(Array(this.cols).fill(0)); this.score += 10; document.getElementById('score').textContent = this.score;
            }
        }
    }
    draw() {
        this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#666'; this.ctx.strokeStyle = '#444';
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j]) {
                    this.ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize - 1, this.blockSize - 1);
                }
                this.ctx.strokeRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
            }
        }
        this.ctx.fillStyle = this.currentBlock.color;
        for (let i = 0; i < this.currentBlock.shape[0].length; i++) {
            for (let j = 0; j < this.currentBlock.shape[0][i].length; j++) {
                if (this.currentBlock.shape[0][i][j]) {
                    this.ctx.fillRect((this.currentBlock.x + j) * this.blockSize, (this.currentBlock.y + i) * this.blockSize, this.blockSize - 1, this.blockSize - 1);
                }
            }
        }
    }
    handleKey(e) {
        if (e.key === 'ArrowLeft') { this.currentBlock.x--; if (this.collides()) this.currentBlock.x++; }
        if (e.key === 'ArrowRight') { this.currentBlock.x++; if (this.collides()) this.currentBlock.x--; }
    }
    endGame() { this.gameOver = true; db.saveScore('tetris', this.score); this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); this.ctx.fillStyle = '#FFF'; this.ctx.font = '25px Arial';
        this.ctx.textAlign = 'center'; this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
}