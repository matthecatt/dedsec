class App {
    constructor() {
        this.currentPage = 'login';
        this.currentGame = null;
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        const currentUser = db.getCurrentUser();

        if (!currentUser) {
            this.renderLogin();
        } else {
            this.renderMenu();
        }
    }

    renderLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <h1>🎮 DedSec Games</h1>
                <div id="auth-form">
                    <h2 id="auth-title">Login</h2>
                    <div id="message"></div>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="username" placeholder="Enter username">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" placeholder="Enter password">
                    </div>
                    <div id="email-group" class="form-group" style="display:none;">
                        <label>Email</label>
                        <input type="email" id="email" placeholder="Enter email">
                    </div>
                    <button onclick="app.handleAuth()">Login</button>
                    <button onclick="app.toggleAuth()" style="background: #999;">Create Account</button>
                </div>
            </div>
        `;
        this.isLoginMode = true;
    }

    toggleAuth() {
        this.isLoginMode = !this.isLoginMode;
        const title = document.getElementById('auth-title');
        const emailGroup = document.getElementById('email-group');
        const btn = document.querySelector('button');

        if (this.isLoginMode) {
            title.textContent = 'Login';
            emailGroup.style.display = 'none';
            btn.textContent = 'Login';
        } else {
            title.textContent = 'Create Account';
            emailGroup.style.display = 'block';
            btn.textContent = 'Create Account';
        }
    }

    handleAuth() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');

        if (!username || !password) {
            messageDiv.innerHTML = '<div class="error">Fill in all fields!</div>';
            return;
        }

        let result;
        if (this.isLoginMode) {
            result = db.loginUser(username, password);
        } else {
            const email = document.getElementById('email').value;
            if (!email) {
                messageDiv.innerHTML = '<div class="error">Fill in all fields!</div>';
                return;
            }
            result = db.registerUser(username, password, email);
            if (result.success) {
                db.loginUser(username, password);
            }
        }

        if (result.success) {
            messageDiv.innerHTML = `<div class="success">${result.message}</div>`;
            setTimeout(() => this.render(), 500);
        } else {
            messageDiv.innerHTML = `<div class="error">${result.message}</div>`;
        }
    }

    renderMenu() {
        const app = document.getElementById('app');
        const currentUser = db.getCurrentUser();
        app.innerHTML = `
            <div class="container">
                <div class="user-info">
                    Welcome, <strong>${currentUser}</strong>!
                    <button class="logout-btn" onclick="app.logout()">Logout</button>
                </div>
                <h1>🎮 DedSec Games</h1>
                <div class="menu">
                    <button class="menu-btn" onclick="app.playGame('flappybird')">🐦 Flappy Bird</button>
                    <button class="menu-btn" onclick="app.playGame('colormatch')">🎨 Color Match</button>
                    <button class="menu-btn" onclick="app.playGame('snake')">🐍 Snake</button>
                    <button class="menu-btn" onclick="app.playGame('puzzle')">🧩 Memory Puzzle</button>
                </div>
            </div>
        `;
    }

    playGame(game) {
        this.currentGame = game;
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <button onclick="app.backToMenu()" style="float: left; width: auto; padding: 8px 15px;">← Back</button>
                <h2>${this.getGameTitle(game)}</h2>
                <div id="game-container" class="game-container"></div>
            </div>
        `;

        // Load the game
        this.loadGame(game);
    }

    getGameTitle(game) {
        const titles = {
            flappybird: '🐦 Flappy Bird',
            colormatch: '🎨 Color Match',
            snake: '🐍 Snake Game',
            puzzle: '🧩 Memory Puzzle'
        };
        return titles[game] || 'Game';
    }

    loadGame(game) {
        const container = document.getElementById('game-container');
        
        if (game === 'flappybird') {
            new FlappyBirdGame(container);
        } else if (game === 'colormatch') {
            new ColorMatchGame(container);
        } else if (game === 'snake') {
            new SnakeGame(container);
        } else if (game === 'puzzle') {
            new MemoryPuzzleGame(container);
        }
    }

    backToMenu() {
        this.currentGame = null;
        this.render();
    }

    logout() {
        db.logout();
        this.render();
    }
}

const app = new App();