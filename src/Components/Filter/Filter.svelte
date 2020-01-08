<script>
import { createEventDispatcher, afterUpdate } from 'svelte';

// utils
import Logger from '../../Services/Logger.service';
import {LogLevels} from '../../Services/Logger.service';

// data modules
import { mainCategories } from '../../Models/Filter/Filter.data.js';

// components
import ToggleSwitch from '../ToggleSwitch.svelte';

const log = new Logger('Filter Component');
// log.setLogLevel(LogLevels.debug);

const dispatch = createEventDispatcher();

export let data = [];

let selectedFilters = [];
let textFilter = '';
let isTextFilterStrict = false;



function testIt(item, path){
  log.debug('testing',item.name, JSON.stringify(path));
  log.debug(mainCategories.filter(item, path));
}

function testItemFiltering(){
  testIt(testItem1, ['Armor','Wands']);
  testIt(testItem1, ['Weapon','Wands']);
  testIt(testItem1, ['Weapon','Daggers']);

  // testIt(testItem2, ['Weapon']);
  // testIt(testItem2, ['Armor']);
  testIt(testItem2, ['Armor', 'Miscellaneous']);
  testIt(testItem2, ['Armor', 'Miscellaneous','']);
  // testIt(testItem2, ['Armor', 'Miscellaneous', 'Shirt']);
  // testIt(testItem2, ['Armor', 'Miscellaneous', 'Tabard']);

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

function filterData(data, selectedFilters) {
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
    <ToggleSwitch bind:checked={isTextFilterStrict} label='Strict Match'></ToggleSwitch>
    <span class="chiggity-check"><label><input type="checkbox" bind:checked={isTextFilterStrict}/> Strict match only</label></span>
  </p>
</div>