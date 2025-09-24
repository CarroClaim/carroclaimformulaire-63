// Système de logging centralisé pour le debugging

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: any;
  timestamp: Date;
  component?: string;
  action?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private currentLevel = LogLevel.DEBUG;

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  error(message: string, context?: any, component?: string, action?: string) {
    this.log(LogLevel.ERROR, message, context, component, action);
  }

  warn(message: string, context?: any, component?: string, action?: string) {
    this.log(LogLevel.WARN, message, context, component, action);
  }

  info(message: string, context?: any, component?: string, action?: string) {
    this.log(LogLevel.INFO, message, context, component, action);
  }

  debug(message: string, context?: any, component?: string, action?: string) {
    this.log(LogLevel.DEBUG, message, context, component, action);
  }

  private log(level: LogLevel, message: string, context?: any, component?: string, action?: string) {
    if (level > this.currentLevel) return;

    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date(),
      component,
      action
    };

    this.logs.push(entry);
    
    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs.splice(0, this.logs.length - this.maxLogs);
    }

    // Log vers la console en développement
    if (process.env.NODE_ENV === 'development') {
      const levelName = LogLevel[level];
      const prefix = `[${levelName}]${component ? `[${component}]` : ''}${action ? `[${action}]` : ''}`;
      
      switch (level) {
        case LogLevel.ERROR:
          console.error(prefix, message, context);
          break;
        case LogLevel.WARN:
          console.warn(prefix, message, context);
          break;
        case LogLevel.INFO:
          console.info(prefix, message, context);
          break;
        case LogLevel.DEBUG:
          console.log(prefix, message, context);
          break;
      }
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Helper pour tracer les performances
export const withPerformance = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  component?: string
): Promise<T> => {
  const start = performance.now();
  logger.debug(`Starting ${operationName}`, undefined, component, operationName);
  
  try {
    const result = await operation();
    const duration = performance.now() - start;
    logger.info(`Completed ${operationName}`, { duration: `${duration.toFixed(2)}ms` }, component, operationName);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`Failed ${operationName}`, { error, duration: `${duration.toFixed(2)}ms` }, component, operationName);
    throw error;
  }
};