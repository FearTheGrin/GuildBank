<script>
    export let color = '#ffffff';
</script>

<style>
.color-picker-wrapper {
	float: left;
	border: 1px solid #ccc;
	height: 1em;
	border-radius: 1.61em;
	width: 1em;
}

input[type="color"] {
	opacity: 0;
	display: block;
	width: 1em;
	height: 1em;
	border: none;
}
.color-picker-container {
    clear: both;
    margin-bottom: 0.2em;
    display: inline-block;
}
</style>

<div class="color-picker-container">
    <div class="color-picker-wrapper" style="background-color: {color}">
        <input type="color" bind:value="{color}" />
    </div>
    <input type="text" bind:value="{color}" />
</div>