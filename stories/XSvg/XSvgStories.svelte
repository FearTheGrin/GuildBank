<script>
    import XSvg from '../../src/XSvg.svelte';
    import ColorPicker from '../util/ColorPicker.svelte';

    let stories = {
        default: 0,
        style: 1,
        time: 2
    }

    export let story = 'default';

    let visible = true,
        color = '#ffffff',
        shadowColor='#000000',
        weight = 2,
        duration = 200,
        delay = 250;

    function toggleVisible() {
        visible = !visible;
    }

    $: options = {visible, color, shadowColor, weight, duration, delay};
    $: storyIndex = stories[story];
</script>

<style>
    .xsvg {
        width: 30%;
        height: 30%;
    }
    .doc, .input-container {
        font-size: 1.2em;
        background-color: white;
        border-radius: 1em;
        padding: 1em;
        margin: 1em;
        width: 70%;
        box-shadow: 1px 3px 6px rgba(10,10,10,0.5);
    }

    code {
        background-color: rgba(27,31,35,.07);
        border-radius: 3px;
        font-size: 85%;
        margin: 0;
        padding: .2em .4em;
    }

    .level {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    /*.level-left {
        justify-content: flex-start;
    }

    .level-right {
        justify-content: flex-end;
    }

    .level-left, .level-right, */.level-item {
        align-items: center;
        flex-basis: auto;
        flex-grow: 0;
        flex-shrink: 0;
    }
</style>

    <div class='xsvg'>
        <XSvg {...options} debugMode={false}/>
    </div>

{#if story === 'default'}
    <div class="doc">
        <p>
            XSvg is a <em>transparent</em> svg element that's an X (thus the name).
            It scales to 100% height and width of the containing element.
            It can be <code>visible</code> or not, and it animates between states.
            The default is <code>visible = true</code>.
            To see that transition, click the button below:
        </p>
    </div>
{:else if storyIndex === stories.style}
    <div class="doc">
        <p>
            <code>color</code> and <code>shadowColor</code> and <code>weight</code> can both be passed in as props.
            As the names suggest, <code>color</code> sets the color of the lines, and <code>shadowColor</code>
            sets the color of the shadows. <code>weight</code> sets the stroke weight.
        </p>
        <p>
            The defaults are <code>color = #ffffff</code>, <code>shadowColor = #000000</code>, and
            <code>weight = 2</code>.
        </p>
        <p>
            These props are, as you might expect, reactive.
        </p>

    </div>
{:else if storyIndex === stories.time}
    <div class="doc">
        <p>
            The timing of the state change animation can be configured as well.
        </p>
        <p>
            <code>duration</code> controls the length of time it takes to animate
            <strong>one</strong> line (in ms). The default is <code>duration = 200</code>.
        </p>
        <p>
            <code>delay</code> controls the delay <em>from the beginning of the overall animation</em>
            before the second line begins to animate. The default is <code>delay = 250</code>,
            which is to say it begins 50ms after the first line finishes.
        </p>
    </div>
{/if}

<div class="input-container">
    <p>
        <button on:click={toggleVisible}>Toggle Visibility</button>
    </p>
    {#if storyIndex >= stories.style }
        <p class="level">
            <label class="level-item">
                <code>color</code>:
                <ColorPicker bind:color={color}/>
            </label>
            <label class="level-item">
                <code>shadowColor</code>:
                <ColorPicker bind:color={shadowColor}/>
            </label>
            <label class="level-item">
                <code>weight</code>:
                <input type="number" min=0 bind:value={weight}/>
            </label>
        </p>
    {/if}
    {#if storyIndex >= stories.time}
        <p class="level">
            <label class="level-item">
                <code>duration</code>:
                <input type="number" min=0 bind:value={duration}/>
            </label>
            <label class="level-item">
                <code>delay</code>:
                <input type="number" min=0 bind:value={delay}/>
            </label>
            <label class="level-item">
            </label>
        </p>
    {/if}
</div>