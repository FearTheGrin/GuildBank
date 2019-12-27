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
  ['Tailoring']

], 'subType');

const mainCategories = new FilterList('Type', [
  ['Armor', 'Armor', armorSubs],
  ['Container', 'Container'],
  ['Recipe', 'Recipe', recipeSubtypes],
  ['Trade Goods', 'Trade Goods'],
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

function filterData() {
  let filtered = data.filter(item => {
    return mainCategories.filter(item, selectedFilters);
  });
  log.debug('filtered!',filtered);
  dispatch('filtered',filtered);
}

afterUpdate( function(){
  filterData();
});


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
</div>