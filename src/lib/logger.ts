const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  error: (message: string, error?: unknown, info?: unknown) => {
    if (isProd) {
      console.error(`[CoolTools Error] ${message}`);
    } else {
      console.error(`[CoolTools Error] ${message}`, error, info);
    }
  },
  warn: (message: string, info?: unknown) => {
    if (isProd) {
      console.warn(`[CoolTools Warn] ${message}`);
    } else {
      console.warn(`[CoolTools Warn] ${message}`, info);
    }
  },
  info: (message: string, info?: unknown) => {
    if (!isProd) {
      console.info(`[CoolTools Info] ${message}`, info);
    }
  }
};

export default logger;
