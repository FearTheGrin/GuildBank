<script>
  export let item;

</script>

<style>
  .icon {
    text-align: right;
    width: 1.6em;
  }
  img {
    height: 1.25em;
  }
</style>

<tr class="item" id="item-{item.id}">
  <td class="qty"> {item.count}</td>
  <td class="icon">
    <img src="//wow.zamimg.com/images/wow/icons/medium/{item.icon}.jpg" alt="icon"/>
  </td>
  <td>
    <a href="https://classic.wowhead.com/item={item.id}" target="_blank" class="q{item.rarity}" domain="classic" data-wowhead="item={item.id}">[{item.name}]</a>
  </td>
  {#if window.testing}
    <td><pre>{JSON.stringify(item)}</pre></td>
  {/if}
</tr>