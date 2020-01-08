import { FilterList } from './Filter.model.js';

export const weaponTypes = new FilterList('Weapon', [
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


export const armorSlots = new FilterList('Slot', [
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

export const armorSubs = new FilterList('ArmorSubType',[
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

export const recipeSubtypes = new FilterList('RecipeSubType',[
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

export const mainCategories = new FilterList('Type', [
  ['Armor', 'Armor', armorSubs],
  ['Container', 'Container'],
  ['Recipe', 'Recipe', recipeSubtypes],
  ['Trade Goods', ['Trade Goods','Reagent']],
  ['Weapon', 'Weapon', weaponTypes],
], 'type');