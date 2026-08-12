// Simple offline database using localStorage
class Database {
    constructor() {
        this.initDB();
    }

    initDB() {
        // Initialize with empty data if nothing exists
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify({}));
        }
        if (!localStorage.getItem('scores')) {
            localStorage.setItem('scores', JSON.stringify({}));
        }
    }

    // User management
    registerUser(username, password, email) {
        const users = JSON.parse(localStorage.getItem('users'));
        
        if (users[username]) {
            return { success: false, message: 'Username already taken' };
        }

        users[username] = {
            password: password, // In real app, hash this!
            email: email,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('users', JSON.stringify(users));
        return { success: true, message: 'Account created!' };
    }

    loginUser(username, password) {
        const users = JSON.parse(localStorage.getItem('users'));
        
        if (!users[username]) {
            return { success: false, message: 'User not found' };
        }

        if (users[username].password !== password) {
            return { success: false, message: 'Wrong password' };
        }

        localStorage.setItem('currentUser', username);
        return { success: true, message: 'Logged in!', username: username };
    }

    getCurrentUser() {
        return localStorage.getItem('currentUser');
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    // Score management
    saveScore(game, score) {
        const username = this.getCurrentUser();
        if (!username) return false;

        const scores = JSON.parse(localStorage.getItem('scores'));
        
        if (!scores[game]) {
            scores[game] = {};
        }

        if (!scores[game][username] || scores[game][username] < score) {
            scores[game][username] = score;
        }

        localStorage.setItem('scores', JSON.stringify(scores));
        return true;
    }

    getLeaderboard(game) {
        const scores = JSON.parse(localStorage.getItem('scores'));
        
        if (!scores[game]) {
            return [];
        }

        const leaderboard = Object.entries(scores[game])
            .map(([username, score]) => ({ username, score }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Top 10

        return leaderboard;
    }

    getUserScore(game, username) {
        const scores = JSON.parse(localStorage.getItem('scores'));
        return scores[game] && scores[game][username] ? scores[game][username] : 0;
    }
}

const db = new Database();