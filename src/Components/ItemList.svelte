<script>
import Item from './Item.svelte';

export let items = [];

</script>

<style>
</style>

<table>
  <thead>
    <tr>
      <td class="qty">Qty</td>
      <td></td>
      <td>Item Name</td>
    </tr>
  </thead>
  <tbody>
    {#each items as item}
      <Item item={item}></Item>
    {:else}
      <tr><td></td><td></td><td>Nothing to see here...</td></tr>
    {/each}
  </tbody>
</table>