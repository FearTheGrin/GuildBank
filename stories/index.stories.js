import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';

import XSvgStories from './XSvg/XSvgStories.svelte';

// storiesOf('Button', module)
//   .add('with text', () => ({
//     Component: Button,
//     props: { text: 'Hello Button' },
//     on: { click: action('clicked') },
//   }))
//   .add('with some emoji', () => ({
//     Component: Button,
//     props: {
//       text: '😀 😎 👍 💯',
//     },
//     on: { click: action('clicked') },
//   }));
storiesOf('XSvg', module)
  .add('Introduction', () => ({
    Component: XSvgStories,
    props: {}
  }))
  .add('Line Style', () => ({
    Component: XSvgStories,
    props: {
      story: 'style'
    }
  }))
  .add('Animation Timing', () => ({
    Component: XSvgStories,
    props: {
      story: 'time'
    }
  }))