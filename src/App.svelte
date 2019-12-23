<script>
	import { onMount } from 'svelte';
	import { beforeUpdate, afterUpdate } from 'svelte';

	import Item from './Components/Item.svelte';

	let title = 'Guild Bank Prototype (EARLY WIP)';

	let data = {"updated":1577143532, "gold":{"copper":43, "silver":61, "gold":66}, "bank":[{"capacity":24, "bagName":"Bank", "contents":[{"type":"Trade Goods", "rarity":1, "slot":1, "id":2836, "subType":"Trade Goods", "name":"Coarse Stone", "count":5, "icon":135235, "container":-1}, {"type":"Recipe", "rarity":3, "slot":2, "id":17682, "subType":"Book", "minLevel":50, "count":1, "name":"Book: Gift of the Wild", "icon":133743, "container":-1}, {"equipLoc":"INVTYPE_RANGED", "type":"Weapon", "rarity":2, "slot":3, "id":15285, "subType":"Bows", "minLevel":27, "count":1, "name":"Archer's Longbow", "icon":135491, "container":-1}, {"equipLoc":"INVTYPE_SHOULDER", "type":"Armor", "rarity":2, "slot":4, "id":5964, "subType":"Leather", "minLevel":30, "count":1, "name":"Barbaric Shoulders", "icon":135039, "container":-1}, {"type":"Recipe", "rarity":2, "slot":5, "id":3395, "subType":"Alchemy", "name":"Recipe: Limited Invulnerability Potion", "count":1, "icon":134939, "container":-1}, {"type":"Recipe", "rarity":2, "slot":6, "id":3874, "subType":"Blacksmithing", "name":"Plans: Polished Steel Boots", "count":1, "icon":134942, "container":-1}, {"type":"Consumable", "rarity":1, "slot":7, "id":6051, "subType":"Consumable", "minLevel":10, "count":5, "name":"Holy Protection Potion", "icon":134720, "container":-1}, {"equipLoc":"INVTYPE_BAG", "type":"Container", "rarity":1, "slot":8, "id":14046, "subType":"Bag", "name":"Runecloth Bag", "count":1, "icon":133652, "container":-1}, {"type":"Recipe", "rarity":3, "slot":9, "id":17414, "subType":"Book", "minLevel":60, "count":1, "name":"Codex: Prayer of Fortitude II", "icon":133741, "container":-1}, {"type":"Recipe", "rarity":2, "slot":10, "id":3395, "subType":"Alchemy", "name":"Recipe: Limited Invulnerability Potion", "count":1, "icon":134939, "container":-1}, {"type":"Trade Goods", "rarity":1, "slot":11, "id":2838, "subType":"Trade Goods", "name":"Heavy Stone", "count":2, "icon":135238, "container":-1}, {"equipLoc":"INVTYPE_BAG", "type":"Container", "rarity":1, "slot":12, "id":14046, "subType":"Bag", "name":"Runecloth Bag", "count":1, "icon":133652, "container":-1}, {"equipLoc":"INVTYPE_BAG", "type":"Container", "rarity":1, "slot":13, "id":14046, "subType":"Bag", "name":"Runecloth Bag", "count":1, "icon":133652, "container":-1}, {"type":"Recipe", "rarity":1, "slot":14, "id":16072, "subType":"Cooking", "name":"Expert Cookbook", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":15, "id":16072, "subType":"Cooking", "name":"Expert Cookbook", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":16, "id":16072, "subType":"Cooking", "name":"Expert Cookbook", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":17, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":18, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":19, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":20, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":21, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":-1}, {"type":"Trade Goods", "rarity":1, "slot":22, "id":8836, "subType":"Trade Goods", "name":"Arthas' Tears", "count":1, "icon":134194, "container":-1}, {"equipLoc":"INVTYPE_FEET", "type":"Armor", "rarity":2, "slot":23, "id":10211, "subType":"Cloth", "minLevel":54, "count":1, "name":"Elegant Boots", "icon":132536, "container":-1}, {"type":"Recipe", "rarity":2, "slot":24, "id":15761, "subType":"Leatherworking", "name":"Pattern: Frostsaber Gloves", "count":1, "icon":134942, "container":-1}], "container":-1}, {"capacity":14, "bagName":"Runecloth Bag", "contents":[{"type":"Recipe", "rarity":2, "slot":1, "id":2407, "subType":"Leatherworking", "name":"Pattern: White Leather Jerkin", "count":1, "icon":134939, "container":5}, {"type":"Trade Goods", "rarity":1, "slot":2, "id":9262, "subType":"Trade Goods", "name":"Black Vitriol", "count":1, "icon":134133, "container":5}, {"type":"Recipe", "rarity":2, "slot":3, "id":6716, "subType":"Engineering", "name":"Schematic: EZ-Thro Dynamite", "count":1, "icon":134942, "container":5}, {"type":"Recipe", "rarity":2, "slot":4, "id":16245, "subType":"Enchanting", "name":"Formula: Enchant Boots - Greater Agility", "count":1, "icon":134327, "container":5}, {"equipLoc":"INVTYPE_TABARD", "type":"Armor", "rarity":1, "slot":5, "id":5976, "subType":"Miscellaneous", "name":"Guild Tabard", "count":1, "icon":135026, "container":5}, {"type":"Consumable", "rarity":1, "slot":6, "id":1710, "subType":"Consumable", "minLevel":21, "count":5, "name":"Greater Healing Potion", "icon":134832, "container":5}, {"type":"Consumable", "rarity":1, "slot":7, "id":3827, "subType":"Consumable", "minLevel":22, "count":5, "name":"Mana Potion", "icon":134852, "container":5}, {"type":"Consumable", "rarity":1, "slot":8, "id":3827, "subType":"Consumable", "minLevel":22, "count":1, "name":"Mana Potion", "icon":134852, "container":5}, {"type":"Consumable", "rarity":1, "slot":9, "id":1710, "subType":"Consumable", "minLevel":21, "count":5, "name":"Greater Healing Potion", "icon":134832, "container":5}, {"type":"Trade Goods", "rarity":1, "slot":10, "id":4461, "subType":"Trade Goods", "name":"Raptor Hide", "count":4, "icon":134303, "container":5}, {"type":"Recipe", "rarity":2, "slot":11, "id":9294, "subType":"Alchemy", "name":"Recipe: Wildvine Potion", "count":1, "icon":134942, "container":5}, {"type":"Trade Goods", "rarity":2, "slot":12, "id":3864, "subType":"Trade Goods", "name":"Citrine", "count":1, "icon":134117, "container":5}, {"type":"Recipe", "rarity":2, "slot":13, "id":4409, "subType":"Engineering", "name":"Schematic: Small Seaforium Charge", "count":1, "icon":134942, "container":5}, {"type":"Reagent", "rarity":1, "slot":14, "id":6470, "subType":"Reagent", "name":"Deviate Scale", "count":3, "icon":134304, "container":5}], "container":5}, {"capacity":14, "bagName":"Runecloth Bag", "contents":[{"type":"Trade Goods", "rarity":1, "slot":1, "id":2318, "subType":"Trade Goods", "name":"Light Leather", "count":8, "icon":134252, "container":6}, {"type":"Consumable", "rarity":1, "slot":2, "id":858, "subType":"Consumable", "minLevel":3, "count":2, "name":"Lesser Healing Potion", "icon":134830, "container":6}, {"type":"Recipe", "rarity":2, "slot":3, "id":10316, "subType":"Tailoring", "name":"Pattern: Colorful Kilt", "count":1, "icon":134942, "container":6}, {"type":"Recipe", "rarity":2, "slot":4, "id":15743, "subType":"Leatherworking", "name":"Pattern: Heavy Scorpid Belt", "count":1, "icon":134939, "container":6}, {"type":"Consumable", "rarity":1, "slot":5, "id":15564, "subType":"Consumable", "minLevel":40, "count":3, "name":"Rugged Armor Kit", "icon":133604, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":6, "id":8169, "subType":"Trade Goods", "name":"Thick Hide", "count":9, "icon":134356, "container":6}, {"type":"Miscellaneous", "rarity":1, "slot":7, "id":8165, "subType":"Junk", "name":"Worn Dragonscale", "count":6, "icon":134319, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":8, "id":15419, "subType":"Trade Goods", "name":"Warbear Leather", "count":2, "icon":134360, "container":6}, {"type":"Miscellaneous", "rarity":1, "slot":9, "id":8154, "subType":"Junk", "name":"Scorpid Scale", "count":5, "icon":134304, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":10, "id":4232, "subType":"Trade Goods", "name":"Medium Hide", "count":1, "icon":134364, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":11, "id":4233, "subType":"Trade Goods", "name":"Cured Medium Hide", "count":3, "icon":134354, "container":6}, {"type":"Miscellaneous", "rarity":1, "slot":12, "id":15412, "subType":"Junk", "name":"Green Dragonscale", "count":4, "icon":134313, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":13, "id":8150, "subType":"Trade Goods", "name":"Deeprock Salt", "count":20, "icon":133849, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":14, "id":8150, "subType":"Trade Goods", "name":"Deeprock Salt", "count":20, "icon":133849, "container":6}], "container":6}, {"capacity":14, "bagName":"Runecloth Bag", "contents":[{"type":"Trade Goods", "rarity":1, "slot":1, "id":8150, "subType":"Trade Goods", "name":"Deeprock Salt", "count":20, "icon":133849, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":2, "id":8146, "subType":"Trade Goods", "name":"Wicked Claw", "count":5, "icon":134294, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":3, "id":8146, "subType":"Trade Goods", "name":"Wicked Claw", "count":4, "icon":134294, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":4, "id":8153, "subType":"Trade Goods", "name":"Wildvine", "count":1, "icon":134183, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":5, "id":8171, "subType":"Trade Goods", "name":"Rugged Hide", "count":1, "icon":134357, "container":7}, {"type":"Trade Goods", "rarity":2, "slot":6, "id":1529, "subType":"Trade Goods", "name":"Jade", "count":2, "icon":134134, "container":7}], "container":7}, {"capacity":14, "bagName":"Runecloth Bag", "contents":{}, "container":8}, {"capacity":0, "contents":{}, "container":9}, {"capacity":0, "contents":{}, "container":10}]};
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
			console.log(item);
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

	let items = [];
	Object.keys(itemKeys).sort().forEach((itemID) => {
		items.push(itemKeys[itemID]);
	});

	function reloadLinks(){
		let $WowheadPower = window.$WowheadPower;
		$WowheadPower.refreshLinks();
	}

	let moment = window.moment;

	onMount(reloadLinks);
	afterUpdate(reloadLinks);
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
	<ul class="item-list">
		{#each items as item, i}
			<li>
				<Item itemID={item.id} itemName={item.name} itemQuality={item.rarity}></Item> Qty: {item.count}
			</li>
		{/each}
	</ul>
</div>
