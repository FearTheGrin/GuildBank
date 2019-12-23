!function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function o(e){e.forEach(t)}function i(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function a(e,t){e.appendChild(t)}function c(e,t,n){e.insertBefore(t,n||null)}function s(e){e.parentNode.removeChild(e)}function u(e){return document.createElement(e)}function l(e){return document.createTextNode(e)}function d(){return l(" ")}function p(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function y(e,t){t=""+t,e.data!==t&&(e.data=t)}let m;function f(e){m=e}function T(){if(!m)throw new Error("Function called outside component initialization");return m}const b=[],h=[],g=[],G=[],$=Promise.resolve();let C=!1;function L(e){g.push(e)}function R(){const e=new Set;do{for(;b.length;){const e=b.shift();f(e),k(e.$$)}for(;h.length;)h.pop()();for(let t=0;t<g.length;t+=1){const n=g[t];e.has(n)||(n(),e.add(n))}g.length=0}while(b.length);for(;G.length;)G.pop()();C=!1}function k(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(L)}}const v=new Set;let w;function E(e,t){e&&e.i&&(v.delete(e),e.i(t))}function A(e,t,n,o){if(e&&e.o){if(v.has(e))return;v.add(e),w.c.push(()=>{v.delete(e),o&&(n&&e.d(1),o())}),e.o(t)}}function B(e,n,r){const{fragment:a,on_mount:c,on_destroy:s,after_update:u}=e.$$;a&&a.m(n,r),L(()=>{const n=c.map(t).filter(i);s?s.push(...n):o(n),e.$$.on_mount=[]}),u.forEach(L)}function P(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function x(e,t){-1===e.$$.dirty[0]&&(b.push(e),C||(C=!0,$.then(R)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function _(t,i,r,a,c,s,u=[-1]){const l=m;f(t);const d=i.props||{},p=t.$$={fragment:null,ctx:null,props:s,update:e,not_equal:c,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(l?l.$$.context:[]),callbacks:n(),dirty:u};let y=!1;var T;p.ctx=r?r(t,d,(e,n,o=n)=>(p.ctx&&c(p.ctx[e],p.ctx[e]=o)&&(p.bound[e]&&p.bound[e](o),y&&x(t,e)),n)):[],p.update(),y=!0,o(p.before_update),p.fragment=!!a&&a(p.ctx),i.target&&(i.hydrate?p.fragment&&p.fragment.l((T=i.target,Array.from(T.childNodes))):p.fragment&&p.fragment.c(),i.intro&&E(t.$$.fragment),B(t,i.target,i.anchor),R()),f(l)}class N{$destroy(){P(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(){}}function I(t){let n,o,i,r,d,m,f;return{c(){n=u("a"),o=l("["),i=l(t[1]),r=l("]"),p(n,"href",d="https://classic.wowhead.com/item="+t[0]),p(n,"target","_blank"),p(n,"class",m="q"+t[2]),p(n,"domain","classic"),p(n,"data-wowhead",f="item="+t[0])},m(e,t){c(e,n,t),a(n,o),a(n,i),a(n,r)},p(e,[t]){2&t&&y(i,e[1]),1&t&&d!==(d="https://classic.wowhead.com/item="+e[0])&&p(n,"href",d),4&t&&m!==(m="q"+e[2])&&p(n,"class",m),1&t&&f!==(f="item="+e[0])&&p(n,"data-wowhead",f)},i:e,o:e,d(e){e&&s(n)}}}function S(e,t,n){let{itemID:o}=t,{itemName:i}=t,{itemQuality:r}=t;return e.$set=(e=>{"itemID"in e&&n(0,o=e.itemID),"itemName"in e&&n(1,i=e.itemName),"itemQuality"in e&&n(2,r=e.itemQuality)}),[o,i,r]}class W extends N{constructor(e){super(),_(this,e,S,I,r,{itemID:0,itemName:1,itemQuality:2})}}function D(e,t,n){const o=e.slice();return o[7]=t[n],o[9]=n,o}function F(t){let n,o,i,r,p,y=t[7].count+"";const m=new W({props:{itemID:t[7].id,itemName:t[7].name,itemQuality:t[7].rarity}});return{c(){var e;n=u("li"),(e=m.$$.fragment)&&e.c(),o=l(" Qty: "),i=l(y),r=d()},m(e,t){c(e,n,t),B(m,n,null),a(n,o),a(n,i),a(n,r),p=!0},p:e,i(e){p||(E(m.$$.fragment,e),p=!0)},o(e){A(m.$$.fragment,e),p=!1},d(e){e&&s(n),P(m)}}}function q(e){let t,n,i,r,m,f,T,b,h,g,G,$,C,L,R,k,v,B,P,x,_=moment(e[0]).fromNow()+"",N=e[1].gold+"",I=e[1].silver+"",S=e[1].copper+"",W=e[2],q=[];for(let t=0;t<W.length;t+=1)q[t]=F(D(e,W,t));const M=e=>A(q[e],1,1,()=>{q[e]=null});return{c(){t=u("div"),(n=u("h1")).textContent=`${H}`,i=d(),r=u("h5"),m=l("Last Updated: "),f=l(_),T=d(),b=u("h3"),h=l("Coffers:\n\t\t"),g=l(N),(G=u("span")).textContent="g",$=d(),C=l(I),(L=u("span")).textContent="s",R=d(),k=l(S),(v=u("span")).textContent="c",B=d(),P=u("ul");for(let e=0;e<q.length;e+=1)q[e].c();p(G,"class","gold svelte-rd36mw"),p(L,"class","silver svelte-rd36mw"),p(v,"class","copper svelte-rd36mw"),p(P,"class","item-list"),p(t,"class","container svelte-rd36mw")},m(e,o){c(e,t,o),a(t,n),a(t,i),a(t,r),a(r,m),a(r,f),a(t,T),a(t,b),a(b,h),a(b,g),a(b,G),a(b,$),a(b,C),a(b,L),a(b,R),a(b,k),a(b,v),a(t,B),a(t,P);for(let e=0;e<q.length;e+=1)q[e].m(P,null);x=!0},p(e,[t]){if((!x||1&t)&&_!==(_=moment(e[0]).fromNow()+"")&&y(f,_),4&t){let n;for(W=e[2],n=0;n<W.length;n+=1){const o=D(e,W,n);q[n]?(q[n].p(o,t),E(q[n],1)):(q[n]=F(o),q[n].c(),E(q[n],1),q[n].m(P,null))}for(w={r:0,c:[],p:w},n=W.length;n<q.length;n+=1)M(n);w.r||o(w.c),w=w.p}},i(e){if(!x){for(let e=0;e<W.length;e+=1)E(q[e]);x=!0}},o(e){q=q.filter(Boolean);for(let e=0;e<q.length;e+=1)A(q[e]);x=!1},d(e){e&&s(t),function(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}(q,e)}}}let H="Guild Bank Prototype (EARLY WIP)";function M(){window.$WowheadPower.refreshLinks()}function V(e,t,n){let{bank:o,gold:i,updated:r}={updated:1577128641,gold:{copper:3,silver:62,gold:66},bank:[{capacity:24,bagName:"Bank",contents:[{type:"Trade Goods",rarity:1,slot:1,id:2836,subType:"Trade Goods",name:"Coarse Stone",count:5,icon:135235,container:-1},{type:"Recipe",rarity:3,slot:2,id:17682,subType:"Book",minLevel:50,count:1,name:"Book: Gift of the Wild",icon:133743,container:-1},{equipLoc:"INVTYPE_RANGED",type:"Weapon",rarity:2,slot:3,id:15285,subType:"Bows",minLevel:27,count:1,name:"Archer's Longbow",icon:135491,container:-1},{equipLoc:"INVTYPE_SHOULDER",type:"Armor",rarity:2,slot:4,id:5964,subType:"Leather",minLevel:30,count:1,name:"Barbaric Shoulders",icon:135039,container:-1},{type:"Recipe",rarity:2,slot:5,id:3395,subType:"Alchemy",name:"Recipe: Limited Invulnerability Potion",count:1,icon:134939,container:-1},{type:"Recipe",rarity:2,slot:6,id:3874,subType:"Blacksmithing",name:"Plans: Polished Steel Boots",count:1,icon:134942,container:-1},{type:"Consumable",rarity:1,slot:7,id:6051,subType:"Consumable",minLevel:10,count:5,name:"Holy Protection Potion",icon:134720,container:-1},{equipLoc:"INVTYPE_BAG",type:"Container",rarity:1,slot:8,id:14046,subType:"Bag",name:"Runecloth Bag",count:1,icon:133652,container:-1},{type:"Recipe",rarity:3,slot:9,id:17414,subType:"Book",minLevel:60,count:1,name:"Codex: Prayer of Fortitude II",icon:133741,container:-1},{type:"Recipe",rarity:2,slot:10,id:3395,subType:"Alchemy",name:"Recipe: Limited Invulnerability Potion",count:1,icon:134939,container:-1},{type:"Trade Goods",rarity:1,slot:11,id:2838,subType:"Trade Goods",name:"Heavy Stone",count:2,icon:135238,container:-1},{equipLoc:"INVTYPE_BAG",type:"Container",rarity:1,slot:12,id:14046,subType:"Bag",name:"Runecloth Bag",count:1,icon:133652,container:-1},{equipLoc:"INVTYPE_BAG",type:"Container",rarity:1,slot:13,id:14046,subType:"Bag",name:"Runecloth Bag",count:1,icon:133652,container:-1},{type:"Recipe",rarity:1,slot:14,id:16072,subType:"Cooking",name:"Expert Cookbook",count:1,icon:133740,container:-1},{type:"Recipe",rarity:1,slot:15,id:16072,subType:"Cooking",name:"Expert Cookbook",count:1,icon:133740,container:-1},{type:"Recipe",rarity:1,slot:16,id:16072,subType:"Cooking",name:"Expert Cookbook",count:1,icon:133740,container:-1},{type:"Recipe",rarity:1,slot:17,id:16084,subType:"First Aid",name:"Expert First Aid - Under Wraps",count:1,icon:133740,container:-1},{type:"Recipe",rarity:1,slot:18,id:16084,subType:"First Aid",name:"Expert First Aid - Under Wraps",count:1,icon:133740,container:-1},{type:"Recipe",rarity:1,slot:19,id:16084,subType:"First Aid",name:"Expert First Aid - Under Wraps",count:1,icon:133740,container:-1},{type:"Recipe",rarity:1,slot:20,id:16084,subType:"First Aid",name:"Expert First Aid - Under Wraps",count:1,icon:133740,container:-1},{type:"Recipe",rarity:1,slot:21,id:16084,subType:"First Aid",name:"Expert First Aid - Under Wraps",count:1,icon:133740,container:-1},{type:"Trade Goods",rarity:1,slot:22,id:8836,subType:"Trade Goods",name:"Arthas' Tears",count:1,icon:134194,container:-1},{equipLoc:"INVTYPE_FEET",type:"Armor",rarity:2,slot:23,id:10211,subType:"Cloth",minLevel:54,count:1,name:"Elegant Boots",icon:132536,container:-1},{type:"Recipe",rarity:2,slot:24,id:15761,subType:"Leatherworking",name:"Pattern: Frostsaber Gloves",count:1,icon:134942,container:-1}],container:-1},{capacity:14,bagName:"Runecloth Bag",contents:[{type:"Recipe",rarity:2,slot:1,id:2407,subType:"Leatherworking",name:"Pattern: White Leather Jerkin",count:1,icon:134939,container:5},{type:"Trade Goods",rarity:1,slot:2,id:9262,subType:"Trade Goods",name:"Black Vitriol",count:1,icon:134133,container:5},{type:"Recipe",rarity:2,slot:3,id:6716,subType:"Engineering",name:"Schematic: EZ-Thro Dynamite",count:1,icon:134942,container:5},{type:"Recipe",rarity:2,slot:4,id:16245,subType:"Enchanting",name:"Formula: Enchant Boots - Greater Agility",count:1,icon:134327,container:5},{equipLoc:"INVTYPE_TABARD",type:"Armor",rarity:1,slot:5,id:5976,subType:"Miscellaneous",name:"Guild Tabard",count:1,icon:135026,container:5},{type:"Consumable",rarity:1,slot:6,id:1710,subType:"Consumable",minLevel:21,count:5,name:"Greater Healing Potion",icon:134832,container:5},{type:"Consumable",rarity:1,slot:7,id:3827,subType:"Consumable",minLevel:22,count:5,name:"Mana Potion",icon:134852,container:5},{type:"Consumable",rarity:1,slot:8,id:3827,subType:"Consumable",minLevel:22,count:1,name:"Mana Potion",icon:134852,container:5},{type:"Consumable",rarity:1,slot:9,id:1710,subType:"Consumable",minLevel:21,count:5,name:"Greater Healing Potion",icon:134832,container:5},{type:"Trade Goods",rarity:1,slot:10,id:4461,subType:"Trade Goods",name:"Raptor Hide",count:4,icon:134303,container:5},{type:"Recipe",rarity:2,slot:11,id:9294,subType:"Alchemy",name:"Recipe: Wildvine Potion",count:1,icon:134942,container:5},{type:"Trade Goods",rarity:2,slot:12,id:3864,subType:"Trade Goods",name:"Citrine",count:1,icon:134117,container:5},{type:"Recipe",rarity:2,slot:13,id:4409,subType:"Engineering",name:"Schematic: Small Seaforium Charge",count:1,icon:134942,container:5},{type:"Reagent",rarity:1,slot:14,id:6470,subType:"Reagent",name:"Deviate Scale",count:3,icon:134304,container:5}],container:5},{capacity:14,bagName:"Runecloth Bag",contents:[{type:"Trade Goods",rarity:1,slot:1,id:2318,subType:"Trade Goods",name:"Light Leather",count:8,icon:134252,container:6},{type:"Consumable",rarity:1,slot:2,id:858,subType:"Consumable",minLevel:3,count:2,name:"Lesser Healing Potion",icon:134830,container:6},{type:"Recipe",rarity:2,slot:3,id:10316,subType:"Tailoring",name:"Pattern: Colorful Kilt",count:1,icon:134942,container:6},{type:"Recipe",rarity:2,slot:4,id:15743,subType:"Leatherworking",name:"Pattern: Heavy Scorpid Belt",count:1,icon:134939,container:6},{type:"Consumable",rarity:1,slot:5,id:15564,subType:"Consumable",minLevel:40,count:3,name:"Rugged Armor Kit",icon:133604,container:6},{type:"Trade Goods",rarity:1,slot:6,id:8169,subType:"Trade Goods",name:"Thick Hide",count:7,icon:134356,container:6},{type:"Miscellaneous",rarity:1,slot:7,id:8165,subType:"Junk",name:"Worn Dragonscale",count:6,icon:134319,container:6},{type:"Trade Goods",rarity:1,slot:8,id:15419,subType:"Trade Goods",name:"Warbear Leather",count:2,icon:134360,container:6},{type:"Miscellaneous",rarity:1,slot:9,id:8154,subType:"Junk",name:"Scorpid Scale",count:5,icon:134304,container:6},{type:"Trade Goods",rarity:1,slot:10,id:4232,subType:"Trade Goods",name:"Medium Hide",count:1,icon:134364,container:6},{type:"Trade Goods",rarity:1,slot:11,id:4233,subType:"Trade Goods",name:"Cured Medium Hide",count:3,icon:134354,container:6},{type:"Miscellaneous",rarity:1,slot:12,id:15412,subType:"Junk",name:"Green Dragonscale",count:4,icon:134313,container:6},{type:"Trade Goods",rarity:1,slot:13,id:8150,subType:"Trade Goods",name:"Deeprock Salt",count:20,icon:133849,container:6},{type:"Trade Goods",rarity:1,slot:14,id:8150,subType:"Trade Goods",name:"Deeprock Salt",count:20,icon:133849,container:6}],container:6},{capacity:14,bagName:"Runecloth Bag",contents:[{type:"Trade Goods",rarity:1,slot:1,id:8150,subType:"Trade Goods",name:"Deeprock Salt",count:20,icon:133849,container:7},{type:"Trade Goods",rarity:1,slot:2,id:8146,subType:"Trade Goods",name:"Wicked Claw",count:5,icon:134294,container:7},{type:"Trade Goods",rarity:1,slot:3,id:8146,subType:"Trade Goods",name:"Wicked Claw",count:4,icon:134294,container:7},{type:"Trade Goods",rarity:1,slot:4,id:8153,subType:"Trade Goods",name:"Wildvine",count:1,icon:134183,container:7}],container:7},{capacity:14,bagName:"Runecloth Bag",contents:{},container:8},{capacity:0,contents:{},container:9},{capacity:0,contents:{},container:10}]};r*=1e3;let a={};for(let e of o){let t=e.contents;if(t.constructor===Array)for(let e of t)console.log(e),a[e.id]||(a[e.id]={equipLoc:e.equipLoc,type:e.type,rarity:e.rarity,slot:e.slot,id:e.id,subType:e.subType,minLevel:e.minLevel,count:0,name:e.name,icon:e.icon}),a[e.id].count+=e.count}let c=[];var s;return Object.keys(a).sort().forEach(e=>{c.push(a[e])}),s=M,T().$$.on_mount.push(s),function(e){T().$$.after_update.push(e)}(M),[r,i,c]}new class extends N{constructor(e){super(),_(this,e,V,q,r,{})}}({target:document.getElementById("app")})}();
