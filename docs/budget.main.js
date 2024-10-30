// ../../maya-ui/core/node_modules/@cyftec/immutjs/src/misc.ts
var sortObjectByKeys = (obj) => {
  const sortedEntries = Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]));
  sortedEntries.forEach(([key, value], index) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      sortedEntries[index] = [key, sortObjectByKeys(value)];
    }
  });
  return Object.fromEntries(sortedEntries);
};
var isPlainObject = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    return false;
  return Object.prototype.toString.call(value) === "[object Object]";
};
var immut = (value) => {
  if (Array.isArray(value)) {
    const copiedArr = [...value];
    const newArr = [];
    copiedArr.forEach((item) => {
      newArr.push(immut(item));
    });
    return newArr;
  }
  if (isPlainObject(value)) {
    const copiedObj = { ...value };
    const newObj = {};
    Object.keys(copiedObj).forEach((key) => {
      newObj[key] = immut(copiedObj[key]);
    });
    return Object.freeze(newObj);
  }
  return value;
};
var newVal = (oldVal) => {
  if (Array.isArray(oldVal)) {
    const copiedArr = [...oldVal];
    const newArr = [];
    copiedArr.forEach((item) => {
      newArr.push(newVal(item));
    });
    return newArr;
  }
  if (isPlainObject(oldVal)) {
    const copiedObj = { ...oldVal };
    const newObj = {};
    Object.keys(copiedObj).forEach((key) => {
      newObj[key] = newVal(copiedObj[key]);
    });
    return newObj;
  }
  const value = oldVal;
  return value;
};
var indexedArray = (list, uniqueKey = "index") => list.map((item, i) => ({
  [uniqueKey]: i,
  value: item
}));

// ../../maya-ui/core/node_modules/@cyftec/immutjs/src/equal.ts
var areObjectsEqual = (obj1, obj2) => {
  const sortedObj1 = sortObjectByKeys(obj1);
  const sortedObj2 = sortObjectByKeys(obj2);
  const keys1 = Object.keys(sortedObj1);
  const keys2 = Object.keys(sortedObj2);
  if (keys1.length !== keys2.length)
    return false;
  for (const key of keys1) {
    if (!keys2.includes(key) || !areValuesEqual(sortedObj1[key], sortedObj2[key])) {
      return false;
    }
  }
  return true;
};
var areArraysEqual = (array1, array2) => {
  if (array1.length !== array2.length)
    return false;
  if (array1.length === 0)
    return true;
  for (let i = 0;i < array1.length; i++) {
    if (!areValuesEqual(array1[i], array2[i]))
      return false;
  }
  return true;
};
var areValuesEqual = (value1, value2) => {
  if (typeof value1 !== typeof value2)
    return false;
  if (Array.isArray(value1)) {
    return areArraysEqual(value1, value2);
  }
  if (value1 === null || value2 === null) {
    return value1 === value2;
  }
  if (typeof value1 === "object" && !(value1 instanceof Set)) {
    return areObjectsEqual(value1, value2);
  }
  if (typeof value1 === "bigint" || typeof value1 === "number" || typeof value1 === "string" || typeof value1 === "boolean") {
    return value1 === value2;
  }
  return value1 === value2;
};

