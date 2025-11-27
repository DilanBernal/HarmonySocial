import LoggerPort from "../../../../../src/domain/ports/utils/LoggerPort";

const createLoggerPort = (): jest.Mocked<LoggerPort> => {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    fatal: jest.fn(),
    child: jest.fn(),
    setBindings: jest.fn(),
    getBindings: jest.fn(),
    flush: jest.fn(),
    level: "info",
    levels: {},
  } as unknown as jest.Mocked<LoggerPort>;
}

export default createLoggerPort;