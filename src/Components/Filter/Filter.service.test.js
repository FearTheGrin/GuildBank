import test from "ava";
import td from 'testdouble';

import { mockLogger } from '../../../TestHelpers/helper-funcs';

import FilterService from './Filter.service';

const mockItems = [
  { name: 'testWand', id: 1, type: 'Weapon', subType: 'Wands' },
  { name:"Stylish Black Shirt", id: 2, equipLoc:"INVTYPE_BODY", type:"Armor", subType:"Miscellaneous" },
  { name:"Schematic: Mechanical Squirrel", id:3, type:"Recipe", subType:"Engineering" }
];
const [wand, shirt, recipe] = mockItems;

function setupService(t) {
  let instance = new FilterService();
  mockLogger(instance);
  t.context = { service: instance };
}

test.beforeEach(setupService);

test('FilterService instance should have a log method', t => {
  let { service } = t.context;
  t.is(typeof service.log, 'function', 'Log method does not exist');
});

test('FilterService buildTextFilterPattern should build the right RegEx', t => {
  let {service} = t.context;
  let stringToTest = 'synaptic';
  let snap = 'snap';
  let fuzzyExpr = service.buildTextFilterPattern(snap);
  let strictExpr = service.buildTextFilterPattern(snap, true);
  t.true(fuzzyExpr.test(stringToTest));
  t.false(strictExpr.test(stringToTest));
});

test('FilterService.runTextFilter', t => {
  let { service } = t.context;

  // make sure it exists, just in case
  t.is(typeof service.runTextFilter, 'function', 'not a function');

  let trlMatch = service.runTextFilter(mockItems, 'trl');
  t.is(trlMatch.length, 1, 'Wrong number of matches');
  t.is(trlMatch[0], mockItems[2], 'Wrong item matched');

  // strict match - shouldn't find anything
  let trlStrictMatch = service.runTextFilter(mockItems, 'trl', true);
  t.is(trlStrictMatch.length,0,'This shouldn\'t find anything');
});