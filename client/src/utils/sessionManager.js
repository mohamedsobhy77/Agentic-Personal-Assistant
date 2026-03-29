'use strict';

class SessionManager {
    constructor() {
        this.sessions = {};
    }

    createSession(userId) {
        const sessionId = this.generateSessionId();
        this.sessions[sessionId] = { userId, createdAt: new Date() };
        return sessionId;
    }

    getSession(sessionId) {
        return this.sessions[sessionId];
    }

    destroySession(sessionId) {
        delete this.sessions[sessionId];
    }

    generateSessionId() {
        return 'session-' + Math.random().toString(36).substr(2, 9);
    }
}

module.exports = new SessionManager();
