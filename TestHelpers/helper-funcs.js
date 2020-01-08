import td from 'testdouble';

export function mockLogger(obj) {
  let logger = td.object(obj.logger);
  obj.logger = logger;
}