// ../../maya-ui/core/node_modules/@cyftec/immutjs/src/diff.ts
var getArrayMutations = (oldDsitinctItemsArray, newDsitinctItemsArray, idKey) => {
  const indexKey = "index";
  const oldIndexedArr = indexedArray(newVal(oldDsitinctItemsArray), indexKey);
  const newIndexedArr = indexedArray(newVal(newDsitinctItemsArray), indexKey);
  return newIndexedArr.map((newIndexedItem) => {
    let type = "add";
    let oldIndex = -1;
    const value = newIndexedItem.value;
    oldIndexedArr.some((oldIndexedItem, i) => {
      type = areValuesEqual(oldIndexedItem.value, newIndexedItem.value) ? oldIndexedItem[indexKey] === newIndexedItem[indexKey] ? "idle" : "shuffle" : idKey && oldIndexedItem.value[idKey] !== undefined && oldIndexedItem.value[idKey] === newIndexedItem.value[idKey] ? "update" : "add";
      if (type !== "add") {
        oldIndex = oldIndexedItem[indexKey];
        oldIndexedArr.splice(i, 1);
        return true;
      }
      return false;
    });
    return {
      type,
      oldIndex,
      value
    };
  });
};
// ../../maya-ui/core/node_modules/@cyftec/signal/src/core.ts
var subscriber = null;
var signal = (value) => {
  let _value = immut(value);
  const subscriptions = new Set;
  return {
    type: "signal",
    get value() {
      if (subscriber)
        subscriptions.add(subscriber);
      return newVal(_value);
    },
    set value(newValue) {
      if (newValue === _value)
        return;
      _value = immut(newValue);
      subscriptions.forEach((callback) => callback && callback());
    }
  };
};
var effect = (fn) => {
  subscriber = fn;
  fn();
  subscriber = null;
};
var derived = (signalValueGetter) => {
  let oldValue = null;
  const derivedSignal = signal(oldValue);
  effect(() => {
    oldValue = signalValueGetter(oldValue);
    derivedSignal.value = oldValue;
  });
  return derivedSignal;
};
var valueIsSignal = (value) => !!(value?.type === "signal");
// ../../maya-ui/core/node_modules/@cyftec/signal/src/utils/transforms.ts
var drstr = (strings, ...signalExpressions) => derived(() => {
  return strings.reduce((acc, fragment, i) => {
    let expValue;
    const expression = signalExpressions[i];
    if (expression === undefined) {
      expValue = "";
    } else if (typeof expression === "function") {
      expValue = expression();
    } else if (valueIsSignal(expression)) {
      expValue = expression.value || "";
    } else {
      expValue = null;
    }
    if (expValue === null)
      throw new Error("Expected a signal or a function expression which contains signal values and returns a string");
    return `${acc}${fragment}${expValue}`;
  }, "");
});
// ../../maya-ui/core/src/utils/constants.ts
var customEventKeys = ["onunmount"];
var htmlEventKeys = [
  "onafterprint",
  "onbeforeprint",
  "onbeforeunload",
  "onerror",
  "onhashchange",
  "onload",
  "onmessage",
  "onoffline",
  "onpagehide",
  "onpageshow",
  "onpopstate",
  "onredo",
  "onresize",
  "onstorage",
  "onundo",
  "onunload",
  "onblur",
  "onchange",
  "oncontextmenu",
  "onfocus",
  "onformchange",
  "onforminput",
  "oninput",
  "oninvalid",
  "onreset",
  "onselect",
  "onsubmit",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onclick",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "onmousedown",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onmousewheel",
  "onscroll",
  "onabort",
  "oncanplay",
  "oncanplaythrough",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onpause",
  "onplay",
  "onplaying",
  "onprogress",
  "onratechange",
  "onreadystatechange",
  "onseeked",
  "onseeking",
  "onstalled",
  "onsuspend",
  "ontimeupdate",
  "onvolumechange",
  "onwaiting"
];
var eventKeys = [...htmlEventKeys, ...customEventKeys];
var htmlTagNames = [
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "meta",
  "meter",
  "nav",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
];
// ../../maya-ui/core/src/utils/helpers.ts
var valueIsArray = (value) => Array.isArray(value);
var valueIsHtmlNode = (value) => !isNaN(value?.nodeId) && value?.nodeId > 0;
var valueIsNode = (value) => typeof value?.nodeId === "number" && isFinite(value?.nodeId);
var valueIsSignalNode = (value) => valueIsSignal(value) && !isNaN(value.value?.nodeId);
var valueIsChildrenSignal = (value) => {
  if (valueIsSignal(value)) {
    const children = value.value;
    if (valueIsNode(children))
      return true;
    if (valueIsArray(children) && children.every((child) => valueIsNode(child))) {
      return true;
    }
  }
  return false;
};
var valueIsChildren = (value) => {
  if (valueIsNode(value) || valueIsSignalNode(value))
    return true;
  if (valueIsArray(value) && value.every((item) => valueIsNode(item) || valueIsSignalNode(item)))
    return true;
  return false;
};
var valueIsChildrenProp = (value) => {
  if (valueIsChildrenSignal(value))
    return true;
  if (valueIsChildren(value))
    return true;
  return false;
};
// ../../maya-ui/core/src/utils/id-generator.ts
var idGenerator = () => {
  let nodeId = 0;
  return {
    getNewId: () => ++nodeId,
    resetIdCounter: () => nodeId = 0
  };
};
var idGen = idGenerator();
// ../../maya-ui/core/src/dom/core.ts
var attributeIsChildren = (propKey, propValue, tagName) => {
  if (propKey === "children") {
    if (valueIsChildrenProp(propValue))
      return true;
    throw new Error(`Invalid children prop for node with tagName: ${tagName}\n\n ${JSON.stringify(propValue)}`);
  }
  return false;
};
var attributeIsEvent = (propKey, propValue, tagName) => {
  if (eventKeys.includes(propKey)) {
    if (typeof propValue === "function")
      return true;
    throw new Error(`Invalid event for node with tagName: ${tagName}`);
  }
  return false;
};
var attributeIsHtmlEvent = (propKey, propValue, tagName) => htmlEventKeys.includes(propKey) && attributeIsEvent(propKey, propValue, tagName);
var attributeIsCustomEvent = (propKey, propValue, tagName) => customEventKeys.includes(propKey) && attributeIsEvent(propKey, propValue, tagName);
var handleEventProps = (htmlNode, events) => {
  Object.entries(events).forEach(([eventName, listenerFn]) => {
    if (attributeIsHtmlEvent(eventName, listenerFn, htmlNode.tagName)) {
      const eventKey = eventName.slice(2);
      htmlNode.addEventListener(eventKey, (e) => {
        if (eventKey === "keypress") {
          e.preventDefault();
        }
        listenerFn(e);
      });
    } else if (attributeIsCustomEvent(eventName, listenerFn, htmlNode.tagName) && eventName === "onunmount") {
      htmlNode.unmountListener = listenerFn;
    } else {
      console.error(`Invalid event key: ${eventName} for node with tagName: ${htmlNode.tagName}`);
    }
  });
};
var handleAttributeProps = (htmlNode, attributes) => {
  const attribSignals = {};
  const getAttrValueString = (attrValue) => valueIsSignal(attrValue) ? attrValue.value : attrValue;
  const setAttribute = (htmlNode2, attrKey, attrValue) => {
    if (attrKey === "value") {
      htmlNode2.value = getAttrValueString(attrValue);
    } else if (attrKey === "classname") {
      htmlNode2.setAttribute("class", getAttrValueString(attrValue));
    } else {
      htmlNode2.setAttribute(attrKey, getAttrValueString(attrValue));
    }
  };
  Object.entries(attributes).forEach((attrib) => {
    const [attrKey, attrVal] = attrib;
    const maybeSignalAttrVal = attrVal;
    if (valueIsSignal(maybeSignalAttrVal)) {
      attribSignals[attrKey] = maybeSignalAttrVal;
      return;
    }
    setAttribute(htmlNode, attrKey, maybeSignalAttrVal);
  });
  const attrSignalsEffect = () => {
    Object.entries(attribSignals).forEach(([attrKey, attrValue]) => {
      setAttribute(htmlNode, attrKey, attrValue);
    });
  };
  effect(attrSignalsEffect);
};
var getDomNode = (node) => valueIsNode(node) ? node : valueIsSignalNode(node) ? node.value : node;
var handleChildrenProps = (parentNode, children) => {
  if (!children)
    return;
  if (valueIsChildrenSignal(children)) {
    effect(() => {
      const childrenSignal = children;
      const childrenSignalValue = childrenSignal.value;
      const childNodes = valueIsArray(childrenSignalValue) ? childrenSignalValue : [childrenSignalValue];
      childNodes.forEach((node, index) => {
        const prevChildNode = parentNode.childNodes[index];
        const newChildNode = node;
        if (prevChildNode && newChildNode) {
          parentNode.replaceChild(newChildNode, prevChildNode);
        } else if (newChildNode) {
          parentNode.appendChild(newChildNode);
        } else {
          console.error(`No child found for node with tagName: ${parentNode.tagName}`);
        }
      });
      for (let i = childNodes.length;i < parentNode.childNodes.length; i++) {
        const childNode = parentNode.childNodes[i];
        if (childNode)
          parentNode.removeChild(childNode);
      }
    });
  }
  if (valueIsChildren(children)) {
    const childNodes = children;
    const fixedSignalNodes = [];
    const sanitisedChildren = valueIsArray(childNodes) ? childNodes : [childNodes];
    sanitisedChildren.forEach((maybeSignalChild, index) => {
      if (valueIsSignalNode(maybeSignalChild)) {
        fixedSignalNodes.push({
          index,
          signalNode: maybeSignalChild
        });
        return;
      }
      if (window.isDomAccessPhase)
        return;
      const childNode = getDomNode(maybeSignalChild);
      parentNode.appendChild(childNode);
    });
    if (fixedSignalNodes.length) {
      fixedSignalNodes.forEach(({ index, signalNode }) => {
        const updateSignalledNodes = () => {
          const newChildNode = signalNode.value;
          if (!newChildNode)
            return;
          const prevChildNode = parentNode.childNodes[index];
          if (prevChildNode && newChildNode) {
            parentNode.replaceChild(newChildNode, prevChildNode);
          } else if (newChildNode) {
            parentNode.appendChild(newChildNode);
          } else {
            console.error(`No child found for node with tagName: ${parentNode.tagName}`);
          }
        };
        effect(updateSignalledNodes);
      });
    }
  }
};
var getNodesEventsAndAttributes = (props, tagName) => {
  let children = undefined;
  const events = {};
  const attributes = {};
  Object.entries(props).forEach(([propKey, propValue]) => {
    if (attributeIsChildren(propKey, propValue, tagName)) {
      children = propValue;
    } else if (attributeIsEvent(propKey, propValue, tagName)) {
      events[propKey] = propValue;
    } else {
      attributes[propKey] = propValue;
    }
  });
  return { children, events, attributes };
};
var createHtmlNode = (tagName, props) => {
  const nodeId = idGen.getNewId();
  const htmlNode = window.isDomAccessPhase ? document.querySelector(`[data-node-id="${nodeId}"]`) : document.createElement(tagName);
  htmlNode.nodeId = nodeId;
  htmlNode.unmountListener = undefined;
  props["data-node-id"] = htmlNode.nodeId.toString();
  const { children, events, attributes } = getNodesEventsAndAttributes(props, htmlNode.tagName);
  handleEventProps(htmlNode, events);
  handleAttributeProps(htmlNode, attributes);
  handleChildrenProps(htmlNode, children);
  return htmlNode;
};
// ../../maya-ui/core/src/dom/mutations.ts
var mountRecord = {};
var unmountRecord = {};
var mountUnmountObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((n) => {
        if (valueIsHtmlNode(n)) {
          const node = n;
          const nodeId = node.nodeId;
          if (unmountRecord[nodeId])
            delete unmountRecord[nodeId];
          else
            mountRecord[nodeId] = node.tagName;
        }
      });
      mutation.removedNodes.forEach((n) => {
        if (valueIsHtmlNode(n)) {
          const node = n;
          const nodeId = node.nodeId;
          const unmountListener = node.unmountListener;
          if (unmountListener)
            unmountRecord[nodeId] = {
              node,
              unmountListener
            };
        }
      });
    }
  });
  Object.entries(unmountRecord).forEach(([_, listenerData]) => {
    const { node, unmountListener } = listenerData;
    execSubtreeUnmountListeners(node, unmountListener);
  });
});
var execSubtreeUnmountListeners = (node, elUnmountListener) => {
  if (!valueIsHtmlNode(node))
    return;
  const elChildren = node.children;
  for (var i = 0;i < elChildren.length; i++) {
    var elChild = elChildren[i];
    execSubtreeUnmountListeners(elChild, elChild.unmountListener);
  }
  elUnmountListener && elUnmountListener();
  if (unmountRecord[node.nodeId])
    delete unmountRecord[node.nodeId];
};
// ../../maya-ui/core/src/building-blocks/nodes/custom-nodes/for.ts
var getSignalledObject = (item, i, map) => {
  const indexSignal = signal(i);
  const itemSignal = signal(item);
  return {
    indexSignal,
    itemSignal,
    mappedNode: map(itemSignal, indexSignal)
  };
};
var customeNodeFor = ({
  items,
  itemIdKey,
  map,
  mutableMap
}) => {
  const list = valueIsSignal(items) ? items : signal(items);
  if (map) {
    if (itemIdKey || mutableMap)
      throw new Error("if 'map' is provided, 'itemIdKey' and 'mutableMap' is uncessary.");
    return derived(() => list.value.map(map));
  }
  const itemsValue = list.value;
  if (!mutableMap)
    throw new Error("mutableMap is missing");
  if (itemsValue.length && typeof itemsValue[0] !== "object")
    throw new Error("for mutable map, item in the list must be an object");
  let oldList = null;
  const newList = derived((oldVal) => {
    oldList = oldVal || oldList;
    return list.value;
  });
  const signalledItemsMap = derived((oldMap) => {
    if (oldMap === null || !oldList) {
      const initialItems = newList.value;
      return initialItems.map((item, i) => getSignalledObject(item, i, mutableMap));
    }
    const muts = getArrayMutations(oldList, newList.value, itemIdKey);
    return muts.map((mut, i) => {
      const oldObject = oldMap[mut.oldIndex];
      console.assert(mut.type === "add" && mut.oldIndex === -1 && !oldObject || mut.oldIndex > -1 && !!oldObject, "In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer.");
      if (oldObject) {
        if (mut.type === "shuffle") {
          oldObject.indexSignal.value = i;
        }
        if (mut.type === "update") {
          oldObject.indexSignal.value = i;
          oldObject.itemSignal.value = mut.value;
        }
        return oldObject;
      }
      return getSignalledObject(mut.value, i, mutableMap);
    });
  });
  const nodesSignal = derived(() => {
    return signalledItemsMap.value.map((ob) => ob.mappedNode);
  });
  return nodesSignal;
};
// ../../maya-ui/core/src/building-blocks/nodes/custom-nodes/if.ts
var customeNodeIf = ({ condition, then, otherwise }) => {
  const dn = "display: none;";
  const dib = "display: inline-block;";
  const isSignal = valueIsSignal(condition);
  const isTruthy = derived(() => isSignal ? condition.value : condition);
  const thenStyle = derived(() => isTruthy.value ? dib : dn);
  const owStyle = derived(() => isTruthy.value ? dn : dib);
  return [
    m.Div({
      style: thenStyle,
      children: then
    }),
    m.Div({
      style: owStyle,
      children: otherwise
    })
  ];
};
// ../../maya-ui/core/src/building-blocks/nodes/custom-nodes/switch.ts
var customeNodeSwitch = ({
  subject,
  defaultCase,
  cases
}) => {
  const dn = "display: none;";
  const dib = "display: inline-block;";
  const isSignal = valueIsSignal(subject);
  const switchCase = derived(() => (isSignal ? subject.value : subject).toString());
  const caseEntries = Object.entries(cases);
  const caseKeys = caseEntries.map(([key, _]) => key);
  const isDefaultCase = derived(() => defaultCase && !caseKeys.includes(switchCase.value));
  const defaultCaseStyle = derived(() => isDefaultCase.value ? dib : dn);
  const matchStyle = (match) => derived(() => switchCase.value === match ? dib : dn);
  return [
    ...m.If({
      condition: isDefaultCase,
      then: m.Span({
        style: defaultCaseStyle,
        children: defaultCase
      }),
      otherwise: m.Span({ class: dn })
    }),
    ...caseEntries.map(([match, node]) => {
      return m.Div({
        style: matchStyle(match),
        children: node
      });
    })
  ];
};
// ../../maya-ui/core/src/building-blocks/nodes/custom-nodes/text.ts
var customeNodeText = (text, ...exprs) => {
  const getTextNode = (textValue) => {
    const textNode = document.createTextNode(textValue);
    textNode.nodeId = 0;
    textNode.unmountListener = undefined;
    return textNode;
  };
  if (valueIsSignal(text)) {
    return derived(() => getTextNode(text.value));
  } else if (Array.isArray(text) && exprs.length) {
    return customeNodeText(drstr(text, ...exprs));
  } else {
    return getTextNode(text);
  }
};
// ../../maya-ui/core/src/building-blocks/nodes/html-nodes.ts
function Component(comp) {
  return function(props) {
    const allProps = Object.entries(props).reduce((map, [key, value]) => {
      map[key] = valueIsSignal(value) || typeof value === "function" ? value : derived(() => value);
      return map;
    }, {});
    return comp(allProps);
  };
}
var htmlNodesMap = htmlTagNames.reduce((map, htmlTagName) => {
  const nodeTagName = htmlTagName.split("").map((char, index) => !index ? char.toUpperCase() : char).join("");
  map[nodeTagName] = (props) => createHtmlNode(htmlTagName, props);
  return map;
}, {});
var m = {
  ...htmlNodesMap,
  Text: customeNodeText,
  For: customeNodeFor,
  If: customeNodeIf,
  Switch: customeNodeSwitch
};
// ../../maya-ui/core/src/building-blocks/components.ts
var defaultMetaTags = () => [
  m.Meta({ charset: "UTF-8" }),
  m.Meta({
    "http-equiv": "X-UA-Compatible",
    content: "IE=edge"
  }),
  m.Meta({
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  })
];
// ../dev/@components/button.ts
var Button = Component(({ className, onTap, label }) => m.Button({
  class: derived(() => `pv2 ph3 br-pill ba bw1 b--light-silver b--hover-black pointer bg-white black ${className}`),
  onclick: onTap,
  children: m.Text(label.value)
}));
// ../dev/@components/content.ts
var Content = ({ children, classNames }) => m.Div({
  class: drstr`confined pv3 ${classNames}`,
  style: "min-height: 40rem;",
  children
});
// ../dev/@components/header.ts
var Header = Component(({ title }) => m.Div({
  class: "sticky left-0 top-0 right-0 pa3 bg-white",
  children: [
    m.Div({
      class: "confined ma0 f3 b",
      children: m.Text(title)
    })
  ]
}));
// ../dev/@components/navbar.ts
var NavbarLink = Component(({ className, icon, label, href, isSelected }) => m.A({
  href,
  class: drstr`no-underline f7 pa3 mnw4 pointer ${() => isSelected.value ? "bg-white mb1 black" : "silver"} ${className}`,
  children: m.Div({
    class: "flex flex-column items-center",
    children: [
      m.Span({
        class: "material-symbols-rounded",
        style: "font-size: 28px",
        children: m.Text(icon.value)
      }),
      m.Div({
        class: "f7 pt1",
        children: m.Text(label.value)
      })
    ]
  })
}));
var Navbar = Component(({ rightLink, links, selectedLinkIndex }) => {
  console.log(selectedLinkIndex.value);
  return m.Div({
    class: "sticky left-0 right-0 bottom-0 bg-light-gray",
    children: [
      m.Div({
        class: "confined flex justify-between",
        children: [
          m.Div({
            class: "flex items-center",
            children: m.For({
              items: links,
              map: (link) => NavbarLink({
                icon: link.icon,
                label: link.label,
                href: link.href,
                isSelected: selectedLinkIndex.value === link.index
              })
            })
          }),
          NavbarLink({
            icon: rightLink.value.icon,
            label: rightLink.value.label,
            href: rightLink.value.href,
            isSelected: selectedLinkIndex.value === rightLink.value.index
          })
        ]
      })
    ]
  });
});
// ../dev/@components/page.ts
var Page = ({
  title,
  headerTitle,
  scriptSrcPrefix,
  selectedTabIndex = -1,
  content
}) => {
  const childrenContent = valueIsArray(content) ? content : [content];
  return m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          ...defaultMetaTags(),
          m.Title({ children: m.Text(title) }),
          m.Link({
            rel: "stylesheet",
            href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css"
          }),
          m.Link({
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
          }),
          m.Link({ rel: "stylesheet", href: "/assets/styles.css" })
        ]
      }),
      m.Body({
        class: "mid-gray",
        children: [
          m.Script({
            src: (scriptSrcPrefix ? `${scriptSrcPrefix}` : "") + "main.js",
            defer: "true"
          }),
          m.Div({
            children: [
              Header({ title: headerTitle }),
              Content({
                children: childrenContent
              }),
              Navbar({
                selectedLinkIndex: selectedTabIndex,
                links: [
                  {
                    index: 0,
                    icon: "sort",
                    label: "Expenses",
                    href: "/expenses"
                  },
                  {
                    index: 1,
                    icon: "insert_chart",
                    label: "Charts & trends",
                    href: "/charts.html"
                  },
                  {
                    index: 2,
                    icon: "savings",
                    label: "Budget & earnings",
                    href: "/budget.html"
                  },
                  {
                    index: 3,
                    icon: "sell",
                    label: "Tags & categories",
                    href: "/tags.html"
                  },
                  {
                    index: 4,
                    icon: "payments",
                    label: "Payment methods",
                    href: "/payment-methods.html"
                  }
                ],
                rightLink: {
                  index: 5,
                  icon: "settings",
                  label: "Settings",
                  href: "/settings.html"
                }
              })
            ]
          })
        ]
      })
    ]
  });
};
// ../dev/budget.main.ts
var budget_main_default = () => Page({
  title: "Batua | Budget & Earnings",
  headerTitle: "Create budget based on earnings",
  scriptSrcPrefix: "budget.",
  selectedTabIndex: 2,
  content: m.Span({
    children: m.Text(`Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
[33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem reru[d]um facilis est e[r]t expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellend[a]us. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
[33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem reru[d]um facilis est e[r]t expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellend[a]us. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
[33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem reru[d]um facilis est e[r]t expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellend[a]us. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
[33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem reru[d]um facilis est e[r]t expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellend[a]us. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
[33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem reru[d]um facilis est e[r]t expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellend[a]us. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
[33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem reru[d]um facilis est e[r]t expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellend[a]us. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
[33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem reru[d]um facilis est e[r]t expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellend[a]us. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. `)
  })
});


var runScript = () => {
  mountUnmountObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  setTimeout(() => {
    if (window)
      window.isDomAccessPhase = true;
    idGen.resetIdCounter();
    budget_main_default();
    idGen.resetIdCounter();
    if (window)
      window.isDomAccessPhase = false;
  });
};
runScript();