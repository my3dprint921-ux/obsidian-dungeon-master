var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  ChatView: () => ChatView,
  VIEW_TYPE_CHAT: () => VIEW_TYPE_CHAT,
  default: () => WorldbuildingPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// node_modules/svelte/internal/index.mjs
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var ResizeObserverSingleton = class {
  constructor(options) {
    this.options = options;
    this._listeners = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
  }
  observe(element2, listener) {
    this._listeners.set(element2, listener);
    this._getObserver().observe(element2, this.options);
    return () => {
      this._listeners.delete(element2);
      this._observer.unobserve(element2);
    };
  }
  _getObserver() {
    var _a;
    return (_a = this._observer) !== null && _a !== void 0 ? _a : this._observer = new ResizeObserver((entries) => {
      var _a2;
      for (const entry of entries) {
        ResizeObserverSingleton.entries.set(entry.target, entry);
        (_a2 = this._listeners.get(entry.target)) === null || _a2 === void 0 ? void 0 : _a2(entry);
      }
    });
  }
};
ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
var is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function append(target, node) {
  target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host) {
    return root;
  }
  return node.ownerDocument;
}
function append_stylesheet(node, style) {
  append(node.head || node, style);
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
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
  return text(" ");
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
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function select_option(select, value, mounting) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = /* @__PURE__ */ Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var seen_callbacks = /* @__PURE__ */ new Set();
var flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
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
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
var outroing = /* @__PURE__ */ new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
var _boolean_attributes = [
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
];
var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
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
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles2, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr2, _oldValue, newValue) {
      this[attr2] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
};

// node_modules/tslib/tslib.es6.js
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

// node_modules/svelte/store/index.mjs
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}

// store.ts
var activeNoteStore = writable(null);
var chatHistoryStore = writable([
  { role: "assistant", content: "\xA1Saludos! Soy tu Dungeon Master. \xBFQu\xE9 deseas explorar o hacer en el mundo de hoy?" }
]);
var isTypingStore = writable(false);
var activeCampaignSlotStore = writable("Campa\xF1a 1");

