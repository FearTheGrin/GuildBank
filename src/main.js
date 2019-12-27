window.testing = 0;
import { LogLevels } from './Services/Logger.service';
// window.logLevel = LogLevels.debug;
window.logLevel = LogLevels.warn;


import App from './App.svelte';
let app = new App({
  target: document.getElementById('app')
});

var whTooltips = {colorLinks: true, iconizeLinks: true};