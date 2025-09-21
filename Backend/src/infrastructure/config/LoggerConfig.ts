import { LoggerOptions } from "pino";
import envs from "./environment-vars";

const loggerConfig: LoggerOptions = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
  level: envs.LOG_LEVEL || "info",
};

export default loggerConfig;
