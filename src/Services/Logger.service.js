export const LogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  log: 3,
  debug: 4
};
Object.freeze(LogLevels);

class Logger {
  constructor(name, logLevel){
    this.name = name;
    this.logLevel = logLevel || 1;
  }

  setLogLevel(logLevel) {
    this.logLevel = logLevel;
  }

  printToConsole(fn, level, argsIn) {
    let args = argsIn ? Array.prototype.slice.apply(argsIn) : Array.prototype.slice.apply(arguments, [2]);
    if (level <= this.logLevel && !global.testing) {
      console[fn].apply(console, [`[${this.name}]`].concat(args));
    }
  }

  error() {
    this.printToConsole.apply(this, ['error',LogLevels.error, arguments]);
  }

  warn() {
    this.printToConsole.apply(this, ['warn',LogLevels.warn, arguments]);
  }

  info() {
    this.printToConsole.apply(this, ['info',LogLevels.info, arguments]);
  }

  log() {
    this.printToConsole.apply(this, ['log',LogLevels.log, arguments]);
  }

  debug() {
    this.printToConsole.apply(this, ['debug',LogLevels.debug, arguments]);
  }
}
export default Logger;