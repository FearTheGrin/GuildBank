import test from 'ava';
import td from 'testdouble';

// test helpers
import {mockLogger} from '../../../TestHelpers/helper-funcs.js';

import Service from './Service.js';

let serviceConfigs = {
  doStuff: true
};

function setupTestService(t) {
  t.context = t.context || {};
  let service = new Service('test',serviceConfigs);
  mockLogger(service);

  t.context.service = service;
}

test('Service constructor should store configs', t => {
  setupTestService(t);
  t.is(t.context.service.config, serviceConfigs, 'Did not store the configs!');
});

test('Service constructor should set up empty config object if one is not given', t => {
  let service = new Service('test');
  let {config} = service;
  t.is(typeof config, 'object');
  t.falsy(Object.keys(config).length);
});

test('Service should have a log method', t => {
  setupTestService(t);
  let { service }  = t.context;
  t.is(typeof service.log, 'function', 'Not a function.');
  service.log('snap!');
  let logger = service.logger;
  td.verify(logger.log('snap!'));
});

