
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
  'use strict';

  const LogLevels = {
    error: 0,
    warn: 1,
    info: 2,
    log: 3,
    debug: 4
  };
  Object.freeze(LogLevels);

  class Logger {
    constructor(name){
      this.name = name;
      this.logLevel = window.logLevel;
    }

    setLogLevel(logLevel) {
      this.logLevel = logLevel;
    }

    printToConsole(fn, level, argsIn) {
      let args = argsIn ? Array.prototype.slice.apply(argsIn) : Array.prototype.slice.apply(arguments, [2]);
      if (level <= this.logLevel) {
        console[fn].apply(console, [`[${this.name}]`].concat(args));
      }
    }

    error() {
      this.printToConsole.apply(this, ['error',LogLevels.error, arguments]);
    }

    warn() {
      this.printToConsole.apply(this, ['warn',LogLevels.warn, arguments]);
    }

    info() {
      this.printToConsole.apply(this, ['info',LogLevels.info, arguments]);
    }

    log() {
      this.printToConsole.apply(this, ['log',LogLevels.log, arguments]);
    }

    debug() {
      this.printToConsole.apply(this, ['debug',LogLevels.debug, arguments]);
    }
  }

  function noop() { }
  function add_location(element, file, line, column, char) {
      element.__svelte_meta = {
          loc: { file, line, column, char }
      };
  }
  function run(fn) {
      return fn();
  }
  function blank_object() {
      return Object.create(null);
  }
  function run_all(fns) {
      fns.forEach(run);
  }
  function is_function(thing) {
      return typeof thing === 'function';
  }
  function safe_not_equal(a, b) {
      return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
  }

  function append(target, node) {
      target.appendChild(node);
  }
  function insert(target, node, anchor) {
      target.insertBefore(node, anchor || null);
  }
  function detach(node) {
      node.parentNode.removeChild(node);
  }
  function destroy_each(iterations, detaching) {
      for (let i = 0; i < iterations.length; i += 1) {
          if (iterations[i])
              iterations[i].d(detaching);
      }
  }
  function element(name) {
      return document.createElement(name);
  }
  function text(data) {
      return document.createTextNode(data);
  }
  function space() {
      return text(' ');
  }
  function listen(node, event, handler, options) {
      node.addEventListener(event, handler, options);
      return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
      if (value == null)
          node.removeAttribute(attribute);
      else if (node.getAttribute(attribute) !== value)
          node.setAttribute(attribute, value);
  }
  function children(element) {
      return Array.from(element.childNodes);
  }
  function select_option(select, value) {
      for (let i = 0; i < select.options.length; i += 1) {
          const option = select.options[i];
          if (option.__value === value) {
              option.selected = true;
              return;
          }
      }
  }
  function select_value(select) {
      const selected_option = select.querySelector(':checked') || select.options[0];
      return selected_option && selected_option.__value;
  }
  function custom_event(type, detail) {
      const e = document.createEvent('CustomEvent');
      e.initCustomEvent(type, false, false, detail);
      return e;
  }

  let current_component;
  function set_current_component(component) {
      current_component = component;
  }
  function get_current_component() {
      if (!current_component)
          throw new Error(`Function called outside component initialization`);
      return current_component;
  }
  function onMount(fn) {
      get_current_component().$$.on_mount.push(fn);
  }
  function afterUpdate(fn) {
      get_current_component().$$.after_update.push(fn);
  }
  function createEventDispatcher() {
      const component = get_current_component();
      return (type, detail) => {
          const callbacks = component.$$.callbacks[type];
          if (callbacks) {
              // TODO are there situations where events could be dispatched
              // in a server (non-DOM) environment?
              const event = custom_event(type, detail);
              callbacks.slice().forEach(fn => {
                  fn.call(component, event);
              });
          }
      };
  }

  const dirty_components = [];
  const binding_callbacks = [];
  const render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
      if (!update_scheduled) {
          update_scheduled = true;
          resolved_promise.then(flush);
      }
  }
  function add_render_callback(fn) {
      render_callbacks.push(fn);
  }
  function flush() {
      const seen_callbacks = new Set();
      do {
          // first, call beforeUpdate functions
          // and update components
          while (dirty_components.length) {
              const component = dirty_components.shift();
              set_current_component(component);
              update(component.$$);
          }
          while (binding_callbacks.length)
              binding_callbacks.pop()();
          // then, once components are updated, call
          // afterUpdate functions. This may cause
          // subsequent updates...
          for (let i = 0; i < render_callbacks.length; i += 1) {
              const callback = render_callbacks[i];
              if (!seen_callbacks.has(callback)) {
                  callback();
                  // ...so guard against infinite loops
                  seen_callbacks.add(callback);
              }
          }
          render_callbacks.length = 0;
      } while (dirty_components.length);
      while (flush_callbacks.length) {
          flush_callbacks.pop()();
      }
      update_scheduled = false;
  }
  function update($$) {
      if ($$.fragment !== null) {
          $$.update();
          run_all($$.before_update);
          const dirty = $$.dirty;
          $$.dirty = [-1];
          $$.fragment && $$.fragment.p($$.ctx, dirty);
          $$.after_update.forEach(add_render_callback);
      }
  }
  const outroing = new Set();
  let outros;
  function group_outros() {
      outros = {
          r: 0,
          c: [],
          p: outros // parent group
      };
  }
  function check_outros() {
      if (!outros.r) {
          run_all(outros.c);
      }
      outros = outros.p;
  }
  function transition_in(block, local) {
      if (block && block.i) {
          outroing.delete(block);
          block.i(local);
      }
  }
  function transition_out(block, local, detach, callback) {
      if (block && block.o) {
          if (outroing.has(block))
              return;
          outroing.add(block);
          outros.c.push(() => {
              outroing.delete(block);
              if (callback) {
                  if (detach)
                      block.d(1);
                  callback();
              }
          });
          block.o(local);
      }
  }
  function create_component(block) {
      block && block.c();
  }
  function mount_component(component, target, anchor) {
      const { fragment, on_mount, on_destroy, after_update } = component.$$;
      fragment && fragment.m(target, anchor);
      // onMount happens before the initial afterUpdate
      add_render_callback(() => {
          const new_on_destroy = on_mount.map(run).filter(is_function);
          if (on_destroy) {
              on_destroy.push(...new_on_destroy);
          }
          else {
              // Edge case - component was destroyed immediately,
              // most likely as a result of a binding initialising
              run_all(new_on_destroy);
          }
          component.$$.on_mount = [];
      });
      after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
      const $$ = component.$$;
      if ($$.fragment !== null) {
          run_all($$.on_destroy);
          $$.fragment && $$.fragment.d(detaching);
          // TODO null out other refs, including component.$$ (but need to
          // preserve final state?)
          $$.on_destroy = $$.fragment = null;
          $$.ctx = [];
      }
  }
  function make_dirty(component, i) {
      if (component.$$.dirty[0] === -1) {
          dirty_components.push(component);
          schedule_update();
          component.$$.dirty.fill(0);
      }
      component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
  }
  function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
      const parent_component = current_component;
      set_current_component(component);
      const prop_values = options.props || {};
      const $$ = component.$$ = {
          fragment: null,
          ctx: null,
          // state
          props,
          update: noop,
          not_equal,
          bound: blank_object(),
          // lifecycle
          on_mount: [],
          on_destroy: [],
          before_update: [],
          after_update: [],
          context: new Map(parent_component ? parent_component.$$.context : []),
          // everything else
          callbacks: blank_object(),
          dirty
      };
      let ready = false;
      $$.ctx = instance
          ? instance(component, prop_values, (i, ret, value = ret) => {
              if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                  if ($$.bound[i])
                      $$.bound[i](value);
                  if (ready)
                      make_dirty(component, i);
              }
              return ret;
          })
          : [];
      $$.update();
      ready = true;
      run_all($$.before_update);
      // `false` as a special case of no DOM component
      $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
      if (options.target) {
          if (options.hydrate) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.l(children(options.target));
          }
          else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.c();
          }
          if (options.intro)
              transition_in(component.$$.fragment);
          mount_component(component, options.target, options.anchor);
          flush();
      }
      set_current_component(parent_component);
  }
  class SvelteComponent {
      $destroy() {
          destroy_component(this, 1);
          this.$destroy = noop;
      }
      $on(type, callback) {
          const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
          callbacks.push(callback);
          return () => {
              const index = callbacks.indexOf(callback);
              if (index !== -1)
                  callbacks.splice(index, 1);
          };
      }
      $set() {
          // overridden by instance, if it has props
      }
  }

  function dispatch_dev(type, detail) {
      document.dispatchEvent(custom_event(type, detail));
  }
  function append_dev(target, node) {
      dispatch_dev("SvelteDOMInsert", { target, node });
      append(target, node);
  }
  function insert_dev(target, node, anchor) {
      dispatch_dev("SvelteDOMInsert", { target, node, anchor });
      insert(target, node, anchor);
  }
  function detach_dev(node) {
      dispatch_dev("SvelteDOMRemove", { node });
      detach(node);
  }
  function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
      const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
      if (has_prevent_default)
          modifiers.push('preventDefault');
      if (has_stop_propagation)
          modifiers.push('stopPropagation');
      dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
      const dispose = listen(node, event, handler, options);
      return () => {
          dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
          dispose();
      };
  }
  function attr_dev(node, attribute, value) {
      attr(node, attribute, value);
      if (value == null)
          dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
      else
          dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
  }
  function prop_dev(node, property, value) {
      node[property] = value;
      dispatch_dev("SvelteDOMSetProperty", { node, property, value });
  }
  function set_data_dev(text, data) {
      data = '' + data;
      if (text.data === data)
          return;
      dispatch_dev("SvelteDOMSetData", { node: text, data });
      text.data = data;
  }
  class SvelteComponentDev extends SvelteComponent {
      constructor(options) {
          if (!options || (!options.target && !options.$$inline)) {
              throw new Error(`'target' is a required option`);
          }
          super();
      }
      $destroy() {
          super.$destroy();
          this.$destroy = () => {
              console.warn(`Component was already destroyed`); // eslint-disable-line no-console
          };
      }
  }

  var data = {"updated":1577437477, "gold":{"copper":85, "silver":16, "gold":65}, "bank":[{"capacity":24, "bagName":"Bank", "contents":[{"type":"Trade Goods", "rarity":1, "slot":1, "id":2836, "subType":"Trade Goods", "name":"Coarse Stone", "count":5, "icon":135235, "container":-1}, {"type":"Recipe", "rarity":3, "slot":2, "id":17682, "subType":"Book", "minLevel":50, "count":1, "name":"Book: Gift of the Wild", "icon":133743, "container":-1}, {"equipLoc":"INVTYPE_RANGED", "type":"Weapon", "rarity":2, "slot":3, "id":15285, "subType":"Bows", "minLevel":27, "count":1, "name":"Archer's Longbow", "icon":135491, "container":-1}, {"equipLoc":"INVTYPE_SHOULDER", "type":"Armor", "rarity":2, "slot":4, "id":5964, "subType":"Leather", "minLevel":30, "count":1, "name":"Barbaric Shoulders", "icon":135039, "container":-1}, {"type":"Recipe", "rarity":2, "slot":5, "id":3395, "subType":"Alchemy", "name":"Recipe: Limited Invulnerability Potion", "count":1, "icon":134939, "container":-1}, {"type":"Recipe", "rarity":2, "slot":6, "id":3874, "subType":"Blacksmithing", "name":"Plans: Polished Steel Boots", "count":1, "icon":134942, "container":-1}, {"type":"Consumable", "rarity":1, "slot":7, "id":6051, "subType":"Consumable", "minLevel":10, "count":5, "name":"Holy Protection Potion", "icon":134720, "container":-1}, {"equipLoc":"INVTYPE_BAG", "type":"Container", "rarity":1, "slot":8, "id":14046, "subType":"Bag", "name":"Runecloth Bag", "count":1, "icon":133652, "container":-1}, {"type":"Recipe", "rarity":3, "slot":9, "id":17414, "subType":"Book", "minLevel":60, "count":1, "name":"Codex: Prayer of Fortitude II", "icon":133741, "container":-1}, {"type":"Recipe", "rarity":2, "slot":10, "id":3395, "subType":"Alchemy", "name":"Recipe: Limited Invulnerability Potion", "count":1, "icon":134939, "container":-1}, {"type":"Trade Goods", "rarity":1, "slot":11, "id":2838, "subType":"Trade Goods", "name":"Heavy Stone", "count":2, "icon":135238, "container":-1}, {"equipLoc":"INVTYPE_BAG", "type":"Container", "rarity":1, "slot":12, "id":14046, "subType":"Bag", "name":"Runecloth Bag", "count":1, "icon":133652, "container":-1}, {"equipLoc":"INVTYPE_BAG", "type":"Container", "rarity":1, "slot":13, "id":14046, "subType":"Bag", "name":"Runecloth Bag", "count":1, "icon":133652, "container":-1}, {"type":"Recipe", "rarity":1, "slot":14, "id":16072, "subType":"Cooking", "name":"Expert Cookbook", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":15, "id":16072, "subType":"Cooking", "name":"Expert Cookbook", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":16, "id":16072, "subType":"Cooking", "name":"Expert Cookbook", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":17, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":18, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":19, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":-1}, {"type":"Recipe", "rarity":1, "slot":20, "id":16113, "subType":"First Aid", "name":"Manual: Mageweave Bandage", "count":1, "icon":133735, "container":-1}, {"type":"Recipe", "rarity":1, "slot":21, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":-1}, {"type":"Trade Goods", "rarity":1, "slot":22, "id":8836, "subType":"Trade Goods", "name":"Arthas' Tears", "count":1, "icon":134194, "container":-1}, {"equipLoc":"INVTYPE_FEET", "type":"Armor", "rarity":2, "slot":23, "id":10211, "subType":"Cloth", "minLevel":54, "count":1, "name":"Elegant Boots", "icon":132536, "container":-1}, {"type":"Recipe", "rarity":2, "slot":24, "id":15761, "subType":"Leatherworking", "name":"Pattern: Frostsaber Gloves", "count":1, "icon":134942, "container":-1}], "container":-1}, {"capacity":14, "bagName":"Runecloth Bag", "contents":[{"type":"Recipe", "rarity":2, "slot":1, "id":2407, "subType":"Leatherworking", "name":"Pattern: White Leather Jerkin", "count":1, "icon":134939, "container":5}, {"type":"Trade Goods", "rarity":1, "slot":2, "id":9262, "subType":"Trade Goods", "name":"Black Vitriol", "count":1, "icon":134133, "container":5}, {"type":"Recipe", "rarity":2, "slot":3, "id":6716, "subType":"Engineering", "name":"Schematic: EZ-Thro Dynamite", "count":1, "icon":134942, "container":5}, {"type":"Recipe", "rarity":2, "slot":4, "id":16245, "subType":"Enchanting", "name":"Formula: Enchant Boots - Greater Agility", "count":1, "icon":134327, "container":5}, {"equipLoc":"INVTYPE_TABARD", "type":"Armor", "rarity":1, "slot":5, "id":5976, "subType":"Miscellaneous", "name":"Guild Tabard", "count":1, "icon":135026, "container":5}, {"type":"Consumable", "rarity":1, "slot":6, "id":1710, "subType":"Consumable", "minLevel":21, "count":5, "name":"Greater Healing Potion", "icon":134832, "container":5}, {"type":"Consumable", "rarity":1, "slot":7, "id":3827, "subType":"Consumable", "minLevel":22, "count":5, "name":"Mana Potion", "icon":134852, "container":5}, {"type":"Consumable", "rarity":1, "slot":8, "id":3827, "subType":"Consumable", "minLevel":22, "count":1, "name":"Mana Potion", "icon":134852, "container":5}, {"type":"Consumable", "rarity":1, "slot":9, "id":1710, "subType":"Consumable", "minLevel":21, "count":5, "name":"Greater Healing Potion", "icon":134832, "container":5}, {"type":"Trade Goods", "rarity":1, "slot":10, "id":4461, "subType":"Trade Goods", "name":"Raptor Hide", "count":4, "icon":134303, "container":5}, {"type":"Recipe", "rarity":2, "slot":11, "id":9294, "subType":"Alchemy", "name":"Recipe: Wildvine Potion", "count":1, "icon":134942, "container":5}, {"type":"Trade Goods", "rarity":2, "slot":12, "id":3864, "subType":"Trade Goods", "name":"Citrine", "count":1, "icon":134117, "container":5}, {"type":"Recipe", "rarity":2, "slot":13, "id":4409, "subType":"Engineering", "name":"Schematic: Small Seaforium Charge", "count":1, "icon":134942, "container":5}, {"type":"Reagent", "rarity":1, "slot":14, "id":6470, "subType":"Reagent", "name":"Deviate Scale", "count":3, "icon":134304, "container":5}], "container":5}, {"capacity":14, "bagName":"Runecloth Bag", "contents":[{"type":"Trade Goods", "rarity":1, "slot":1, "id":2318, "subType":"Trade Goods", "name":"Light Leather", "count":8, "icon":134252, "container":6}, {"type":"Consumable", "rarity":1, "slot":2, "id":858, "subType":"Consumable", "minLevel":3, "count":2, "name":"Lesser Healing Potion", "icon":134830, "container":6}, {"type":"Recipe", "rarity":2, "slot":3, "id":10316, "subType":"Tailoring", "name":"Pattern: Colorful Kilt", "count":1, "icon":134942, "container":6}, {"type":"Recipe", "rarity":2, "slot":4, "id":15743, "subType":"Leatherworking", "name":"Pattern: Heavy Scorpid Belt", "count":1, "icon":134939, "container":6}, {"type":"Consumable", "rarity":1, "slot":5, "id":15564, "subType":"Consumable", "minLevel":40, "count":3, "name":"Rugged Armor Kit", "icon":133604, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":6, "id":8169, "subType":"Trade Goods", "name":"Thick Hide", "count":9, "icon":134356, "container":6}, {"type":"Miscellaneous", "rarity":1, "slot":7, "id":8165, "subType":"Junk", "name":"Worn Dragonscale", "count":6, "icon":134319, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":8, "id":15419, "subType":"Trade Goods", "name":"Warbear Leather", "count":2, "icon":134360, "container":6}, {"type":"Miscellaneous", "rarity":1, "slot":9, "id":8154, "subType":"Junk", "name":"Scorpid Scale", "count":5, "icon":134304, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":10, "id":4232, "subType":"Trade Goods", "name":"Medium Hide", "count":1, "icon":134364, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":11, "id":4233, "subType":"Trade Goods", "name":"Cured Medium Hide", "count":3, "icon":134354, "container":6}, {"type":"Miscellaneous", "rarity":1, "slot":12, "id":15412, "subType":"Junk", "name":"Green Dragonscale", "count":4, "icon":134313, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":13, "id":8150, "subType":"Trade Goods", "name":"Deeprock Salt", "count":20, "icon":133849, "container":6}, {"type":"Trade Goods", "rarity":1, "slot":14, "id":8150, "subType":"Trade Goods", "name":"Deeprock Salt", "count":20, "icon":133849, "container":6}], "container":6}, {"capacity":14, "bagName":"Runecloth Bag", "contents":[{"type":"Trade Goods", "rarity":1, "slot":1, "id":8150, "subType":"Trade Goods", "name":"Deeprock Salt", "count":20, "icon":133849, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":2, "id":8146, "subType":"Trade Goods", "name":"Wicked Claw", "count":5, "icon":134294, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":3, "id":8146, "subType":"Trade Goods", "name":"Wicked Claw", "count":4, "icon":134294, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":4, "id":8153, "subType":"Trade Goods", "name":"Wildvine", "count":1, "icon":134183, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":5, "id":8171, "subType":"Trade Goods", "name":"Rugged Hide", "count":1, "icon":134357, "container":7}, {"type":"Trade Goods", "rarity":2, "slot":6, "id":1529, "subType":"Trade Goods", "name":"Jade", "count":2, "icon":134134, "container":7}, {"type":"Recipe", "rarity":2, "slot":7, "id":10312, "subType":"Tailoring", "name":"Pattern: Red Mageweave Gloves", "count":1, "icon":134942, "container":7}, {"type":"Recipe", "rarity":2, "slot":8, "id":10300, "subType":"Tailoring", "name":"Pattern: Red Mageweave Vest", "count":1, "icon":134942, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":9, "id":7912, "subType":"Trade Goods", "name":"Solid Stone", "count":3, "icon":135236, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":10, "id":3818, "subType":"Trade Goods", "name":"Fadeleaf", "count":1, "icon":134193, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":11, "id":785, "subType":"Trade Goods", "name":"Mageroyal", "count":1, "icon":133436, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":12, "id":5637, "subType":"Trade Goods", "name":"Large Fang", "count":1, "icon":133725, "container":7}, {"type":"Trade Goods", "rarity":1, "slot":13, "id":4304, "subType":"Trade Goods", "name":"Thick Leather", "count":2, "icon":134257, "container":7}, {"type":"Recipe", "rarity":1, "slot":14, "id":16112, "subType":"First Aid", "name":"Manual: Heavy Silk Bandage", "count":1, "icon":133735, "container":7}], "container":7}, {"capacity":14, "bagName":"Runecloth Bag", "contents":[{"type":"Recipe", "rarity":1, "slot":1, "id":16084, "subType":"First Aid", "name":"Expert First Aid - Under Wraps", "count":1, "icon":133740, "container":8}, {"type":"Recipe", "rarity":1, "slot":2, "id":3830, "subType":"Alchemy", "name":"Recipe: Elixir of Fortitude", "count":1, "icon":134939, "container":8}, {"type":"Recipe", "rarity":3, "slot":3, "id":18600, "subType":"Book", "minLevel":56, "count":1, "name":"Tome of Arcane Brilliance", "icon":133739, "container":8}, {"type":"Recipe", "rarity":2, "slot":4, "id":11166, "subType":"Enchanting", "name":"Formula: Enchant Gloves - Skinning", "count":1, "icon":134327, "container":8}, {"type":"Recipe", "rarity":2, "slot":5, "id":11204, "subType":"Enchanting", "name":"Formula: Enchant Bracer - Greater Spirit", "count":1, "icon":134327, "container":8}, {"type":"Recipe", "rarity":2, "slot":6, "id":18332, "subType":"Book", "minLevel":50, "count":1, "name":"Libram of Rapidity", "icon":133734, "container":8}], "container":8}, {"capacity":0, "contents":{}, "container":9}, {"capacity":0, "contents":{}, "container":10}]};

  /* src/Components/Item.svelte generated by Svelte v3.16.5 */

  const file = "src/Components/Item.svelte";

  // (24:2) {#if window.testing}
  function create_if_block(ctx) {
  	let td;
  	let pre;
  	let t_value = JSON.stringify(/*item*/ ctx[0]) + "";
  	let t;

  	const block = {
  		c: function create() {
  			td = element("td");
  			pre = element("pre");
  			t = text(t_value);
  			add_location(pre, file, 24, 8, 540);
  			add_location(td, file, 24, 4, 536);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, td, anchor);
  			append_dev(td, pre);
  			append_dev(pre, t);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*item*/ 1 && t_value !== (t_value = JSON.stringify(/*item*/ ctx[0]) + "")) set_data_dev(t, t_value);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(td);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block.name,
  		type: "if",
  		source: "(24:2) {#if window.testing}",
  		ctx
  	});

  	return block;
  }

  function create_fragment(ctx) {
  	let tr;
  	let td0;
  	let t0_value = /*item*/ ctx[0].count + "";
  	let t0;
  	let t1;
  	let td1;
  	let img;
  	let img_src_value;
  	let t2;
  	let td2;
  	let a;
  	let t3;
  	let t4_value = /*item*/ ctx[0].name + "";
  	let t4;
  	let t5;
  	let a_href_value;
  	let a_class_value;
  	let a_data_wowhead_value;
  	let t6;
  	let tr_id_value;
  	let if_block = window.testing && create_if_block(ctx);

  	const block = {
  		c: function create() {
  			tr = element("tr");
  			td0 = element("td");
  			t0 = text(t0_value);
  			t1 = space();
  			td1 = element("td");
  			img = element("img");
  			t2 = space();
  			td2 = element("td");
  			a = element("a");
  			t3 = text("[");
  			t4 = text(t4_value);
  			t5 = text("]");
  			t6 = space();
  			if (if_block) if_block.c();
  			attr_dev(td0, "class", "qty");
  			add_location(td0, file, 16, 2, 185);
  			if (img.src !== (img_src_value = "//wow.zamimg.com/images/wow/icons/medium/" + /*item*/ ctx[0].icon + ".jpg")) attr_dev(img, "src", img_src_value);
  			attr_dev(img, "alt", "icon");
  			attr_dev(img, "class", "svelte-13bq8qd");
  			add_location(img, file, 18, 4, 244);
  			attr_dev(td1, "class", "icon svelte-13bq8qd");
  			add_location(td1, file, 17, 2, 222);
  			attr_dev(a, "href", a_href_value = "https://classic.wowhead.com/item=" + /*item*/ ctx[0].id);
  			attr_dev(a, "target", "_blank");
  			attr_dev(a, "class", a_class_value = "q" + /*item*/ ctx[0].rarity + " svelte-13bq8qd");
  			attr_dev(a, "domain", "classic");
  			attr_dev(a, "data-wowhead", a_data_wowhead_value = "item=" + /*item*/ ctx[0].id);
  			add_location(a, file, 21, 4, 344);
  			add_location(td2, file, 20, 2, 335);
  			attr_dev(tr, "class", "item");
  			attr_dev(tr, "id", tr_id_value = "item-" + /*item*/ ctx[0].id);
  			add_location(tr, file, 15, 0, 145);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, tr, anchor);
  			append_dev(tr, td0);
  			append_dev(td0, t0);
  			append_dev(tr, t1);
  			append_dev(tr, td1);
  			append_dev(td1, img);
  			append_dev(tr, t2);
  			append_dev(tr, td2);
  			append_dev(td2, a);
  			append_dev(a, t3);
  			append_dev(a, t4);
  			append_dev(a, t5);
  			append_dev(tr, t6);
  			if (if_block) if_block.m(tr, null);
  		},
  		p: function update(ctx, [dirty]) {
  			if (dirty & /*item*/ 1 && t0_value !== (t0_value = /*item*/ ctx[0].count + "")) set_data_dev(t0, t0_value);

  			if (dirty & /*item*/ 1 && img.src !== (img_src_value = "//wow.zamimg.com/images/wow/icons/medium/" + /*item*/ ctx[0].icon + ".jpg")) {
  				attr_dev(img, "src", img_src_value);
  			}

  			if (dirty & /*item*/ 1 && t4_value !== (t4_value = /*item*/ ctx[0].name + "")) set_data_dev(t4, t4_value);

  			if (dirty & /*item*/ 1 && a_href_value !== (a_href_value = "https://classic.wowhead.com/item=" + /*item*/ ctx[0].id)) {
  				attr_dev(a, "href", a_href_value);
  			}

  			if (dirty & /*item*/ 1 && a_class_value !== (a_class_value = "q" + /*item*/ ctx[0].rarity + " svelte-13bq8qd")) {
  				attr_dev(a, "class", a_class_value);
  			}

  			if (dirty & /*item*/ 1 && a_data_wowhead_value !== (a_data_wowhead_value = "item=" + /*item*/ ctx[0].id)) {
  				attr_dev(a, "data-wowhead", a_data_wowhead_value);
  			}

  			if (window.testing) if_block.p(ctx, dirty);

  			if (dirty & /*item*/ 1 && tr_id_value !== (tr_id_value = "item-" + /*item*/ ctx[0].id)) {
  				attr_dev(tr, "id", tr_id_value);
  			}
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(tr);
  			if (if_block) if_block.d();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance($$self, $$props, $$invalidate) {
  	let { item } = $$props;
  	const writable_props = ["item"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Item> was created with unknown prop '${key}'`);
  	});

  	$$self.$set = $$props => {
  		if ("item" in $$props) $$invalidate(0, item = $$props.item);
  	};

  	$$self.$capture_state = () => {
  		return { item };
  	};

  	$$self.$inject_state = $$props => {
  		if ("item" in $$props) $$invalidate(0, item = $$props.item);
  	};

  	return [item];
  }

  class Item extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance, create_fragment, safe_not_equal, { item: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Item",
  			options,
  			id: create_fragment.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || ({});

  		if (/*item*/ ctx[0] === undefined && !("item" in props)) {
  			console.warn("<Item> was created without expected prop 'item'");
  		}
  	}

  	get item() {
  		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set item(value) {
  		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* src/Components/ItemList.svelte generated by Svelte v3.16.5 */
  const file$1 = "src/Components/ItemList.svelte";

  function get_each_context(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[1] = list[i];
  	return child_ctx;
  }

  // (22:4) {:else}
  function create_else_block(ctx) {
  	let tr;
  	let td0;
  	let td1;
  	let td2;

  	const block = {
  		c: function create() {
  			tr = element("tr");
  			td0 = element("td");
  			td1 = element("td");
  			td2 = element("td");
  			td2.textContent = "Nothing to see here...";
  			add_location(td0, file$1, 22, 10, 307);
  			add_location(td1, file$1, 22, 19, 316);
  			add_location(td2, file$1, 22, 28, 325);
  			add_location(tr, file$1, 22, 6, 303);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, tr, anchor);
  			append_dev(tr, td0);
  			append_dev(tr, td1);
  			append_dev(tr, td2);
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(tr);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_else_block.name,
  		type: "else",
  		source: "(22:4) {:else}",
  		ctx
  	});

  	return block;
  }

  // (20:4) {#each items as item}
  function create_each_block(ctx) {
  	let current;

  	const item = new Item({
  			props: { item: /*item*/ ctx[1] },
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(item.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(item, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const item_changes = {};
  			if (dirty & /*items*/ 1) item_changes.item = /*item*/ ctx[1];
  			item.$set(item_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(item.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(item.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(item, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block.name,
  		type: "each",
  		source: "(20:4) {#each items as item}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$1(ctx) {
  	let table;
  	let thead;
  	let tr;
  	let td0;
  	let t1;
  	let td1;
  	let t2;
  	let td2;
  	let t4;
  	let tbody;
  	let current;
  	let each_value = /*items*/ ctx[0];
  	let each_blocks = [];

  	for (let i = 0; i < each_value.length; i += 1) {
  		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  	}

  	const out = i => transition_out(each_blocks[i], 1, 1, () => {
  		each_blocks[i] = null;
  	});

  	let each_1_else = null;

  	if (!each_value.length) {
  		each_1_else = create_else_block(ctx);
  		each_1_else.c();
  	}

  	const block = {
  		c: function create() {
  			table = element("table");
  			thead = element("thead");
  			tr = element("tr");
  			td0 = element("td");
  			td0.textContent = "Qty";
  			t1 = space();
  			td1 = element("td");
  			t2 = space();
  			td2 = element("td");
  			td2.textContent = "Item Name";
  			t4 = space();
  			tbody = element("tbody");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			attr_dev(td0, "class", "qty");
  			add_location(td0, file$1, 13, 6, 130);
  			add_location(td1, file$1, 14, 6, 161);
  			add_location(td2, file$1, 15, 6, 177);
  			add_location(tr, file$1, 12, 4, 119);
  			add_location(thead, file$1, 11, 2, 107);
  			add_location(tbody, file$1, 18, 2, 219);
  			add_location(table, file$1, 10, 0, 97);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, table, anchor);
  			append_dev(table, thead);
  			append_dev(thead, tr);
  			append_dev(tr, td0);
  			append_dev(tr, t1);
  			append_dev(tr, td1);
  			append_dev(tr, t2);
  			append_dev(tr, td2);
  			append_dev(table, t4);
  			append_dev(table, tbody);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(tbody, null);
  			}

  			if (each_1_else) {
  				each_1_else.m(tbody, null);
  			}

  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if (dirty & /*items*/ 1) {
  				each_value = /*items*/ ctx[0];
  				let i;

  				for (i = 0; i < each_value.length; i += 1) {
  					const child_ctx = get_each_context(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  						transition_in(each_blocks[i], 1);
  					} else {
  						each_blocks[i] = create_each_block(child_ctx);
  						each_blocks[i].c();
  						transition_in(each_blocks[i], 1);
  						each_blocks[i].m(tbody, null);
  					}
  				}

  				group_outros();

  				for (i = each_value.length; i < each_blocks.length; i += 1) {
  					out(i);
  				}

  				check_outros();
  			}

  			if (each_value.length) {
  				if (each_1_else) {
  					each_1_else.d(1);
  					each_1_else = null;
  				}
  			} else if (!each_1_else) {
  				each_1_else = create_else_block(ctx);
  				each_1_else.c();
  				each_1_else.m(tbody, null);
  			}
  		},
  		i: function intro(local) {
  			if (current) return;

  			for (let i = 0; i < each_value.length; i += 1) {
  				transition_in(each_blocks[i]);
  			}

  			current = true;
  		},
  		o: function outro(local) {
  			each_blocks = each_blocks.filter(Boolean);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				transition_out(each_blocks[i]);
  			}

  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(table);
  			destroy_each(each_blocks, detaching);
  			if (each_1_else) each_1_else.d();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$1.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$1($$self, $$props, $$invalidate) {
  	let { items = [] } = $$props;
  	const writable_props = ["items"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ItemList> was created with unknown prop '${key}'`);
  	});

  	$$self.$set = $$props => {
  		if ("items" in $$props) $$invalidate(0, items = $$props.items);
  	};

  	$$self.$capture_state = () => {
  		return { items };
  	};

  	$$self.$inject_state = $$props => {
  		if ("items" in $$props) $$invalidate(0, items = $$props.items);
  	};

  	return [items];
  }

  class ItemList extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$1, create_fragment$1, safe_not_equal, { items: 0 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "ItemList",
  			options,
  			id: create_fragment$1.name
  		});
  	}

  	get items() {
  		throw new Error("<ItemList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set items(value) {
  		throw new Error("<ItemList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  class FilterEntry {
    constructor(displayName, value, targetProperty) {
      this.displayName = displayName;
      this.value = value;
      this.targetProperty = targetProperty;
      this.log = new Logger('FilterEntry: '+displayName);
      // this.log.setLogLevel(5);
    }

    /**
     *
     * @param {FilterList} subFilter
     */
    setSubFilter(subFilter) {
      this.subFilter = subFilter;
    }

    getFilterEntries(path) {
      if (!path || !this.subFilter) { return []; }
      return this.subFilter.getFilterEntries(path);
    }

    getSubFilter() {
      return this.subFilter;
    }

    simpleFilter(item) {
      let isMatch = item[this.targetProperty] === this.value;
      this.log.debug('Simple filter:',item[this.targetProperty],'==',this.value,'?',isMatch);
      return isMatch;
    }

    /**
     * @param {obj} item
     * @returns {boolean} Does item match filter?
     */
    filter(item, path) {
      // If we don't have a path, this is the last stop. Test it.
      if (!path || !path.length){
        this.log.debug('No path. Using simple filter.');
        return this.simpleFilter(item);
      }

      let id = path[0],
          rest = [];

      // if the first item in the path doesn't point here, it isn't a match.
      if (this.value !== id && this.displayName !== id){
        this.log.debug('This item (',this.value,') does not match the given path:',id);
        return false;
      }
      for (let i = 1; i < path.length; i += 1) {
        rest.push(path[i]);
      }

      // If the path ends here, test the item.
      if (!rest.length || !rest[0]){
        this.log.debug('Last stop. Returning simple.',rest);
        return this.simpleFilter(item);
      }

      // if we've got a subfilter, pass it down
      if (this.subFilter) {
        this.log.debug('Passing it down the chain.', rest);
        return this.subFilter.filter(item, rest);
      }

      // default to simple filtering (not 100% if it is possible to get here but oh well)
      this.log.debug('Default fall-through behavior');
      return this.simpleFilter(item);
    }
  }

  class FilterList {
    /**
     * @param {[string[]]} listItems - in the form of [[displayName, value], ...]
     * @param {*} targetProperty
     */
    constructor(id, listItems, targetProperty) {
      this.id = id;
      this.filterItems = {};
      this.allFilters = [];
      this.targetProperty = targetProperty;
      listItems.forEach(item => {
        let [display, value, subList] = item;
        value = value || display;
        let entry = new FilterEntry(display, value, targetProperty);
        this.filterItems[display] = entry;
        this.allFilters.push(entry);
        if (subList) {
          entry.setSubFilter(subList);
        }
      });
      this.log = new Logger('FilterList: '+this.id);
    }

    getFilterEntries(path) {
      if (!path || !path.length) return this.allFilters;
      let first = path[0];
      let element = this.filterItems[first];
      if (!first || !element) {
        return this.allFilters;
      }
      let rest = path.slice(1);
      return element.getFilterEntries(rest);

    }

    filter(item, subFilter) {
      this.log.debug('filtering',subFilter);
      if(!subFilter || subFilter.constructor !== Array || subFilter.length < 1) {
        return true;
      }
      let subPath = subFilter[0];
      let subItem = this.filterItems[subPath];
      let exists = subItem !== undefined;
      this.log.debug(['path',subPath],['subItem',subItem],['exists',exists]);
      return (subPath || true) && (exists && subItem.filter(item, subFilter));
    }
  }

  /* src/Components/Filter.svelte generated by Svelte v3.16.5 */
  const file$2 = "src/Components/Filter.svelte";

  function get_each_context$1(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[18] = list[i];
  	return child_ctx;
  }

  function get_each_context_1(ctx, list, i) {
  	const child_ctx = ctx.slice();
  	child_ctx[21] = list[i];
  	child_ctx[23] = i;
  	return child_ctx;
  }

  // (200:6) {#if index === selectedFilters.length - 1}
  function create_if_block_1(ctx) {
  	let span;
  	let dispose;

  	const block = {
  		c: function create() {
  			span = element("span");
  			span.textContent = "X";
  			attr_dev(span, "class", "delete svelte-cvme3a");
  			add_location(span, file$2, 200, 8, 5385);
  			dispose = listen_dev(span, "click", /*stepBack*/ ctx[4], false, false, false);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, span, anchor);
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(span);
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block_1.name,
  		type: "if",
  		source: "(200:6) {#if index === selectedFilters.length - 1}",
  		ctx
  	});

  	return block;
  }

  // (197:2) {#each selectedFilters as selectedFilter, index}
  function create_each_block_1(ctx) {
  	let li;
  	let t0_value = /*selectedFilter*/ ctx[21] + "";
  	let t0;
  	let t1;
  	let if_block = /*index*/ ctx[23] === /*selectedFilters*/ ctx[0].length - 1 && create_if_block_1(ctx);

  	const block = {
  		c: function create() {
  			li = element("li");
  			t0 = text(t0_value);
  			t1 = space();
  			if (if_block) if_block.c();
  			attr_dev(li, "class", "svelte-cvme3a");
  			add_location(li, file$2, 197, 4, 5300);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, li, anchor);
  			append_dev(li, t0);
  			append_dev(li, t1);
  			if (if_block) if_block.m(li, null);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*selectedFilters*/ 1 && t0_value !== (t0_value = /*selectedFilter*/ ctx[21] + "")) set_data_dev(t0, t0_value);

  			if (/*index*/ ctx[23] === /*selectedFilters*/ ctx[0].length - 1) {
  				if (if_block) {
  					if_block.p(ctx, dirty);
  				} else {
  					if_block = create_if_block_1(ctx);
  					if_block.c();
  					if_block.m(li, null);
  				}
  			} else if (if_block) {
  				if_block.d(1);
  				if_block = null;
  			}
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(li);
  			if (if_block) if_block.d();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block_1.name,
  		type: "each",
  		source: "(197:2) {#each selectedFilters as selectedFilter, index}",
  		ctx
  	});

  	return block;
  }

  // (205:2) {#if activeFilterOptions && activeFilterOptions.length}
  function create_if_block$1(ctx) {
  	let li;
  	let select;
  	let option;
  	let dispose;
  	let each_value = /*activeFilterOptions*/ ctx[2];
  	let each_blocks = [];

  	for (let i = 0; i < each_value.length; i += 1) {
  		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  	}

  	const block = {
  		c: function create() {
  			li = element("li");
  			select = element("select");
  			option = element("option");
  			option.textContent = "-All-";

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			option.__value = "";
  			option.value = option.__value;
  			add_location(option, file$2, 207, 8, 5643);
  			attr_dev(select, "id", "categorySelector");
  			attr_dev(select, "class", "svelte-cvme3a");
  			if (/*currentSelectedItem*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[17].call(select));
  			add_location(select, file$2, 206, 6, 5540);
  			attr_dev(li, "class", "svelte-cvme3a");
  			add_location(li, file$2, 205, 4, 5529);

  			dispose = [
  				listen_dev(select, "change", /*select_change_handler*/ ctx[17]),
  				listen_dev(select, "change", /*changeFilterOption*/ ctx[3], false, false, false)
  			];
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, li, anchor);
  			append_dev(li, select);
  			append_dev(select, option);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(select, null);
  			}

  			select_option(select, /*currentSelectedItem*/ ctx[1]);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*activeFilterOptions*/ 4) {
  				each_value = /*activeFilterOptions*/ ctx[2];
  				let i;

  				for (i = 0; i < each_value.length; i += 1) {
  					const child_ctx = get_each_context$1(ctx, each_value, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  					} else {
  						each_blocks[i] = create_each_block$1(child_ctx);
  						each_blocks[i].c();
  						each_blocks[i].m(select, null);
  					}
  				}

  				for (; i < each_blocks.length; i += 1) {
  					each_blocks[i].d(1);
  				}

  				each_blocks.length = each_value.length;
  			}

  			if (dirty & /*currentSelectedItem*/ 2) {
  				select_option(select, /*currentSelectedItem*/ ctx[1]);
  			}
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(li);
  			destroy_each(each_blocks, detaching);
  			run_all(dispose);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block$1.name,
  		type: "if",
  		source: "(205:2) {#if activeFilterOptions && activeFilterOptions.length}",
  		ctx
  	});

  	return block;
  }

  // (209:8) {#each activeFilterOptions as filterEntry}
  function create_each_block$1(ctx) {
  	let option;
  	let t_value = /*filterEntry*/ ctx[18].displayName + "";
  	let t;
  	let option_value_value;

  	const block = {
  		c: function create() {
  			option = element("option");
  			t = text(t_value);
  			option.__value = option_value_value = /*filterEntry*/ ctx[18].displayName;
  			option.value = option.__value;
  			add_location(option, file$2, 209, 10, 5736);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, option, anchor);
  			append_dev(option, t);
  		},
  		p: function update(ctx, dirty) {
  			if (dirty & /*activeFilterOptions*/ 4 && t_value !== (t_value = /*filterEntry*/ ctx[18].displayName + "")) set_data_dev(t, t_value);

  			if (dirty & /*activeFilterOptions*/ 4 && option_value_value !== (option_value_value = /*filterEntry*/ ctx[18].displayName)) {
  				prop_dev(option, "__value", option_value_value);
  			}

  			option.value = option.__value;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(option);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_each_block$1.name,
  		type: "each",
  		source: "(209:8) {#each activeFilterOptions as filterEntry}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$2(ctx) {
  	let div;
  	let ul;
  	let t;
  	let each_value_1 = /*selectedFilters*/ ctx[0];
  	let each_blocks = [];

  	for (let i = 0; i < each_value_1.length; i += 1) {
  		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  	}

  	let if_block = /*activeFilterOptions*/ ctx[2] && /*activeFilterOptions*/ ctx[2].length && create_if_block$1(ctx);

  	const block = {
  		c: function create() {
  			div = element("div");
  			ul = element("ul");

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].c();
  			}

  			t = space();
  			if (if_block) if_block.c();
  			attr_dev(ul, "class", "filter-tags svelte-cvme3a");
  			add_location(ul, file$2, 195, 2, 5220);
  			attr_dev(div, "class", "filters");
  			add_location(div, file$2, 193, 0, 5140);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);
  			append_dev(div, ul);

  			for (let i = 0; i < each_blocks.length; i += 1) {
  				each_blocks[i].m(ul, null);
  			}

  			append_dev(ul, t);
  			if (if_block) if_block.m(ul, null);
  		},
  		p: function update(ctx, [dirty]) {
  			if (dirty & /*selectedFilters, stepBack*/ 17) {
  				each_value_1 = /*selectedFilters*/ ctx[0];
  				let i;

  				for (i = 0; i < each_value_1.length; i += 1) {
  					const child_ctx = get_each_context_1(ctx, each_value_1, i);

  					if (each_blocks[i]) {
  						each_blocks[i].p(child_ctx, dirty);
  					} else {
  						each_blocks[i] = create_each_block_1(child_ctx);
  						each_blocks[i].c();
  						each_blocks[i].m(ul, t);
  					}
  				}

  				for (; i < each_blocks.length; i += 1) {
  					each_blocks[i].d(1);
  				}

  				each_blocks.length = each_value_1.length;
  			}

  			if (/*activeFilterOptions*/ ctx[2] && /*activeFilterOptions*/ ctx[2].length) {
  				if (if_block) {
  					if_block.p(ctx, dirty);
  				} else {
  					if_block = create_if_block$1(ctx);
  					if_block.c();
  					if_block.m(ul, null);
  				}
  			} else if (if_block) {
  				if_block.d(1);
  				if_block = null;
  			}
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			destroy_each(each_blocks, detaching);
  			if (if_block) if_block.d();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$2.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function instance$2($$self, $$props, $$invalidate) {
  	const log = new Logger("Filter Component");
  	const dispatch = createEventDispatcher();
  	let { data = [] } = $$props;
  	let selectedFilters = [];

  	const weaponTypes = new FilterList("Weapon",
  	[
  			["One-Handed Axes", "One-Handed Axes"],
  			["Two-Handed Axes", "Two-Handed Axes"],
  			["Bows", "Bows"],
  			["Guns", "Guns"],
  			["One-Handed Maces", "One-Handed Maces"],
  			["Two-Handed Maces", "Two-Handed Maces"],
  			["Polearms", "Polearms"],
  			["One-Handed Swords", "One-Handed Swords"],
  			["Two-Handed Swords", "Two-Handed Swords"],
  			["Warglaives", "Warglaives"],
  			["Staves", "Staves"],
  			["Fist Weapons", "Fist Weapons"],
  			["Miscellaneous", "Miscellaneous"],
  			["Daggers", "Daggers"],
  			["Thrown", "Thrown"],
  			["Spears", "Spears"],
  			["Crossbows", "Crossbows"],
  			["Wands", "Wands"],
  			["Fishing Poles", "Fishing Poles"]
  		],
  	"subType");

  	let armorSlots = new FilterList("Slot",
  	[
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
  		],
  	"equipLoc");

  	let armorSubs = new FilterList("ArmorSubType",
  	[
  			["Miscellaneous", "Miscellaneous", armorSlots],
  			["Cloth", "Cloth", armorSlots],
  			["Leather", "Leather", armorSlots],
  			["Mail", "Mail", armorSlots],
  			["Plate", "Plate", armorSlots],
  			["Cosmetic", "Cosmetic", armorSlots],
  			["Shields", "Shields"],
  			["Librams", "Librams"],
  			["Idols", "Idols"],
  			["Totems", "Totems"],
  			["Sigils", "Sigils"],
  			["Relic", "Relic"]
  		],
  	"subType");

  	let recipeSubtypes = new FilterList("RecipeSubType",
  	[
  			["Cooking"],
  			["First Aid"],
  			["Alchemy"],
  			["Blacksmithing"],
  			["Enchanting"],
  			["Engineering"],
  			["Leatherworking"],
  			["Tailoring"],
  			["Book"]
  		],
  	"subType");

  	const mainCategories = new FilterList("Type",
  	[
  			["Armor", "Armor", armorSubs],
  			["Container", "Container"],
  			["Recipe", "Recipe", recipeSubtypes],
  			["Trade Goods", "Trade Goods"],
  			["Weapon", "Weapon", weaponTypes]
  		],
  	"type");

  	log.debug(mainCategories);

  	function testIt(item, path) {
  		log.debug("testing", item.name, JSON.stringify(path));
  		log.debug(mainCategories.filter(item, path));
  	}

  	function testItemFiltering() {
  		let testItem1 = {
  			name: "testWand",
  			type: "Weapon",
  			subType: "Wands"
  		};

  		testIt(testItem1, ["Armor", "Wands"]);
  		testIt(testItem1, ["Weapon", "Wands"]);
  		testIt(testItem1, ["Weapon", "Daggers"]);

  		let testItem2 = {
  			"equipLoc": "INVTYPE_BODY",
  			"type": "Armor",
  			"rarity": 1,
  			"slot": 11,
  			"subType": "Miscellaneous",
  			"name": "Stylish Black Shirt"
  		};

  		testIt(testItem2, ["Armor", "Miscellaneous"]);
  		testIt(testItem2, ["Armor", "Miscellaneous", ""]);
  	}

  	function testGetFilterItems() {
  		log.debug(mainCategories.getFilterEntries());
  		log.debug(mainCategories.getFilterEntries(["Armor"]));
  	}

  	let currentSelectedItem;
  	let activeFilterOptions = mainCategories.getFilterEntries(selectedFilters);

  	function changeFilterOption() {
  		$$invalidate(0, selectedFilters = selectedFilters.concat([currentSelectedItem]));
  		$$invalidate(1, currentSelectedItem = "");
  		$$invalidate(2, activeFilterOptions = mainCategories.getFilterEntries(selectedFilters));
  		filterData();
  		log.debug("selectedFilters", selectedFilters);
  	}

  	function stepBack() {
  		$$invalidate(0, selectedFilters = selectedFilters.slice(0, selectedFilters.length - 1));
  		$$invalidate(2, activeFilterOptions = mainCategories.getFilterEntries(selectedFilters));
  		filterData();
  	}

  	function filterData() {
  		let filtered = data.filter(item => {
  			return mainCategories.filter(item, selectedFilters);
  		});

  		log.debug("filtered!", filtered);
  		dispatch("filtered", filtered);
  	}

  	afterUpdate(function () {
  		filterData();
  	});

  	const writable_props = ["data"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Filter> was created with unknown prop '${key}'`);
  	});

  	function select_change_handler() {
  		currentSelectedItem = select_value(this);
  		$$invalidate(1, currentSelectedItem);
  		$$invalidate(2, activeFilterOptions);
  	}

  	$$self.$set = $$props => {
  		if ("data" in $$props) $$invalidate(5, data = $$props.data);
  	};

  	$$self.$capture_state = () => {
  		return {
  			data,
  			selectedFilters,
  			armorSlots,
  			armorSubs,
  			recipeSubtypes,
  			currentSelectedItem,
  			activeFilterOptions
  		};
  	};

  	$$self.$inject_state = $$props => {
  		if ("data" in $$props) $$invalidate(5, data = $$props.data);
  		if ("selectedFilters" in $$props) $$invalidate(0, selectedFilters = $$props.selectedFilters);
  		if ("armorSlots" in $$props) armorSlots = $$props.armorSlots;
  		if ("armorSubs" in $$props) armorSubs = $$props.armorSubs;
  		if ("recipeSubtypes" in $$props) recipeSubtypes = $$props.recipeSubtypes;
  		if ("currentSelectedItem" in $$props) $$invalidate(1, currentSelectedItem = $$props.currentSelectedItem);
  		if ("activeFilterOptions" in $$props) $$invalidate(2, activeFilterOptions = $$props.activeFilterOptions);
  	};

  	return [
  		selectedFilters,
  		currentSelectedItem,
  		activeFilterOptions,
  		changeFilterOption,
  		stepBack,
  		data,
  		log,
  		dispatch,
  		weaponTypes,
  		armorSlots,
  		armorSubs,
  		recipeSubtypes,
  		mainCategories,
  		testIt,
  		testItemFiltering,
  		testGetFilterItems,
  		filterData,
  		select_change_handler
  	];
  }

  class Filter extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$2, create_fragment$2, safe_not_equal, { data: 5 });

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "Filter",
  			options,
  			id: create_fragment$2.name
  		});
  	}

  	get data() {
  		throw new Error("<Filter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set data(value) {
  		throw new Error("<Filter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  /* src/App.svelte generated by Svelte v3.16.5 */
  const file$3 = "src/App.svelte";

  // (113:1) {:else}
  function create_else_block$1(ctx) {
  	let p;

  	const block = {
  		c: function create() {
  			p = element("p");
  			p.textContent = "Loading...";
  			attr_dev(p, "class", "loading");
  			add_location(p, file$3, 113, 2, 2345);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, p, anchor);
  		},
  		p: noop,
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(p);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_else_block$1.name,
  		type: "else",
  		source: "(113:1) {:else}",
  		ctx
  	});

  	return block;
  }

  // (110:1) {#if items && items.length}
  function create_if_block$2(ctx) {
  	let t;
  	let current;

  	const filter = new Filter({
  			props: { data: /*items*/ ctx[1] },
  			$$inline: true
  		});

  	filter.$on("filtered", /*onFiltered*/ ctx[5]);

  	const itemlist = new ItemList({
  			props: { items: /*itemsShown*/ ctx[2] },
  			$$inline: true
  		});

  	const block = {
  		c: function create() {
  			create_component(filter.$$.fragment);
  			t = space();
  			create_component(itemlist.$$.fragment);
  		},
  		m: function mount(target, anchor) {
  			mount_component(filter, target, anchor);
  			insert_dev(target, t, anchor);
  			mount_component(itemlist, target, anchor);
  			current = true;
  		},
  		p: function update(ctx, dirty) {
  			const filter_changes = {};
  			if (dirty & /*items*/ 2) filter_changes.data = /*items*/ ctx[1];
  			filter.$set(filter_changes);
  			const itemlist_changes = {};
  			if (dirty & /*itemsShown*/ 4) itemlist_changes.items = /*itemsShown*/ ctx[2];
  			itemlist.$set(itemlist_changes);
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(filter.$$.fragment, local);
  			transition_in(itemlist.$$.fragment, local);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(filter.$$.fragment, local);
  			transition_out(itemlist.$$.fragment, local);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			destroy_component(filter, detaching);
  			if (detaching) detach_dev(t);
  			destroy_component(itemlist, detaching);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block$2.name,
  		type: "if",
  		source: "(110:1) {#if items && items.length}",
  		ctx
  	});

  	return block;
  }

  function create_fragment$3(ctx) {
  	let div;
  	let h1;
  	let t1;
  	let h5;
  	let t2;
  	let t3_value = /*moment*/ ctx[6](/*updated*/ ctx[0]).fromNow() + "";
  	let t3;
  	let t4;
  	let h3;
  	let t5;
  	let t6_value = /*gold*/ ctx[4].gold + "";
  	let t6;
  	let span0;
  	let t8;
  	let t9_value = /*gold*/ ctx[4].silver + "";
  	let t9;
  	let span1;
  	let t11;
  	let t12_value = /*gold*/ ctx[4].copper + "";
  	let t12;
  	let span2;
  	let t14;
  	let current_block_type_index;
  	let if_block;
  	let current;
  	const if_block_creators = [create_if_block$2, create_else_block$1];
  	const if_blocks = [];

  	function select_block_type(ctx, dirty) {
  		if (/*items*/ ctx[1] && /*items*/ ctx[1].length) return 0;
  		return 1;
  	}

  	current_block_type_index = select_block_type(ctx);
  	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

  	const block = {
  		c: function create() {
  			div = element("div");
  			h1 = element("h1");
  			h1.textContent = `${/*title*/ ctx[3]}`;
  			t1 = space();
  			h5 = element("h5");
  			t2 = text("Last Updated: ");
  			t3 = text(t3_value);
  			t4 = space();
  			h3 = element("h3");
  			t5 = text("Coffers:\n\t\t");
  			t6 = text(t6_value);
  			span0 = element("span");
  			span0.textContent = "g";
  			t8 = space();
  			t9 = text(t9_value);
  			span1 = element("span");
  			span1.textContent = "s";
  			t11 = space();
  			t12 = text(t12_value);
  			span2 = element("span");
  			span2.textContent = "c";
  			t14 = space();
  			if_block.c();
  			add_location(h1, file$3, 99, 1, 1973);
  			add_location(h5, file$3, 102, 1, 1996);
  			attr_dev(span0, "class", "gold svelte-rd36mw");
  			add_location(span0, file$3, 105, 13, 2079);
  			attr_dev(span1, "class", "silver svelte-rd36mw");
  			add_location(span1, file$3, 106, 15, 2122);
  			attr_dev(span2, "class", "copper svelte-rd36mw");
  			add_location(span2, file$3, 107, 15, 2167);
  			add_location(h3, file$3, 103, 1, 2050);
  			attr_dev(div, "class", "container svelte-rd36mw");
  			add_location(div, file$3, 98, 0, 1948);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, div, anchor);
  			append_dev(div, h1);
  			append_dev(div, t1);
  			append_dev(div, h5);
  			append_dev(h5, t2);
  			append_dev(h5, t3);
  			append_dev(div, t4);
  			append_dev(div, h3);
  			append_dev(h3, t5);
  			append_dev(h3, t6);
  			append_dev(h3, span0);
  			append_dev(h3, t8);
  			append_dev(h3, t9);
  			append_dev(h3, span1);
  			append_dev(h3, t11);
  			append_dev(h3, t12);
  			append_dev(h3, span2);
  			append_dev(div, t14);
  			if_blocks[current_block_type_index].m(div, null);
  			current = true;
  		},
  		p: function update(ctx, [dirty]) {
  			if ((!current || dirty & /*updated*/ 1) && t3_value !== (t3_value = /*moment*/ ctx[6](/*updated*/ ctx[0]).fromNow() + "")) set_data_dev(t3, t3_value);
  			let previous_block_index = current_block_type_index;
  			current_block_type_index = select_block_type(ctx);

  			if (current_block_type_index === previous_block_index) {
  				if_blocks[current_block_type_index].p(ctx, dirty);
  			} else {
  				group_outros();

  				transition_out(if_blocks[previous_block_index], 1, 1, () => {
  					if_blocks[previous_block_index] = null;
  				});

  				check_outros();
  				if_block = if_blocks[current_block_type_index];

  				if (!if_block) {
  					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  					if_block.c();
  				}

  				transition_in(if_block, 1);
  				if_block.m(div, null);
  			}
  		},
  		i: function intro(local) {
  			if (current) return;
  			transition_in(if_block);
  			current = true;
  		},
  		o: function outro(local) {
  			transition_out(if_block);
  			current = false;
  		},
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(div);
  			if_blocks[current_block_type_index].d();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment$3.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function reloadLinks() {
  	let $WowheadPower = window.$WowheadPower;
  	$WowheadPower.refreshLinks();
  }

  function instance$3($$self, $$props, $$invalidate) {
  	let title = "Guild Bank Prototype (EARLY WIP)";
  	let { bank, gold, updated } = data;
  	updated = updated * 1000;
  	let itemKeys = {};
  	let bags = { bank: [], inventory: [] };

  	for (let bag of bank) {
  		let contents = bag.contents;

  		if (contents.constructor !== Array) {
  			continue;
  		}

  		for (let item of contents) {
  			if (!itemKeys[item.id]) {
  				itemKeys[item.id] = {
  					equipLoc: item.equipLoc,
  					type: item.type,
  					rarity: item.rarity,
  					slot: item.slot,
  					id: item.id,
  					subType: item.subType,
  					minLevel: item.minLevel,
  					count: 0,
  					name: item.name,
  					icon: item.icon
  				};
  			}

  			itemKeys[item.id].count += item.count;
  		}
  	}

  	let axios = window.axios;
  	let tempItems = [];
  	let items = [];

  	Object.keys(itemKeys).sort().forEach(itemID => {
  		axios.get("https://classic.wowhead.com/tooltip/item/" + itemID).then(resp => {
  			let item = itemKeys[itemID];
  			item.icon = resp.data.icon;
  			tempItems.push(item);

  			if (tempItems.length == Object.keys(itemKeys).length) {
  				$$invalidate(1, items = tempItems.slice().sort((aIn, bIn) => {
  					let a = aIn.name;
  					let b = bIn.name;
  					if (a < b) return -1;
  					if (a > b) return 1;
  					return 0;
  				}));
  			}
  		});
  	});

  	let itemsShown = items;

  	function onFiltered(e) {
  		$$invalidate(2, itemsShown = e.detail);
  	}

  	let moment = window.moment;
  	onMount(reloadLinks);

  	$$self.$capture_state = () => {
  		return {};
  	};

  	$$self.$inject_state = $$props => {
  		if ("title" in $$props) $$invalidate(3, title = $$props.title);
  		if ("bank" in $$props) bank = $$props.bank;
  		if ("gold" in $$props) $$invalidate(4, gold = $$props.gold);
  		if ("updated" in $$props) $$invalidate(0, updated = $$props.updated);
  		if ("itemKeys" in $$props) itemKeys = $$props.itemKeys;
  		if ("bags" in $$props) bags = $$props.bags;
  		if ("axios" in $$props) axios = $$props.axios;
  		if ("tempItems" in $$props) tempItems = $$props.tempItems;
  		if ("items" in $$props) $$invalidate(1, items = $$props.items);
  		if ("itemsShown" in $$props) $$invalidate(2, itemsShown = $$props.itemsShown);
  		if ("moment" in $$props) $$invalidate(6, moment = $$props.moment);
  	};

  	return [updated, items, itemsShown, title, gold, onFiltered, moment];
  }

  class App extends SvelteComponentDev {
  	constructor(options) {
  		super(options);
  		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "App",
  			options,
  			id: create_fragment$3.name
  		});
  	}
  }

  window.testing = 0;
  // window.logLevel = LogLevels.debug;
  window.logLevel = LogLevels.warn;
  let app = new App({
    target: document.getElementById('app')
  });

}());
