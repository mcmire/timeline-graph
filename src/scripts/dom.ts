const NAMESPACE_URIS_BY_NAME = {
  svg: "http://www.w3.org/2000/svg"
};

function applyOptionsTo(element, { data = {}, children = [], ...props } = {}) {
  for (const [name, value] of Object.entries(props)) {
    if (name === "textContent") {
      element[name] = value;
    } else {
      element.setAttribute(name, value);
    }
  }

  for (const [key, value] of Object.entries(data)) {
    element.dataset[key] = value;
  }

  for (const child of children) {
    element.appendChild(child);
  }
}

function element(name, options = {}) {
  const element = document.createElement(name);
  applyOptionsTo(element, options);
  return element;
}

function elementWithNS(namespaceType, name, options = {}) {
  const namespaceUri = NAMESPACE_URIS_BY_NAME[namespaceType];

  if (namespaceUri == null) {
    throw new Error(`${namespaceType} is not a valid namespace`);
  }

  const element = document.createElementNS(namespaceUri, name);
  applyOptionsTo(element, options);
  return element;
}

function text(text) {
  return document.createTextNode(text);
}

export default { element, elementWithNS, text };
