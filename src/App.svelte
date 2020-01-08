<script>
	import { onMount } from 'svelte';
	import { beforeUpdate, afterUpdate } from 'svelte';

	import ItemList from './Components/ItemList.svelte';
	import Filter from  './Components/Filter/Filter.svelte';

	let data = window.Grin.bankData;

	let title = 'Grin Bank';

	let { bank, gold, updated } = data;
	updated = updated * 1000;

	let itemKeys = {};
	let bags = {bank: [], inventory: []};
	let maxCapacity = 0;
	let usedCapacity = 0;
	for (let bag of bank) {
		maxCapacity += bag.capacity;
		let contents = bag.contents;
		// skip if it is an object ( e.g. {} ) because it has nothing in it.
		if (contents.constructor !== Array){
			continue;
		}

		for (let item of contents) {
			usedCapacity += 1;
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

	function getPercentFree() {
		return 100 - Math.floor(usedCapacity / maxCapacity * 100);
	}

	function getCapacityClass(){
		let percentFree = getPercentFree(),
				percentLeft
		if (percentFree < 10) {
			return 'danger';
		}
		if (percentFree < 25) {
			return 'warn';
		}
		if (percentFree < 75) {
			return 'info';
		}
		return 'success';
	}

	onMount(reloadLinks);
	// afterUpdate(reloadLinks);
</script>

<style>
	.container {
		padding: 1em 2.5em;
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

	.danger {
		color: #cd5c5c;
	}

	.warn {
		color: #ffbc00;
	}

	.info {
		color: #87ceeb;
	}

	.success {
		color: #98fb98;
	}

	.column {
		display: inline-block;
		margin-right: 5em;
	}

	.needs {
		margin: 0.2em 0;
	}

	.needs h4 {
		margin: 0;
		text-decoration: underline;
	}

	ul {
		margin-top: 0.2em;
		padding-left: 1.5em;
	}

	h3 {
		margin: 0.5em 0;
	}

	.branding {
		box-sizing: border-box;
		font-size: 3em;
		margin: 0 0 0.1em -0.4em;
	}

	img.logo {
		vertical-align: middle;
		border: 1px solid #aaa;
		border-radius: 0.2em;
		width: 1em;
		margin-bottom: 0.2em;
	}

	.last-updated {
		margin: 0;
	}
</style>

<div class="container">
	<h1 class="branding">
		<img class="logo"
			src="./img/grin-banner.jpg"
			alt="Black Tooth Grin banner"/>
		{title}
	</h1>
	<h5 class="last-updated">Last Updated: { moment(updated).fromNow() }</h5>
	<h3>
		<span class="column">
			Coffers:
			{gold.gold}<span class="gold">g</span>
			{gold.silver}<span class="silver">s</span>
			{gold.copper}<span class="copper">c</span>
		</span>
		<span class="column">
				Available Space:
				<span class="{getCapacityClass()}">
					{maxCapacity - usedCapacity}/{maxCapacity}
					({getPercentFree()}%)
				</span>
		</span>
	</h3>
	<div class="needs">
		<h4 class="danger">Urgent Needs</h4>
		<ul>
			<li>6 big bags (
				<a href="https://classic.wowhead.com/item=14155" target="_blank"
					class="q2" domain="classic" data-wowhead="item=14155">
						[Mooncloth Bag]
				</a> or
				<a href="https://classic.wowhead.com/item=4500" target="_blank"
					class="q2" domain="classic" data-wowhead="item=4500">
						[Traveler's Backpack]
				</a>
			)</li>
			<li>People to send all these books and recipes to.</li>
		</ul>
	</div>
	<div class="needs">
		<h4>General Needs</h4>
		<ul>
			<li>Gold</li>
		</ul>
	</div>
	{#if items && items.length}
		<Filter data={items} on:filtered={onFiltered}></Filter>
		<ItemList items={itemsShown}></ItemList>
	{:else}
		<p class="loading">Loading...</p>
	{/if}
</div>
