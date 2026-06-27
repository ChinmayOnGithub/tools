export const logger = {
  error: (message: string, error?: unknown, info?: unknown) => {
    console.error(`[CoolTools Error] ${message}`, error, info);
  },
  warn: (message: string, info?: unknown) => {
    console.warn(`[CoolTools Warn] ${message}`, info);
  },
  info: (message: string, info?: unknown) => {
    console.info(`[CoolTools Info] ${message}`, info);
  }
};

export default logger;
