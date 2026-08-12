class App {
    constructor() {
        this.currentPage = 'login';
        this.currentGame = null;
        this.hackerMode = false;
        this.render();
        this.setupHackerMode();
    }

    setupHackerMode() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                this.activateHackerMode();
            }
        });
    }

    activateHackerMode() {
        this.hackerMode = true;
        const app = document.getElementById('app');
        app.innerHTML = `
            <div id="hacker-terminal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 9999; overflow: hidden; font-family: 'Orbitron', monospace; color: #0ff; padding: 20px; box-sizing: border-box; border: 3px solid #0ff; box-shadow: 0 0 50px #0ff, inset 0 0 50px rgba(0, 255, 255, 0.2);">
                <div style="position: absolute; top: 10px; right: 20px; font-size: 1.2em; cursor: pointer; color: #ff00ff; font-weight: bold;" onclick="app.closeHackerMode()">[ CLOSE ]</div>
                <div style="margin-bottom: 20px; text-shadow: 0 0 10px #0ff;">
                    <div style="font-size: 1.5em; font-weight: bold; letter-spacing: 2px;">▓▒░ DEDSEC TERMINAL ░▒▓</div>
                    <div style="font-size: 0.9em; color: #00ff00; margin-top: 5px;">[ ACCESS LEVEL: MAXIMUM ]</div>
                    <div style="font-size: 0.85em; color: #666; margin-top: 3px;">Type anything to execute code...</div>
                </div>
                <div id="terminal-output" style="height: 85%; overflow-y: auto; border: 2px solid #0ff; padding: 15px; background: rgba(0, 10, 20, 0.9); margin-bottom: 15px; box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.1);"></div>
                <input type="text" id="terminal-input" placeholder="> " style="width: 100%; background: rgba(0, 255, 255, 0.1); border: 2px solid #0ff; color: #0ff; font-family: 'Orbitron', monospace; font-size: 1em; padding: 10px; box-sizing: border-box; text-shadow: 0 0 5px #0ff;" autofocus>
            </div>
        `;
        
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        
        const hackerLines = [
            'INITIALIZING SYSTEM...',
            'SCANNING FIREWALL...',
            'BYPASSING SECURITY PROTOCOLS...',
            'ACCESSING MAINFRAME...',
            '[████████████████████] 100%',
            'WELCOME TO DEDSEC TERMINAL',
            ''
        ];
        
        hackerLines.forEach((line, idx) => {
            setTimeout(() => {
                output.innerHTML += `<div style="color: #00ff00; margin: 3px 0; text-shadow: 0 0 5px #00ff00;">> ${line}</div>`;
                output.scrollTop = output.scrollHeight;
            }, idx * 100);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value;
                
                output.innerHTML += `<div style="color: #0ff; margin: 8px 0; text-shadow: 0 0 5px #0ff;">>> ${command}</div>`;
                
                const codeLines = this.generateHackerCode();
                codeLines.forEach((line, idx) => {
                    setTimeout(() => {
                        const newLine = document.createElement('div');
                        newLine.textContent = line;
                        newLine.style.color = line.includes('ERROR') || line.includes('FAIL') ? '#ff3333' : 
                                             line.includes('SUCCESS') || line.includes('COMPLETE') ? '#00ff00' : '#0ff';
                        newLine.style.margin = '2px 0';
                        newLine.style.textShadow = `0 0 5px ${newLine.style.color}`;
                        newLine.style.fontFamily = "'Orbitron', monospace";
                        output.appendChild(newLine);
                        output.scrollTop = output.scrollHeight;
                    }, idx * 50);
                });
                
                input.value = '';
            }
        });
    }

    generateHackerCode() {
        const codeSnippets = [
            '$ ACCESSING: 192.168.1.1',
            '$ DECRYPTING DATABASE...',
            '$ BYPASSING FIREWALL: SUCCESS',
            '$ DOWNLOADING FILES... 45%',
            '$ SCANNING NETWORK NODES...',
            '$ EXTRACTING DATA PACKETS',
            '$ CRACKING ENCRYPTION KEY',
            '$ ACCESS GRANTED',
            '$ SYSTEM COMPROMISED',
            '$ ERASING TRACES...',
            '$ UPLOADING VIRUS...',
            '$ INITIALIZING PAYLOAD',
            '$ REROUTING SIGNAL',
            '$ CAPTURING TRAFFIC',
            '$ MONITORING CONNECTIONS',
            '$ PENETRATION SUCCESSFUL',
            '$ EXECUTING PAYLOAD',
            '$ [████████████████████] 100%',
            '$ OPERATION COMPLETE'
        ];
        
        const lineCount = Math.floor(Math.random() * 5) + 3;
        let lines = [];
        
        for (let i = 0; i < lineCount; i++) {
            lines.push(codeSnippets[Math.floor(Math.random() * codeSnippets.length)]);
        }
        
        return lines;
    }

    closeHackerMode() {
        this.hackerMode = false;
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
        if (this.isLoginMode) {
            title.textContent = 'Login';
            emailGroup.style.display = 'none';
        } else {
            title.textContent = 'Create Account';
            emailGroup.style.display = 'block';
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
                    <button class="menu-btn" onclick="app.playGame('flappybird')"><span>🐦</span>Flappy Bird</button>
                    <button class="menu-btn" onclick="app.playGame('colormatch')"><span>🎨</span>Color Match</button>
                    <button class="menu-btn" onclick="app.playGame('snake')"><span>🐍</span>Snake</button>
                    <button class="menu-btn" onclick="app.playGame('puzzle')"><span>🧩</span>Memory</button>
                    <button class="menu-btn" onclick="app.playGame('pong')"><span>🏓</span>Pong</button>
                    <button class="menu-btn" onclick="app.playGame('clickspeed')"><span>⚡</span>Click Speed</button>
                    <button class="menu-btn" onclick="app.playGame('mathquiz')"><span>🧮</span>Math Quiz</button>
                    <button class="menu-btn" onclick="app.playGame('tetris')"><span>⬜</span>Tetris</button>
                </div>
            </div>
        `;
    }

    playGame(game) {
        this.currentGame = game;
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <button class="back-btn" onclick="app.backToMenu()">← Back</button>
                <h2>${this.getGameTitle(game)}</h2>
                <div id="game-container" class="game-container"></div>
            </div>
        `;
        this.loadGame(game);
    }

    getGameTitle(game) {
        const titles = {
            flappybird: '🐦 Flappy Bird',
            colormatch: '🎨 Color Match',
            snake: '🐍 Snake Game',
            puzzle: '🧩 Memory Puzzle',
            pong: '🏓 Pong',
            clickspeed: '⚡ Click Speed Challenge',
            mathquiz: '🧮 Math Quiz',
            tetris: '⬜ Tetris'
        };
        return titles[game] || 'Game';
    }

    loadGame(game) {
        const container = document.getElementById('game-container');
        if (game === 'flappybird') new FlappyBirdGame(container);
        else if (game === 'colormatch') new ColorMatchGame(container);
        else if (game === 'snake') new SnakeGame(container);
        else if (game === 'puzzle') new MemoryPuzzleGame(container);
        else if (game === 'pong') new PongGame(container);
        else if (game === 'clickspeed') new ClickSpeedGame(container);
        else if (game === 'mathquiz') new MathQuizGame(container);
        else if (game === 'tetris') new TetrisGame(container);
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