// ChatApp.svelte
function add_css(target) {
  append_styles(target, "svelte-1w1bepf", ".chat-container.svelte-1w1bepf.svelte-1w1bepf{display:flex;flex-direction:column;height:100%;padding:10px;background-color:var(--background-primary);color:var(--text-normal);font-family:var(--font-interface)}.active-note-indicator.svelte-1w1bepf.svelte-1w1bepf{font-size:0.85em;padding:8px;background-color:var(--background-secondary);border-radius:var(--radius-m);margin-bottom:10px;border:1px solid var(--background-modifier-border);color:var(--text-muted)}.messages.svelte-1w1bepf.svelte-1w1bepf{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;margin-bottom:10px;padding-right:5px}.message.svelte-1w1bepf.svelte-1w1bepf{display:flex;max-width:90%}.message.user.svelte-1w1bepf.svelte-1w1bepf{align-self:flex-end}.message.assistant.svelte-1w1bepf.svelte-1w1bepf{align-self:flex-start}.message-content.svelte-1w1bepf.svelte-1w1bepf{padding:8px 12px;border-radius:var(--radius-m);font-size:var(--font-ui-medium);line-height:var(--line-height-normal)}.message.user.svelte-1w1bepf .message-content.svelte-1w1bepf{background-color:var(--interactive-accent);color:var(--text-on-accent);border-bottom-right-radius:2px}.message.assistant.svelte-1w1bepf .message-content.svelte-1w1bepf{background-color:var(--background-secondary-alt);border:1px solid var(--background-modifier-border);border-bottom-left-radius:2px}.input-area.svelte-1w1bepf.svelte-1w1bepf{display:flex;flex-direction:column;gap:8px;margin-top:auto}.quick-actions.svelte-1w1bepf.svelte-1w1bepf{display:flex;gap:5px;flex-wrap:wrap}.action-btn.svelte-1w1bepf.svelte-1w1bepf{font-size:0.75em;padding:4px 8px;height:auto;border-radius:var(--radius-s);background-color:var(--background-secondary);color:var(--text-normal);border:1px solid var(--background-modifier-border);cursor:pointer}.action-btn.svelte-1w1bepf.svelte-1w1bepf:hover{background-color:var(--background-modifier-hover)}.input-wrapper.svelte-1w1bepf.svelte-1w1bepf{display:flex;gap:8px}textarea.svelte-1w1bepf.svelte-1w1bepf{flex:1;resize:none;height:50px;min-height:50px;font-family:inherit;background-color:var(--background-modifier-form-field);border:1px solid var(--background-modifier-border);color:var(--text-normal);border-radius:var(--radius-m);padding:8px}.send-btn.svelte-1w1bepf.svelte-1w1bepf{height:50px;width:60px;cursor:pointer}");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[17] = list[i];
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  return child_ctx;
}
function create_each_block_1(ctx) {
  let option;
  let t_value = (
    /*camp*/
    ctx[20] + ""
  );
  let t;
  let option_value_value;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = option_value_value = /*camp*/
      ctx[20];
      option.value = option.__value;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
function create_if_block_1(ctx) {
  let div;
  let span;
  let t1;
  let strong;
  let t2;
  let t3_value = (
    /*activeNote*/
    ctx[2].basename + ""
  );
  let t3;
  let t4;
  return {
    c() {
      div = element("div");
      span = element("span");
      span.textContent = "\u{1F4C4}";
      t1 = text(" Viendo: ");
      strong = element("strong");
      t2 = text("[[");
      t3 = text(t3_value);
      t4 = text("]]");
      attr(span, "class", "icon");
      attr(div, "class", "active-note-indicator svelte-1w1bepf");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, span);
      append(div, t1);
      append(div, strong);
      append(strong, t2);
      append(strong, t3);
      append(strong, t4);
    },
    p(ctx2, dirty) {
      if (dirty & /*activeNote*/
      4 && t3_value !== (t3_value = /*activeNote*/
      ctx2[2].basename + ""))
        set_data(t3, t3_value);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_each_block(ctx) {
  let div1;
  let div0;
  let t_value = (
    /*msg*/
    ctx[17].content + ""
  );
  let t;
  let div1_class_value;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t = text(t_value);
      attr(div0, "class", "message-content svelte-1w1bepf");
      attr(div1, "class", div1_class_value = "message " + /*msg*/
      ctx[17].role + " svelte-1w1bepf");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*messages*/
      2 && t_value !== (t_value = /*msg*/
      ctx2[17].content + ""))
        set_data(t, t_value);
      if (dirty & /*messages*/
      2 && div1_class_value !== (div1_class_value = "message " + /*msg*/
      ctx2[17].role + " svelte-1w1bepf")) {
        attr(div1, "class", div1_class_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div1);
    }
  };
}
function create_if_block(ctx) {
  let div1;
  return {
    c() {
      div1 = element("div");
      div1.innerHTML = `<div class="message-content typing svelte-1w1bepf">El DM est\xE1 decidiendo tu destino...</div>`;
      attr(div1, "class", "message assistant svelte-1w1bepf");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(div1);
    }
  };
}
function create_fragment(ctx) {
  let div5;
  let div0;
  let select;
  let t0;
  let button0;
  let t2;
  let t3;
  let div1;
  let t4;
  let t5;
  let div4;
  let div2;
  let button1;
  let t7;
  let button2;
  let t9;
  let button3;
  let t11;
  let button4;
  let t13;
  let div3;
  let textarea;
  let t14;
  let button5;
  let mounted;
  let dispose;
  let each_value_1 = (
    /*campaigns*/
    ctx[5]
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  let if_block0 = (
    /*activeNote*/
    ctx[2] && create_if_block_1(ctx)
  );
  let each_value = (
    /*messages*/
    ctx[1]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  let if_block1 = (
    /*isTyping*/
    ctx[3] && create_if_block(ctx)
  );
  return {
    c() {
      div5 = element("div");
      div0 = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t0 = space();
      button0 = element("button");
      button0.textContent = "\u{1F9F9}";
      t2 = space();
      if (if_block0)
        if_block0.c();
      t3 = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t4 = space();
      if (if_block1)
        if_block1.c();
      t5 = space();
      div4 = element("div");
      div2 = element("div");
      button1 = element("button");
      button1.textContent = "\u{1F440} Observar entorno";
      t7 = space();
      button2 = element("button");
      button2.textContent = "\u{1F5E3} Buscar a alguien";
      t9 = space();
      button3 = element("button");
      button3.textContent = "\u{1F3B2} Tirar dados";
      t11 = space();
      button4 = element("button");
      button4.textContent = "\u25B6\uFE0F Retomar sesi\xF3n";
      t13 = space();
      div3 = element("div");
      textarea = element("textarea");
      t14 = space();
      button5 = element("button");
      button5.textContent = "Enviar";
      attr(button0, "class", "clear-btn");
      attr(button0, "title", "Limpiar campa\xF1a");
      attr(div0, "class", "campaign-selector");
      attr(div1, "class", "messages svelte-1w1bepf");
      attr(button1, "class", "mod-cta action-btn svelte-1w1bepf");
      attr(button2, "class", "mod-cta action-btn svelte-1w1bepf");
      attr(button3, "class", "mod-cta action-btn svelte-1w1bepf");
      attr(button4, "class", "mod-cta action-btn svelte-1w1bepf");
      set_style(button4, "background-color", "var(--color-purple)");
      set_style(button4, "color", "white");
      attr(div2, "class", "quick-actions svelte-1w1bepf");
      attr(textarea, "placeholder", "Pregunta sobre tu mundo...");
      attr(textarea, "class", "svelte-1w1bepf");
      attr(button5, "class", "send-btn mod-cta svelte-1w1bepf");
      attr(div3, "class", "input-wrapper svelte-1w1bepf");
      attr(div4, "class", "input-area svelte-1w1bepf");
      attr(div5, "class", "chat-container svelte-1w1bepf");
    },
    m(target, anchor) {
      insert(target, div5, anchor);
      append(div5, div0);
      append(div0, select);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(select, null);
        }
      }
      select_option(
        select,
        /*activeCampaign*/
        ctx[4]
      );
      append(div0, t0);
      append(div0, button0);
      append(div5, t2);
      if (if_block0)
        if_block0.m(div5, null);
      append(div5, t3);
      append(div5, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append(div1, t4);
      if (if_block1)
        if_block1.m(div1, null);
      append(div5, t5);
      append(div5, div4);
      append(div4, div2);
      append(div2, button1);
      append(div2, t7);
      append(div2, button2);
      append(div2, t9);
      append(div2, button3);
      append(div2, t11);
      append(div2, button4);
      append(div4, t13);
      append(div4, div3);
      append(div3, textarea);
      set_input_value(
        textarea,
        /*inputText*/
        ctx[0]
      );
      append(div3, t14);
      append(div3, button5);
      if (!mounted) {
        dispose = [
          listen(
            select,
            "change",
            /*changeCampaign*/
            ctx[6]
          ),
          listen(
            button0,
            "click",
            /*clearCampaign*/
            ctx[7]
          ),
          listen(
            button1,
            "click",
            /*click_handler*/
            ctx[11]
          ),
          listen(
            button2,
            "click",
            /*click_handler_1*/
            ctx[12]
          ),
          listen(
            button3,
            "click",
            /*click_handler_2*/
            ctx[13]
          ),
          listen(
            button4,
            "click",
            /*click_handler_3*/
            ctx[14]
          ),
          listen(
            textarea,
            "input",
            /*textarea_input_handler*/
            ctx[15]
          ),
          listen(
            textarea,
            "keydown",
            /*keydown_handler*/
            ctx[16]
          ),
          listen(
            button5,
            "click",
            /*sendMessage*/
            ctx[8]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*campaigns*/
      32) {
        each_value_1 = /*campaigns*/
        ctx2[5];
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_1(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(select, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_1.length;
      }
      if (dirty & /*activeCampaign, campaigns*/
      48) {
        select_option(
          select,
          /*activeCampaign*/
          ctx2[4]
        );
      }
      if (
        /*activeNote*/
        ctx2[2]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_1(ctx2);
          if_block0.c();
          if_block0.m(div5, t3);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty & /*messages*/
      2) {
        each_value = /*messages*/
        ctx2[1];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div1, t4);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (
        /*isTyping*/
        ctx2[3]
      ) {
        if (if_block1) {
        } else {
          if_block1 = create_if_block(ctx2);
          if_block1.c();
          if_block1.m(div1, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty & /*inputText*/
      1) {
        set_input_value(
          textarea,
          /*inputText*/
          ctx2[0]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div5);
      destroy_each(each_blocks_1, detaching);
      if (if_block0)
        if_block0.d();
      destroy_each(each_blocks, detaching);
      if (if_block1)
        if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { plugin } = $$props;
  let inputText = "";
  let messages = [];
  let activeNote = null;
  let isTyping = false;
  let activeCampaign = "Campa\xF1a 1";
  let campaigns = ["Campa\xF1a 1", "Campa\xF1a 2", "Campa\xF1a 3", "Campa\xF1a 4", "Campa\xF1a 5"];
  chatHistoryStore.subscribe((value) => {
    $$invalidate(1, messages = value);
  });
  activeNoteStore.subscribe((value) => {
    $$invalidate(2, activeNote = value);
  });
  isTypingStore.subscribe((value) => {
    $$invalidate(3, isTyping = value);
  });
  activeCampaignSlotStore.subscribe((value) => {
    $$invalidate(4, activeCampaign = value);
  });
  onMount(() => __awaiter(void 0, void 0, void 0, function* () {
    const history = yield plugin.sessionManager.loadCampaign(activeCampaign);
    chatHistoryStore.set(history);
  }));
  function changeCampaign(event) {
    return __awaiter(this, void 0, void 0, function* () {
      const select = event.target;
      const newSlot = select.value;
      activeCampaignSlotStore.set(newSlot);
      const history = yield plugin.sessionManager.loadCampaign(newSlot);
      chatHistoryStore.set(history);
    });
  }
  function clearCampaign() {
    return __awaiter(this, void 0, void 0, function* () {
      if (confirm(`\xBFEst\xE1s seguro de que deseas limpiar la ${activeCampaign}? Esto sobrescribir\xE1 el archivo Markdown.`)) {
        const history = yield plugin.sessionManager.clearCampaign(activeCampaign);
        chatHistoryStore.set(history);
      }
    });
  }
  function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!inputText.trim() || isTyping)
        return;
      const userMsg = inputText;
      chatHistoryStore.update((history) => [...history, { role: "user", content: userMsg }]);
      $$invalidate(0, inputText = "");
      isTypingStore.set(true);
      yield plugin.sessionManager.saveCampaign(activeCampaign, messages);
      const activeText = activeNote ? activeNote.content : "";
      const response = yield plugin.dungeonMaster.chat(userMsg, activeText, messages);
      chatHistoryStore.update((history) => [...history, { role: "assistant", content: response }]);
      yield plugin.sessionManager.saveCampaign(activeCampaign, messages);
      isTypingStore.set(false);
    });
  }
  function quickAction(action) {
    let prompt = "";
    switch (action) {
      case "look":
        prompt = `(Acci\xF3n) Miro a mi alrededor. \xBFQu\xE9 veo en este lugar?`;
        break;
      case "npc":
        prompt = `(Acci\xF3n) \xBFHay alguien interesante cerca? Genera un NPC que encaje en este lugar.`;
        break;
      case "roll":
        prompt = `(Acci\xF3n) Quiero realizar una tirada para investigar u obtener informaci\xF3n. \xBFQu\xE9 debo tirar?`;
        break;
      case "resume":
        prompt = `(Metajuego) He vuelto a la mesa para retomar la sesi\xF3n. Haz un breve resumen narrativo sobre la situaci\xF3n actual en la que nos quedamos, e inv\xEDtame a decir qu\xE9 hago a continuaci\xF3n.`;
        break;
    }
    $$invalidate(0, inputText = prompt);
    sendMessage();
  }
  const click_handler = () => quickAction("look");
  const click_handler_1 = () => quickAction("npc");
  const click_handler_2 = () => quickAction("roll");
  const click_handler_3 = () => quickAction("resume");
  function textarea_input_handler() {
    inputText = this.value;
    $$invalidate(0, inputText);
  }
  const keydown_handler = (e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage());
  $$self.$$set = ($$props2) => {
    if ("plugin" in $$props2)
      $$invalidate(10, plugin = $$props2.plugin);
  };
  return [
    inputText,
    messages,
    activeNote,
    isTyping,
    activeCampaign,
    campaigns,
    changeCampaign,
    clearCampaign,
    sendMessage,
    quickAction,
    plugin,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    textarea_input_handler,
    keydown_handler
  ];
}
var ChatApp = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { plugin: 10 }, add_css);
  }
};
var ChatApp_default = ChatApp;

// ContextManager.ts
var ContextManager = class {
  constructor(app) {
    this.app = app;
  }
  /**
   * Inicia los listeners para monitorear el estado del workspace
   */
  registerListeners(plugin) {
    plugin.registerEvent(
      this.app.workspace.on("file-open", async (file) => {
        await this.handleFileOpen(file);
      })
    );
    this.app.workspace.onLayoutReady(() => {
      const activeFile = this.app.workspace.getActiveFile();
      if (activeFile) {
        this.handleFileOpen(activeFile);
      }
    });
  }
  async handleFileOpen(file) {
    if (!file || file.extension !== "md") {
      activeNoteStore.set(null);
      return;
    }
    const content = await this.app.vault.read(file);
    const snippet = content.substring(0, 1e3);
    activeNoteStore.set({
      path: file.path,
      basename: file.basename,
      content: snippet
    });
  }
};

// VectorStore.ts
var import_obsidian = require("obsidian");
var VectorStore = class {
  constructor(app, apiKey) {
    this.store = [];
    this.storePath = ".obsidian/plugins/worldbuilding-assistant/embeddings.json";
    this.app = app;
    this.apiKey = apiKey;
  }
  /**
   * Carga los embeddings desde el disco usando el adaptador de Obsidian.
   */
  async loadStore() {
    try {
      const adapter = this.app.vault.adapter;
      if (await adapter.exists(this.storePath)) {
        const data = await adapter.read(this.storePath);
        this.store = JSON.parse(data);
        console.log(`Loaded ${this.store.length} embeddings from local store.`);
      }
    } catch (error) {
      console.error("Error loading vector store:", error);
    }
  }
  /**
   * Guarda los embeddings actuales en el disco.
   */
  async saveStore() {
    try {
      const adapter = this.app.vault.adapter;
      const dirPath = ".obsidian/plugins/worldbuilding-assistant";
      if (!await adapter.exists(dirPath)) {
        await adapter.mkdir(dirPath);
      }
      await adapter.write(this.storePath, JSON.stringify(this.store));
      console.log(`Saved ${this.store.length} embeddings to store.`);
    } catch (error) {
      console.error("Error saving vector store:", error);
    }
  }
  /**
   * Obtiene el embedding utilizando la API de Google Gemini (text-embedding-004).
   */
  async getEmbedding(text2) {
    if (!this.apiKey) {
      console.error("Gemini API Key is missing. Please set it in the plugin settings.");
      return null;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.apiKey}`;
    try {
      const response = await (0, import_obsidian.requestUrl)({
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text: text2 }]
          }
        })
      });
      if (response.status === 200 && response.json.embedding) {
        return response.json.embedding.values;
      } else {
        console.error("Gemini API Error:", response.text);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch embedding:", error);
      return null;
    }
  }
  /**
   * Procesa un array de chunks y genera sus embeddings.
   */
  async addChunks(chunks) {
    const batchSize = 5;
    let processed = 0;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const promises = batch.map(async (chunk) => {
        const exists = this.store.find((e) => e.metadata.path === chunk.path && e.metadata.text === chunk.text);
        if (exists)
          return;
        const embedding = await this.getEmbedding(chunk.text);
        if (embedding) {
          this.store.push({ metadata: chunk, embedding });
        }
      });
      await Promise.all(promises);
      processed += batch.length;
      console.log(`Vectorized ${processed}/${chunks.length} chunks...`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await this.saveStore();
  }
  /**
   * Búsqueda semántica usando similitud del coseno.
   * Retorna los topK chunks más relevantes.
   */
  async search(query, topK = 5) {
    const queryEmbedding = await this.getEmbedding(query);
    if (!queryEmbedding)
      return [];
    const results = this.store.map((entry) => {
      return {
        entry,
        similarity: this.cosineSimilarity(queryEmbedding, entry.embedding)
      };
    });
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK).map((r) => r.entry);
  }
  /**
   * Calcula la similitud del coseno entre dos vectores (embeddings).
   */
  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0)
      return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
};

// LogicOracle.ts
var import_obsidian2 = require("obsidian");
var LogicOracle = class {
  constructor(app, apiKey, vectorStore) {
    this.app = app;
    this.apiKey = apiKey;
    this.vectorStore = vectorStore;
  }
  /**
   * Evalúa la consistencia de la nota activa comparándola con el lore recuperado (RAG) vía Gemini API.
   */
  async checkConsistency(activeNoteText) {
    var _a, _b, _c, _d, _e;
    if (!this.apiKey) {
      console.error("Gemini API key missing.");
      return [];
    }
    const contextEntries = await this.vectorStore.search(activeNoteText, 5);
    const contextChunks = contextEntries.map((e) => `[${e.metadata.filename}]: ${e.metadata.text}`).join("\n\n");
    const systemPrompt = `
Eres un Editor de Continuidad experto para una saga de ciencia ficci\xF3n y fantas\xEDa.
Tu objetivo es analizar el borrador actual (Nota Activa) y compararlo con el conocimiento establecido del mundo (Contexto del Lore).
Debes identificar \xDANICAMENTE contradicciones l\xF3gicas, de tiempo, geogr\xE1ficas o de estado de los personajes.
Ignora errores tipogr\xE1ficos o de estilo.

Responde ESTRICTAMENTE en formato JSON, sin markdown adicional, con la siguiente estructura:
{
    "contradictions": [
        {
            "textFragment": "Cita exacta del borrador que es contradictoria",
            "reason": "Explicaci\xF3n breve de por qu\xE9 contradice el lore establecido"
        }
    ]
}
Si no hay contradicciones, retorna {"contradictions": []}.
`;
    const userPrompt = `
--- CONTEXTO DEL LORE (Verdad Establecida) ---
${contextChunks || "No hay contexto disponible."}

--- NOTA ACTIVA (Borrador a Evaluar) ---
${activeNoteText}
`;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${this.apiKey}`;
      const response = await (0, import_obsidian2.requestUrl)({
        url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });
      if (response.status === 200 && ((_e = (_d = (_c = (_b = (_a = response.json.candidates) == null ? void 0 : _a[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e.text)) {
        const jsonText = response.json.candidates[0].content.parts[0].text;
        const result = JSON.parse(jsonText);
        return result.contradictions || [];
      }
    } catch (error) {
      console.error("Error validando consistencia con Gemini:", error);
    }
    return [];
  }
  /**
   * Resalta el texto contradictorio en el editor activo inyectando tags HTML <mark>.
   * Nota: En producción, es ideal usar CodeMirror 6 Decorations para no ensuciar el markdown subyacente.
   */
  highlightContradictions(contradictions) {
    var _a;
    const activeEditor = (_a = this.app.workspace.activeEditor) == null ? void 0 : _a.editor;
    if (!activeEditor)
      return;
    const documentText = activeEditor.getValue();
    let updatedText = documentText;
    for (const c of contradictions) {
      if (updatedText.includes(c.textFragment) && !updatedText.includes(`<mark>${c.textFragment}</mark>`)) {
        updatedText = updatedText.replace(c.textFragment, `<mark class="worldbuilder-contradiction" title="${c.reason}">${c.textFragment}</mark>`);
      }
    }
    if (updatedText !== documentText) {
      activeEditor.setValue(updatedText);
    }
  }
};

// DungeonMaster.ts
var import_obsidian3 = require("obsidian");
var DungeonMaster = class {
  constructor(app, apiKey, vectorStore) {
    this.app = app;
    this.apiKey = apiKey;
    this.vectorStore = vectorStore;
  }
  /**
   * Procesa un mensaje del usuario, consulta el lore y devuelve la respuesta del DM.
   */
  async chat(userMessage, activeNoteText, history) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!this.apiKey) {
      return "\u274C Error: API Key de Gemini no configurada. Por favor, a\xF1\xE1dela en los ajustes del plugin.";
    }
    const searchQuery = `${userMessage}
Contexto actual: ${activeNoteText.substring(0, 500)}`;
    const contextEntries = await this.vectorStore.search(searchQuery, 5);
    const contextChunks = contextEntries.map((e) => `[${e.metadata.filename}]: ${e.metadata.text}`).join("\n\n");
    const systemPrompt = `
Eres un Dungeon Master (DM) experto, inmersivo y creativo. Est\xE1s dirigiendo una partida de rol basada \xDANICAMENTE en el lore y el mundo que se describe en el "CONTEXTO DEL LORE".
Tu objetivo es narrar la historia, describir los entornos, interpretar a los NPCs y reaccionar a las acciones del jugador.
Reglas:
1. Mant\xE9n siempre el personaje. Nunca rompas la cuarta pared a menos que sea para aclarar una regla mec\xE1nica.
2. Usa el CONTEXTO DEL LORE para describir el mundo, los personajes, facciones o reglas m\xE1gicas.
3. Si el jugador intenta algo que el lore contradice, describe las consecuencias de forma narrativa.
4. S\xE9 conciso pero evocador en tus descripciones. No escribas mon\xF3logos largos. Deja que el jugador act\xFAe.
5. Puedes pedirle al jugador que "tire los dados" (ej. "Tira Percepci\xF3n", "Haz una tirada de iniciativa") cuando quiera realizar una acci\xF3n con probabilidad de fallo.
6. IMPORTANTE: Modula tu personalidad y extensi\xF3n para que tus respuestas siempre concluyan sus ideas de manera natural y no se corten a la mitad. Tu l\xEDmite de atenci\xF3n es de unas 1000 palabras, as\xED que aseg\xFArate de poner un punto final y ceder el turno al jugador antes de extenderte demasiado.

--- CONTEXTO DEL LORE (Tu Mundo) ---
${contextChunks || "El mundo es un misterio sin notas. Improvisa bas\xE1ndote en la nota activa."}

--- NOTA ACTIVA ACTUAL (D\xF3nde podr\xEDa estar el jugador) ---
${activeNoteText.substring(0, 1e3)}
`;
    const contents = [];
    for (const msg of history) {
      const role = msg.role === "user" ? "user" : "model";
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += "\n\n" + msg.content;
      } else {
        contents.push({
          role,
          parts: [{ text: msg.content }]
        });
      }
    }
    if (contents.length === 0 || contents[0].role !== "user") {
      contents.unshift({
        role: "user",
        parts: [{ text: systemPrompt }]
      });
    } else {
      contents[0].parts[0].text = systemPrompt + "\n\n---\n\n" + contents[0].parts[0].text;
    }
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${this.apiKey}`;
      const response = await (0, import_obsidian3.requestUrl)({
        url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        throw: false,
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            // Un poco de creatividad
            maxOutputTokens: 2e3
          }
        })
      });
      if (response.status === 200 && ((_f = (_e = (_d = (_c = (_b = (_a = response.json) == null ? void 0 : _a.candidates) == null ? void 0 : _b[0]) == null ? void 0 : _c.content) == null ? void 0 : _d.parts) == null ? void 0 : _e[0]) == null ? void 0 : _f.text)) {
        return response.json.candidates[0].content.parts[0].text;
      } else {
        console.error("Gemini Response Error:", response.json || response.text);
        const errorMsg = ((_h = (_g = response.json) == null ? void 0 : _g.error) == null ? void 0 : _h.message) || response.text || "Desconocido";
        return `\u274C Error de Gemini (${response.status}): ${errorMsg}`;
      }
    } catch (error) {
      console.error("Error contactando al DM (Gemini):", error);
      return `\u274C El DM perdi\xF3 la conexi\xF3n con el mundo astral: ${error.message || error}`;
    }
  }
};

// Indexer.ts
var Indexer = class {
  constructor(app) {
    this.app = app;
  }
  /**
   * Escanea todos los archivos .md de la bóveda, realiza chunking y devuelve los metadatos.
   */
  async indexVault() {
    const files = this.app.vault.getMarkdownFiles();
    const chunks = [];
    const batchSize = 10;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map((file) => this.processFile(file));
      const batchResults = await Promise.all(batchPromises);
      for (const result of batchResults) {
        if (result) {
          chunks.push(...result);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return chunks;
  }
  /**
   * Lee un archivo y lo divide en chunks si no está en un directorio oculto.
   */
  async processFile(file) {
    if (file.path.startsWith(".") || file.path.includes("/.")) {
      return null;
    }
    const content = await this.app.vault.read(file);
    const fileChunks = this.chunkText(content, 500);
    return fileChunks.map((text2) => ({
      path: file.path,
      filename: file.basename,
      text: text2
    }));
  }
  /**
   * Fragmenta el texto respetando los saltos de párrafo.
   */
  chunkText(text2, maxTokens) {
    const maxChars = maxTokens * 4;
    const paragraphs = text2.split(/\n\s*\n/);
    const chunks = [];
    let currentChunk = "";
    for (const paragraph of paragraphs) {
      if (paragraph.length > maxChars) {
        if (currentChunk.trim().length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = "";
        }
        let remaining = paragraph;
        while (remaining.length > 0) {
          chunks.push(remaining.substring(0, maxChars).trim());
          remaining = remaining.substring(maxChars);
        }
        continue;
      }
      if (currentChunk.length + paragraph.length > maxChars && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      currentChunk += paragraph + "\n\n";
    }
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    return chunks;
  }
};

// SessionManager.ts
var SessionManager = class {
  constructor(app) {
    this.folderPath = "Dnd";
    this.app = app;
  }
  /**
   * Asegura que la carpeta Dnd existe.
   */
  async ensureFolderExists() {
    const adapter = this.app.vault.adapter;
    if (!await adapter.exists(this.folderPath)) {
      await adapter.mkdir(this.folderPath);
    }
  }
  /**
   * Parsea un archivo markdown en una lista de mensajes.
   */
  async loadCampaign(slotName) {
    await this.ensureFolderExists();
    const filePath = `${this.folderPath}/${slotName}.md`;
    const adapter = this.app.vault.adapter;
    if (!await adapter.exists(filePath)) {
      const initialHistory = [
        { role: "assistant", content: "\xA1Saludos! Soy tu Dungeon Master. \xBFQu\xE9 deseas explorar o hacer en el mundo de hoy?" }
      ];
      await this.saveCampaign(slotName, initialHistory);
      return initialHistory;
    }
    const content = await adapter.read(filePath);
    return this.parseMarkdownToHistory(content);
  }
  /**
   * Sobrescribe el historial completo al archivo markdown.
   */
  async saveCampaign(slotName, history) {
    await this.ensureFolderExists();
    const filePath = `${this.folderPath}/${slotName}.md`;
    const markdown = this.parseHistoryToMarkdown(slotName, history);
    await this.app.vault.adapter.write(filePath, markdown);
  }
  /**
   * Limpia la campaña y la devuelve a su estado inicial.
   */
  async clearCampaign(slotName) {
    const initialHistory = [
      { role: "assistant", content: "\xA1Saludos! Soy tu Dungeon Master. \xBFQu\xE9 deseas explorar o hacer en el mundo de hoy?" }
    ];
    await this.saveCampaign(slotName, initialHistory);
    return initialHistory;
  }
  parseHistoryToMarkdown(slotName, history) {
    let md = `# Sesi\xF3n: ${slotName}

`;
    for (const msg of history) {
      const roleName = msg.role === "assistant" ? "DM" : "T\xFA";
      md += `### ${roleName}
${msg.content}

`;
    }
    return md;
  }
  parseMarkdownToHistory(markdown) {
    const history = [];
    const chunks = markdown.split("### ");
    for (let i = 1; i < chunks.length; i++) {
      const lines = chunks[i].split("\n");
      const roleStr = lines[0].trim();
      const content = lines.slice(1).join("\n").trim();
      if (roleStr === "DM") {
        history.push({ role: "assistant", content });
      } else if (roleStr === "T\xFA") {
        history.push({ role: "user", content });
      }
    }
    if (history.length === 0) {
      return [{ role: "assistant", content: "\xA1Saludos! Soy tu Dungeon Master. \xBFQu\xE9 deseas explorar o hacer en el mundo de hoy?" }];
    }
    return history;
  }
};

// main.ts
var DEFAULT_SETTINGS = {
  llmProvider: "gemini",
  apiKey: "",
  ollamaUrl: "http://localhost:11434"
};
var VIEW_TYPE_CHAT = "worldbuilding-chat-view";
var ChatView = class extends import_obsidian4.ItemView {
  // Svelte component instance
  constructor(leaf) {
    super(leaf);
  }
  getViewType() {
    return VIEW_TYPE_CHAT;
  }
  getDisplayText() {
    return "Worldbuilding Chat";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    this.component = new ChatApp_default({
      target: container,
      props: {
        plugin: this.app.plugins.getPlugin("worldbuilding-assistant")
      }
    });
  }
  async onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }
};
var WorldbuildingPlugin = class extends import_obsidian4.Plugin {
  async onload() {
    await this.loadSettings();
    this.contextManager = new ContextManager(this.app);
    this.contextManager.registerListeners(this);
    this.vectorStore = new VectorStore(this.app, this.settings.apiKey);
    await this.vectorStore.loadStore();
    this.logicOracle = new LogicOracle(this.app, this.settings.apiKey, this.vectorStore);
    this.dungeonMaster = new DungeonMaster(this.app, this.settings.apiKey, this.vectorStore);
    this.sessionManager = new SessionManager(this.app);
    this.registerView(
      VIEW_TYPE_CHAT,
      (leaf) => new ChatView(leaf)
    );
    this.addRibbonIcon("messages-square", "Open Worldbuilding Chat", () => {
      this.activateView();
    });
    this.addCommand({
      id: "open-worldbuilding-chat",
      name: "Open Worldbuilding Chat",
      callback: () => {
        this.activateView();
      }
    });
    this.addCommand({
      id: "index-worldbuilding-vault",
      name: "Index Vault for Dungeon Master (RAG)",
      callback: async () => {
        new import_obsidian4.Notice("Empezando a escanear e indexar la b\xF3veda... El DM est\xE1 estudiando.");
        try {
          const indexer = new Indexer(this.app);
          const chunks = await indexer.indexVault();
          await this.vectorStore.addChunks(chunks);
          new import_obsidian4.Notice(`\xA1\xC9xito! El DM aprendi\xF3 ${chunks.length} fragmentos de lore.`);
        } catch (error) {
          console.error("Error indexing:", error);
          new import_obsidian4.Notice("Error al indexar la b\xF3veda. Revisa la consola.");
        }
      }
    });
    this.addSettingTab(new WorldbuildingSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    if (this.dungeonMaster)
      this.dungeonMaster.apiKey = this.settings.apiKey;
    if (this.vectorStore)
      this.vectorStore.apiKey = this.settings.apiKey;
    if (this.logicOracle)
      this.logicOracle.apiKey = this.settings.apiKey;
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_CHAT);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({ type: VIEW_TYPE_CHAT, active: true });
      }
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }
};
var WorldbuildingSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian4.Setting(containerEl).setName("LLM Provider").setDesc("Choose your preferred LLM provider").addDropdown((dropdown) => dropdown.addOption("gemini", "Google Gemini").addOption("ollama", "Ollama (Local)").addOption("openai", "OpenAI").addOption("claude", "Anthropic Claude").setValue(this.plugin.settings.llmProvider).onChange(async (value) => {
      this.plugin.settings.llmProvider = value;
      await this.plugin.saveSettings();
      this.display();
    }));
    if (this.plugin.settings.llmProvider === "ollama") {
      new import_obsidian4.Setting(containerEl).setName("Ollama URL").setDesc("Default is http://localhost:11434").addText((text2) => text2.setPlaceholder("http://localhost:11434").setValue(this.plugin.settings.ollamaUrl).onChange(async (value) => {
        this.plugin.settings.ollamaUrl = value;
        await this.plugin.saveSettings();
      }));
    } else {
      new import_obsidian4.Setting(containerEl).setName("API Key").setDesc(`API Key for ${this.plugin.settings.llmProvider}`).addText((text2) => text2.setPlaceholder("Enter your API key").setValue(this.plugin.settings.apiKey).onChange(async (value) => {
        this.plugin.settings.apiKey = value;
        await this.plugin.saveSettings();
      }));
    }
  }
};
