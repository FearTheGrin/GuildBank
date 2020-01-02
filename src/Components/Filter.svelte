<script>
import { createEventDispatcher, afterUpdate } from 'svelte';

import { FilterList } from '../Models/Filter.model.js';
import Logger from '../Services/Logger.service';
import {LogLevels} from '../Services/Logger.service';

const log = new Logger('Filter Component');
// log.setLogLevel(LogLevels.debug);

const dispatch = createEventDispatcher();

export let data = [];

let selectedFilters = [];
let textFilter = '';
let isTextFilterStrict = false;

const weaponTypes = new FilterList('Weapon', [
  ['One-Handed Axes','One-Handed Axes'],
  ['Two-Handed Axes', 'Two-Handed Axes'],
  ['Bows', 'Bows'],
  ['Guns', 'Guns'],
  ['One-Handed Maces', 'One-Handed Maces'],
  ['Two-Handed Maces', 'Two-Handed Maces'],
  ['Polearms', 'Polearms'],
  ['One-Handed Swords', 'One-Handed Swords'],
  ['Two-Handed Swords', 'Two-Handed Swords'],
  ['Warglaives', 'Warglaives'],
  ['Staves', 'Staves'],
  ['Fist Weapons', 'Fist Weapons'],
  ['Miscellaneous', 'Miscellaneous'],
  ['Daggers', 'Daggers'],
  ['Thrown', 'Thrown'],
  ['Spears', 'Spears'],
  ['Crossbows', 'Crossbows'],
  ['Wands', 'Wands'],
  ['Fishing Poles', 'Fishing Poles']
], 'subType');


let armorSlots = new FilterList('Slot', [
  ["Head", "INVTYPE_HEAD"],
  ["Neck", "INVTYPE_NECK"],
  ["Shoulder", "INVTYPE_SHOULDER"],
  ["Shirt", "INVTYPE_BODY"],
  ["Chest", "INVTYPE_CHEST"],
  ["Chest", "INVTYPE_ROBE"],
  ["Waist", "INVTYPE_WAIST"],
  ["Legs", "INVTYPE_LEGS"],
  ["Feet", "INVTYPE_FEET"],
  ["Wrist", "INVTYPE_WRIST"],
  ["Hands", "INVTYPE_HAND"],
  ["Fingers", "INVTYPE_FINGER"],
  ["Trinkets", "INVTYPE_TRINKET"],
  ["Cloaks", "INVTYPE_CLOAK"],
  ["Shield", "INVTYPE_SHIELD"],
  ["Held", "INVTYPE_HOLDABLE"],
  ["Relics", "INVTYPE_RELIC"],
  ["Tabard", "INVTYPE_TABARD"]
], 'equipLoc');

let armorSubs = new FilterList('ArmorSubType',[
  ["Miscellaneous", "Miscellaneous", armorSlots],
  ["Cloth","Cloth", armorSlots],
  ["Leather","Leather", armorSlots],
  ["Mail","Mail", armorSlots],
  ["Plate","Plate", armorSlots],
  ["Cosmetic","Cosmetic", armorSlots],
  ["Shields","Shields"],
  ["Librams","Librams"],
  ["Idols","Idols"],
  ["Totems","Totems"],
  ["Sigils","Sigils"],
  ["Relic","Relic"]
], 'subType');

let recipeSubtypes = new FilterList('RecipeSubType',[
  ['Cooking'],
  ['First Aid'],
  ['Alchemy'],
  ['Blacksmithing'],
  ['Enchanting'],
  ['Engineering'],
  ['Leatherworking'],
  ['Tailoring'],
  ['Book']

], 'subType');

const mainCategories = new FilterList('Type', [
  ['Armor', 'Armor', armorSubs],
  ['Container', 'Container'],
  ['Recipe', 'Recipe', recipeSubtypes],
  ['Trade Goods', ['Trade Goods','Reagent']],
  ['Weapon', 'Weapon', weaponTypes],
], 'type');

log.debug(mainCategories);

function testIt(item, path){
  log.debug('testing',item.name, JSON.stringify(path));
  log.debug(mainCategories.filter(item, path));
}

function testItemFiltering(){
  let testItem1 = {name: 'testWand', type: 'Weapon', subType: 'Wands'};
  testIt(testItem1, ['Armor','Wands']);
  testIt(testItem1, ['Weapon','Wands']);
  testIt(testItem1, ['Weapon','Daggers']);

  let testItem2 = {"equipLoc":"INVTYPE_BODY", "type":"Armor", "rarity":1, "slot":11, "subType":"Miscellaneous", "name":"Stylish Black Shirt"}
  // testIt(testItem2, ['Weapon']);
  // testIt(testItem2, ['Armor']);
  testIt(testItem2, ['Armor', 'Miscellaneous']);
  testIt(testItem2, ['Armor', 'Miscellaneous','']);
  // testIt(testItem2, ['Armor', 'Miscellaneous', 'Shirt']);
  // testIt(testItem2, ['Armor', 'Miscellaneous', 'Tabard']);

  // let testItem3 = {"type":"Recipe","rarity":2,"slot":11,"id":4408,"subType":"Engineering","count":1,"name":"Schematic: Mechanical Squirrel","icon":134942};
  // testIt(testItem3, ['Weapon']);
  // testIt(testItem3, ['Recipe']);
  // testIt(testItem3, ['Recipe','Tailoring']);
  // testIt(testItem3, ['Recipe','Engineering']);
}

