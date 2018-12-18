const NAMESPACE_URIS_BY_NAME = {
  svg: "http://www.w3.org/2000/svg",
};

function applyOptionsTo(elem, { data = {}, children = [], ...props } = {}) {
  for (const [name, value] of Object.entries(props)) {
    if (name === "textContent") {
      elem[name] = value;
    } else {
      elem.setAttribute(name, value);
    }
  }

  for (const [key, value] of Object.entries(data)) {
    elem.dataset[key] = value;
  }

  for (const child of children) {
    elem.appendChild(child);
  }
}

function element(name, options = {}) {
  const el = document.createElement(name);
  applyOptionsTo(el, options);
  return el;
}

function elementWithNS(namespaceType, name, options = {}) {
  const namespaceUri = NAMESPACE_URIS_BY_NAME[namespaceType];

  if (namespaceUri == null) {
    throw new Error(`${namespaceType} is not a valid namespace`);
  }

  const elem = document.createElementNS(namespaceUri, name);
  applyOptionsTo(elem, options);
  return elem;
}

function text(content) {
  return document.createTextNode(content);
}

export default { element, elementWithNS, text };
