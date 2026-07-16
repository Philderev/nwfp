(function () {
  "use strict";
  const pattern = /\{\{\s*([^}]+?)\s*\}\}/g;
  const get = (context, path) => path && path.split(".").reduce((value, key) => value == null ? undefined : value[key], context);
  function interpolate(value, context) {
    const exact = value.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
    if (exact) return get(context, exact[1]);
    return value.replace(pattern, (_, path) => { const result = get(context, path); return result == null ? "" : String(result); });
  }
  function process(node, context) {
    if (node.nodeType === Node.TEXT_NODE) { node.textContent = interpolate(node.textContent, context); return; }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.localName === "sc-for") {
      const match = node.getAttribute("list").match(/\{\{\s*([^}]+?)\s*\}\}/);
      const list = get(context, match && match[1]) || [], alias = node.getAttribute("as"), fragment = document.createDocumentFragment();
      list.forEach((item) => Array.from(node.childNodes).forEach((child) => {
        const clone = child.cloneNode(true); process(clone, Object.assign({}, context, { [alias]: item })); fragment.appendChild(clone);
      }));
      node.replaceWith(fragment); return;
    }
    if (node.localName === "sc-if") {
      const value = interpolate(node.getAttribute("value"), context);
      if (!value || value === "false") { node.remove(); return; }
      const fragment = document.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => { const clone = child.cloneNode(true); process(clone, context); fragment.appendChild(clone); });
      node.replaceWith(fragment); return;
    }
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase(), value = interpolate(attribute.value, context);
      if (name === "onclick" || name === "onchange") {
        node.removeAttribute(attribute.name); if (typeof value === "function") node.addEventListener(name.slice(2), value);
      } else if (name === "disabled") {
        if (value === true || value === "true") node.setAttribute("disabled", ""); else node.removeAttribute("disabled");
      } else if (value != null) node.setAttribute(attribute.name, String(value));
    });
    const hover = node.getAttribute("style-hover");
    if (hover) {
      const normal = node.style.cssText;
      node.addEventListener("mouseenter", () => { node.style.cssText = normal + ";" + hover; });
      node.addEventListener("mouseleave", () => { node.style.cssText = normal; });
    }
    Array.from(node.childNodes).forEach((child) => process(child, context));
  }
  class DCLogic {
    constructor() { this.state = Object.assign({}, this.state || {}); }
    setState(update) { this.state = Object.assign({}, this.state, update); this.__render(); }
  }
  window.DCLogic = DCLogic;
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector("x-dc"); if (!root) return;
    const helmet = root.querySelector("helmet");
    if (helmet) { Array.from(helmet.childNodes).forEach((node) => document.head.appendChild(node)); helmet.remove(); }
    const template = root.innerHTML, logic = document.querySelector("script[data-dc-script]");
    const ComponentClass = logic ? new Function("DCLogic", logic.textContent + "\nreturn Component;")(DCLogic) : DCLogic;
    const component = new ComponentClass();
    component.__render = () => {
      root.innerHTML = template;
      const context = Object.assign({}, component, component.renderVals ? component.renderVals() : {});
      Array.from(root.childNodes).forEach((node) => process(node, context));
    };
    component.__render(); if (component.componentDidMount) component.componentDidMount();
  });
}());