function testGetFilterItems() {
  log.debug(mainCategories.getFilterEntries());
  log.debug(mainCategories.getFilterEntries(['Armor']));
}

// testItemFiltering();
// testGetFilterItems();

let currentSelectedItem;

let activeFilterOptions = mainCategories.getFilterEntries(selectedFilters);

function changeFilterOption() {
  selectedFilters = selectedFilters.concat([currentSelectedItem]);
  currentSelectedItem = "";
  activeFilterOptions = mainCategories.getFilterEntries(selectedFilters);
  filterData();
  log.debug('selectedFilters',selectedFilters);
}

function stepBack() {
  selectedFilters = selectedFilters.slice(0,selectedFilters.length - 1);
  activeFilterOptions = mainCategories.getFilterEntries(selectedFilters);
  filterData();
}

function buildTextFilterPattern(userInput, isStrictOnly){
  let textPattern = '';
  if(isStrictOnly){
    textPattern  = userInput;
  } else {
    textPattern = userInput.split("").reduce((a,b) => { return a+'[^'+b+']*'+b });
  }
  let regPattern = textPattern ? textPattern : '.*';
  log.debug('Filter text pattern:',regPattern);
  return new RegExp(regPattern,'i');
}

function testRegExBuilder(){
  function runTest(item, testStr){
    log.debug(item,'->','"'+testStr+'"','?',item.test(testStr));
  }
  let a1 = buildTextFilterPattern('abcd');
  let a2 = buildTextFilterPattern('abcd',true);
  let b1 = buildTextFilterPattern('bananas');
  let b2 = buildTextFilterPattern('bananas',true);
  runTest(a1,'alabama clydesdale');
  runTest(a2,'alabama clydesdale');
  runTest(a2,'gogo fabcde fgsfds');
  runTest(b1,'bo ar no ae ne far times');
  runTest(b1,'bo ar aaaaaaano ae ne far times');
  runTest(b2,'bo ar no ae ne far times');
  runTest(b2,'everyone loves bananas!!');
}
// testRegExBuilder();

function runTextFilter(dataIn) {
  if (!textFilter) { //if it's empty we don't need to do anything
    return dataIn;
  }
  let pattern = buildTextFilterPattern(textFilter, isTextFilterStrict);
  return dataIn.filter(item => {
    return pattern.test(item.name)
  });
}

function filterData() {
  let filtered = data.filter(item => {
    return mainCategories.filter(item, selectedFilters);
  });
  log.debug('filtered!',filtered);

  let fullyFiltered = runTextFilter(filtered);

  dispatch('filtered',fullyFiltered);
}

afterUpdate( function(){
  filterData();
});

function onKeyUp(e) {
  if (e.key === 'Escape') {
    textFilter = '';
  }
}

</script>

<style>
  ul.filter-tags {
    list-style: none;
    margin-left: 0;
    padding-left: 0;
  }

  ul.filter-tags li {
    padding: 1em;
    display: inline-block;
  }

  ul.filter-tags li:first-child {
    padding-left:0;
  }

  ul.filter-tags select {
    padding: 0.1em;
  }

  .delete {
    display:inline-block;
    padding: 0.2em;
    color: #b00;
    cursor: pointer;
  }

  .search-container {
    display:inline-block;
    margin: 0;
    padding: 0;
    width: 80%;
    position: relative;
  }

  .search-container .search-icon {
    height: 1.25em;
    width: 1.25em;
    position: absolute;
    left: 0.45em;
    top: 0.45em;
  }

  .search-input {
    width: 100%;
    padding-left:2em;
  }
</style>

<div class="filters">
  <!-- <pre>{JSON.stringify(selectedFilters)}</pre> -->
  <ul class="filter-tags">
  {#each selectedFilters as selectedFilter, index}
    <li>
      {selectedFilter}
      {#if index === selectedFilters.length - 1}
        <span class="delete" on:click={stepBack}>X</span>
      {/if}
    </li>
  {/each}
  {#if activeFilterOptions && activeFilterOptions.length}
    <li>
      <select id="categorySelector" on:change={changeFilterOption} bind:value={currentSelectedItem}>
        <option value="">-All-</option>
        {#each activeFilterOptions as filterEntry}
          <option value={filterEntry.displayName}>{filterEntry.displayName}</option>
          <!-- <pre>{JSON.stringify(filterEntry)}</pre> -->
        {/each}
      </select>
    </li>
  {/if}
  </ul>
  <p class="search-box">
    <span class="search-container">
      <input class="search-input" bind:value={textFilter} on:keyup={onKeyUp} on:change={filterData} type="text" placeholder="Thunderfury"/>
      <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Vector_search_icon.svg" alt="search icon" class="search-icon"/>
    </span>
    <span class="chiggity-check"><label><input type="checkbox" bind:checked={isTextFilterStrict}/> Strict match only</label></span>
  </p>
</div>