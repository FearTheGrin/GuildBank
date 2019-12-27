<script>
	import { onMount } from 'svelte';
	import { beforeUpdate, afterUpdate } from 'svelte';
	import data from './data.js';


	import ItemList from './Components/ItemList.svelte';
	import Filter from  './Components/Filter.svelte';

	let title = 'Guild Bank Prototype (EARLY WIP)';

	let { bank, gold, updated } = data;
	updated = updated * 1000;

	let itemKeys = {};
	let bags = {bank: [], inventory: []};
	for (let bag of bank) {
		let contents = bag.contents;
		// skip if it is an object ( e.g. {} ) because it has nothing in it.
		if (contents.constructor !== Array){
			continue;
		}

		for (let item of contents) {
			if (!itemKeys[item.id]) {
				itemKeys[item.id] = {
					equipLoc:item.equipLoc,
					type:item.type,
					rarity:item.rarity,
					slot:item.slot,
					id:item.id,
					subType:item.subType,
					minLevel:item.minLevel,
					count:0,
					name:item.name,
					icon:item.icon
				};
			}
			itemKeys[item.id].count += item.count;
		}
	}

	let axios = window.axios;
	let tempItems = [];
	let items = [];
	Object.keys(itemKeys).sort().forEach((itemID) => {
		axios.get('https://classic.wowhead.com/tooltip/item/'+itemID)
			.then(resp => {
				let item = itemKeys[itemID];
				item.icon = resp.data.icon;
				tempItems.push(item);
				if (tempItems.length == Object.keys(itemKeys).length) {
					items = tempItems.slice().sort((aIn,bIn) => {
						let a = aIn.name;
						let b = bIn.name;
						if (a < b) return -1;
						if (a > b) return 1;
						return 0;
					});
				}
			});
	});

	let itemsShown = items;

	function onFiltered(e) {
		itemsShown = e.detail;
	}

	function reloadLinks(){
		let $WowheadPower = window.$WowheadPower;
		$WowheadPower.refreshLinks();
	}

	let moment = window.moment;

	onMount(reloadLinks);
	// afterUpdate(reloadLinks);
</script>

<style>
	.container {
		padding: 50px;
	}

	.gold {
		color: goldenrod;
	}

	.silver {
		color: silver;
	}

	.copper {
		color:  chocolate;
	}
</style>

<div class="container">
	<h1>
		{title}
	</h1>
	<h5>Last Updated: { moment(updated).fromNow() }</h5>
	<h3>
		Coffers:
		{gold.gold}<span class="gold">g</span>
		{gold.silver}<span class="silver">s</span>
		{gold.copper}<span class="copper">c</span>
	</h3>
	{#if items && items.length}
		<Filter data={items} on:filtered={onFiltered}></Filter>
		<ItemList items={itemsShown}></ItemList>
	{:else}
		<p class="loading">Loading...</p>
	{/if}
</div>
