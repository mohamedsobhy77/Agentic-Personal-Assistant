const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logFilePath = path.join(__dirname, 'app.log');
    }

    log(message) {
        const timestamp = new Date().toISOString();
        console.log(`[LOG] ${timestamp}: ${message}`);
        fs.appendFileSync(this.logFilePath, `[LOG] ${timestamp}: ${message}\n`);
    }

    error(message) {
        const timestamp = new Date().toISOString();
        console.error(`[ERROR] ${timestamp}: ${message}`);
        fs.appendFileSync(this.logFilePath, `[ERROR] ${timestamp}: ${message}\n`);
    }

    info(message) {
        const timestamp = new Date().toISOString();
        console.info(`[INFO] ${timestamp}: ${message}`);
        fs.appendFileSync(this.logFilePath, `[INFO] ${timestamp}: ${message}\n`);
    }

    warn(message) {
        const timestamp = new Date().toISOString();
        console.warn(`[WARN] ${timestamp}: ${message}`);
        fs.appendFileSync(this.logFilePath, `[WARN] ${timestamp}: ${message}\n`);
    }
}

module.exports = new Logger();