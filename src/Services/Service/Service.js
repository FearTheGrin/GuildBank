import Logger from '../../Services/Logger.service.js';
import {LogLevels} from '../../Services/Logger.service.js';

export default function Service(name, config) {
  this.logger = new Logger(name);
  this.config = config || {};
}
Service.prototype.log = function(){
  let args = Array.prototype.slice.apply(arguments);
  this.logger.log.apply(this.logger, args);
}