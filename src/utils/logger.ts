import chalk from "chalk";
import fs from "fs";

type LogLevel = "debug" | "info" | "warn" | "error" | "silent";
const levelOrder: LogLevel[] = ["debug", "info", "warn", "error", "silent"];

class Logger {
    private currentLevel: LogLevel;
    private logs: string[] = [];

    constructor(level: LogLevel = "info") {
        this.currentLevel = level;
    }

    public setLevel(level: LogLevel) {
        this.currentLevel = level;
    }

    private shouldLog(level: LogLevel): boolean {
        return levelOrder.indexOf(level) >= levelOrder.indexOf(this.currentLevel);
    }

    private format(level: string, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${level.toUpperCase()} ${timestamp}] -> ${message}`;
    }

    private record(level: LogLevel, message: string) {
        if (!this.shouldLog(level)) return;
        const formatted = this.format(level, message);
        this.logs.push(formatted);

        switch (level) {
            case "debug":
                console.log(chalk.gray(formatted));
                break;
            case "info":
                console.log(chalk.cyan(formatted));
                break;
            case "warn":
                console.warn(chalk.yellow(formatted));
                break;
            case "error":
                console.error(chalk.red(formatted));
                break;
        }
    }

    public debug(message: string) {
        this.record("debug", message);
    }

    public info(message: string) {
        this.record("info", message);
    }

    public warn(message: string) {
        this.record("warn", message);
    }

    public error(message: string) {
        this.record("error", message);
    }

    public save(filePath: string = "logs.txt") {
        const data = this.logs.join("\n");
        fs.writeFileSync(filePath, data, { encoding: "utf-8" });
        console.log(chalk.green(`[LOGGER] ログをファイルに保存しました: ${filePath}`));
    }
}

export { Logger };