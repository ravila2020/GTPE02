const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

// console.log(logDir);
// Crea el directorio si este no existe
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: 'YYYY-MM-DD'
});
// format.label({ label: path.basename(process.mainModule.filename) }),

const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'development' ? 'verbose' : 'info',
    format: format.combine(
        format.label({ label: 'right meow!' }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }), format.json(),

        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport
    ]
});

module.exports = logger;