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
var source = (value) => {
  let _value = immut(value);
  const subscriptions = new Set;
  return {
    type: "source-signal",
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
  let oldValue;
  const derivedSource = source(oldValue);
  effect(() => {
    oldValue = signalValueGetter(oldValue);
    derivedSource.value = oldValue;
  });
  const derivedSignal = {
    type: "derived-signal",
    get prevValue() {
      return oldValue;
    },
    get value() {
      return derivedSource.value;
    }
  };
  return derivedSignal;
};
var valueIsSignal = (value) => ["source-signal", "derived-signal"].includes(value?.type);
// ../../maya-ui/core/node_modules/@cyftec/signal/src/utils/transforms.ts
var val = (value) => valueIsSignal(value) ? value.value : value;
var dstr = (strings, ...tlExpressions) => derived(() => {
  return strings.reduce((acc, fragment, i) => {
    let expValue;
    const expression = tlExpressions[i];
    if (typeof expression === "function") {
      expValue = expression() ?? "";
    } else if (valueIsSignal(expression)) {
      expValue = expression.value ?? "";
    } else {
      expValue = expression ?? "";
    }
    return `${acc}${fragment}${expValue.toString()}`;
  }, "");
});
// ../../maya-ui/core/core/utils/constants.ts
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
// ../../maya-ui/core/core/utils/helpers.ts
var valueIsArray = (value) => Array.isArray(value);
var valueIsHtmlNode = (value) => !isNaN(value?.nodeId) && value?.nodeId > 0;
var valueIsChild = (value) => valueIsHtmlNode(value) || typeof value === "string";
var valueIsSignalChild = (value) => valueIsSignal(value) && valueIsChild(value.value);
var valueIsMaybeSignalChild = (value) => valueIsChild(value) || valueIsSignalChild(value);
var valueIsChildrenSignal = (value) => valueIsSignal(value) && (valueIsChild(value.value) || valueIsArray(value.value) && value.value.every((child) => valueIsChild(child)));
var valueIsChildren = (value) => valueIsMaybeSignalChild(value) || valueIsArray(value) && value.every((item) => valueIsMaybeSignalChild(item));
var valueIsChildrenProp = (value) => valueIsChildrenSignal(value) || valueIsChildren(value);
// ../../maya-ui/core/core/utils/id-generator.ts
var idGenerator = () => {
  let nodeId = 0;
  return {
    getNewId: () => ++nodeId,
    resetIdCounter: () => nodeId = 0
  };
};
var idGen = idGenerator();
// ../../maya-ui/core/core/dom/core.ts
var attributeIsUndefinedEvent = (propKey, propValue) => eventKeys.includes(propKey) && propValue === undefined;
var attributeIsHtmlEvent = (propKey, propValue) => htmlEventKeys.includes(propKey) && typeof propValue === "function";
var attributeIsCustomEvent = (propKey, propValue) => customEventKeys.includes(propKey) && typeof propValue === "function";
var attributeIsEvent = (propKey, propValue) => attributeIsUndefinedEvent(propKey, propValue) || attributeIsHtmlEvent(propKey, propValue) || attributeIsCustomEvent(propKey, propValue);
var handleEventProps = (htmlNode, events) => {
  Object.entries(events).forEach(([eventName, listenerFn]) => {
    if (attributeIsUndefinedEvent(eventName, listenerFn)) {
    } else if (attributeIsHtmlEvent(eventName, listenerFn)) {
      const eventKey = eventName.slice(2);
      htmlNode.addEventListener(eventKey, (e) => {
        if (eventKey === "keypress") {
          e.preventDefault();
        }
        listenerFn(e);
      });
    } else if (attributeIsCustomEvent(eventName, listenerFn)) {
      if (eventName === "onunmount")
        htmlNode.unmountListener = listenerFn;
    } else {
      console.error(`Invalid event key: ${eventName} for node with tagName: ${htmlNode.tagName}`);
    }
  });
};
var handleAttributeProps = (htmlNode, attributes) => {
  const attribSignals = {};
  const getAttrValue = (attributeValue) => {
    const attrValue = valueIsSignal(attributeValue) ? attributeValue.value : attributeValue;
    return attrValue ?? "";
  };
  const setAttribute = (htmlNode2, attrKey, attributeValue) => {
    const attrValue = getAttrValue(attributeValue);
    if (typeof attrValue === "boolean") {
      if (attrValue)
        htmlNode2.setAttribute(attrKey, "");
      else
        htmlNode2.removeAttribute(attrKey);
    } else if (attrKey === "value") {
      htmlNode2.value = attrValue;
    } else if (attrKey === "classname") {
      htmlNode2.setAttribute("class", attrValue);
    } else {
      htmlNode2.setAttribute(attrKey, attrValue);
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
var getNodeFromChild = (child) => {
  if (valueIsSignalChild(child)) {
    const nonSignalChild = child.value;
    return getNodeFromChild(nonSignalChild);
  }
  if (valueIsHtmlNode(child)) {
    return child;
  }
  if (typeof child !== "string") {
    throw new Error(`Invalid child. Type of child: ${typeof child}`);
  }
  return document.createTextNode(child);
};
var handleChildrenProp = (parentNode, childrenProp) => {
  if (!childrenProp)
    return;
  if (valueIsChildrenSignal(childrenProp)) {
    effect(() => {
      const childrenSignal = childrenProp;
      const childrenSignalValue = childrenSignal.value;
      const children = valueIsArray(childrenSignalValue) ? childrenSignalValue : [childrenSignalValue];
      children.forEach((child, index) => {
        const prevChildNode = parentNode.childNodes[index];
        const newChildNode = getNodeFromChild(child);
        if (prevChildNode && newChildNode) {
          parentNode.replaceChild(newChildNode, prevChildNode);
        } else if (newChildNode) {
          parentNode.appendChild(newChildNode);
        } else {
          console.error(`No child found for node with tagName: ${parentNode.tagName}`);
        }
      });
      const newChildrenCount = children.length;
      while (newChildrenCount < parentNode.childNodes.length) {
        const childNode = parentNode.childNodes[newChildrenCount];
        if (childNode)
          parentNode.removeChild(childNode);
      }
    });
  }
  if (valueIsChildren(childrenProp)) {
    const children = childrenProp;
    const signalledChildren = [];
    const sureArrayChildren = valueIsArray(children) ? children : [children];
    sureArrayChildren.forEach((maybeSignalChild, index) => {
      if (valueIsSignalChild(maybeSignalChild)) {
        signalledChildren.push({
          index,
          childSignal: maybeSignalChild
        });
        if (!window.isDomAccessPhase)
          parentNode.appendChild(getNodeFromChild(maybeSignalChild.value));
        return;
      }
      if (window.isDomAccessPhase)
        return;
      const childNode = getNodeFromChild(maybeSignalChild);
      parentNode.appendChild(childNode);
    });
    if (signalledChildren.length) {
      signalledChildren.forEach(({ index, childSignal }) => {
        const updateSignalledNodes = () => {
          if (!childSignal.value)
            return;
          const newChildNode = getNodeFromChild(childSignal.value);
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
  let childrenProp = undefined;
  const events = {};
  const attributes = {};
  Object.entries(props).forEach(([propKey, propValue]) => {
    if (propKey === "children") {
      if (valueIsChildrenProp(propValue))
        childrenProp = propValue;
      else
        throw new Error(`Invalid children prop for node with tagName: ${tagName}\n\n ${JSON.stringify(propValue)}`);
    } else if (attributeIsEvent(propKey, propValue)) {
      events[propKey] = propValue;
    } else {
      attributes[propKey] = propValue;
    }
  });
  return { childrenProp, events, attributes };
};
var createHtmlNode = (tagName, props) => {
  const nodeId = idGen.getNewId();
  const htmlNode = window.isDomAccessPhase ? document.querySelector(`[data-node-id="${nodeId}"]`) : document.createElement(tagName);
  htmlNode.nodeId = nodeId;
  htmlNode.unmountListener = undefined;
  const htmlNodeProps = valueIsChildrenProp(props) ? { children: props } : props;
  htmlNodeProps["data-node-id"] = htmlNode.nodeId.toString();
  const { childrenProp, events, attributes } = getNodesEventsAndAttributes(htmlNodeProps, htmlNode.tagName);
  handleEventProps(htmlNode, events);
  handleAttributeProps(htmlNode, attributes);
  handleChildrenProp(htmlNode, childrenProp);
  return htmlNode;
};
// ../../maya-ui/core/core/dom/mutations.ts
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
// ../../maya-ui/core/core/building-blocks/nodes/custom-nodes/for.ts
var getSignalledObject = (item, i, map) => {
  const indexSignal = source(i);
  const itemSignal = source(item);
  return {
    indexSignal,
    itemSignal,
    mappedChild: map(itemSignal, indexSignal)
  };
};
var getChildrenAfterInjection = (children, n, nthChild) => {
  if (n !== undefined && nthChild) {
    const injectingIndex = n > children.length ? children.length : n;
    children.splice(injectingIndex, 0, nthChild());
  }
  return children;
};
var customeNodeFor = ({
  items,
  itemIdKey,
  map,
  mutableMap,
  n,
  nthChild
}) => {
  if (nthChild && n === undefined || n !== undefined && !nthChild) {
    throw new Error("Either both 'n' and 'nthChild' be passed or none of them.");
  }
  const list = valueIsSignal(items) ? items : source(items);
  if (map) {
    if (itemIdKey || mutableMap)
      throw new Error("if 'map' is provided, 'itemIdKey' and 'mutableMap' is uncessary.");
    return derived(() => getChildrenAfterInjection(list.value.map(map), n, nthChild));
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
    if (!oldMap || !oldList) {
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
  const nodesSignal = derived(() => getChildrenAfterInjection(signalledItemsMap.value.map((ob) => ob.mappedChild), n, nthChild));
  return nodesSignal;
};
// ../../maya-ui/core/core/building-blocks/nodes/custom-nodes/if.ts
var customeNodeIf = ({ condition, then, otherwise }) => {
  const isTruthy = derived(() => !!(valueIsSignal(condition) ? condition.value : condition));
  return derived(() => isTruthy.value ? then() : otherwise ? otherwise() : m.Span({ style: "display: none;" }));
};
// ../../maya-ui/core/core/building-blocks/nodes/custom-nodes/switch.ts
var customeNodeSwitch = ({
  subject,
  defaultCase,
  cases
}) => {
  const switchCase = derived(() => valueIsSignal(subject) ? subject.value : subject);
  return derived(() => {
    const caseKey = switchCase.value;
    return cases[caseKey] ? cases[caseKey]() : defaultCase ? defaultCase() : m.Span({ style: "display: none;" });
  });
};
// ../../maya-ui/core/core/building-blocks/nodes/html-nodes.ts
var htmlNodesMap = htmlTagNames.reduce((map, htmlTagName) => {
  const nodeTagName = htmlTagName.split("").map((char, index) => !index ? char.toUpperCase() : char).join("");
  map[nodeTagName] = (props) => createHtmlNode(htmlTagName, props);
  return map;
}, {});
var m = {
  ...htmlNodesMap,
  For: customeNodeFor,
  If: customeNodeIf,
  Switch: customeNodeSwitch
};
// ../../maya-ui/core/core/building-blocks/components.ts
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
// ../dev/@libs/common/constants/currencies.ts
var CURRENCIES = {
  AED: {
    name: "United Arab Emirates Dirham",
    symbol: "\u062F.\u0625"
  },
  AFN: {
    name: "Afghan Afghani",
    symbol: "\u060B"
  },
  ALL: {
    name: "Albania Lek",
    symbol: "Lek"
  },
  AMD: {
    name: "Armenian Dram",
    symbol: "\u058F"
  },
  ANG: {
    name: "Netherlands Antilles Guilder",
    symbol: "\u0192"
  },
  ARS: {
    name: "Argentina Peso",
    symbol: "$"
  },
  AUD: {
    name: "Australia Dollar",
    symbol: "AU$"
  },
  AWG: {
    name: "Aruba Guilder",
    symbol: "\u0192"
  },
  AZN: {
    name: "Azerbaijan Manat",
    symbol: "\u20BC"
  },
  BAM: {
    name: "Convertible Mark",
    symbol: "KM"
  },
  BBD: {
    name: "Barbados Dollar",
    symbol: "Bds$"
  },
  BDT: {
    name: "Bangladeshi Taka",
    symbol: "\u09F3"
  },
  BGN: {
    name: "Bulgaria Lev",
    symbol: "\u043B\u0432"
  },
  BHD: {
    name: "Bahraini Dinar",
    symbol: "\u062F.\u0628."
  },
  BIF: {
    name: "Burundian Franc",
    symbol: "FBu"
  },
  BMD: {
    name: "Bermuda Dollar",
    symbol: "BD$"
  },
  BND: {
    name: "Brunei Darussalam Dollar",
    symbol: "B$"
  },
  BOB: {
    name: "Bolivia Bol\xEDviano",
    symbol: "$b"
  },
  BRL: {
    name: "Brazil Real",
    symbol: "R$"
  },
  BSD: {
    name: "Bahamas Dollar",
    symbol: "B$"
  },
  BTN: {
    name: "Bhutanese Ngultrum",
    symbol: "Nu"
  },
  BWP: {
    name: "Botswana Pula",
    symbol: "P"
  },
  BYN: {
    name: "Belarus Ruble",
    symbol: "Br"
  },
  BZD: {
    name: "Belize Dollar",
    symbol: "BZ$"
  },
  CAD: {
    name: "Canadian Dollar",
    symbol: "C$"
  },
  CDF: {
    name: "Congolese Franc",
    symbol: "FC"
  },
  CHF: {
    name: "Swiss Franc",
    symbol: "Fr"
  },
  CLP: {
    name: "Chile Peso",
    symbol: "CLP$"
  },
  CNY: {
    name: "China Yuan Renminbi",
    symbol: "\xA5"
  },
  COP: {
    name: "Colombia Peso",
    symbol: "COL$"
  },
  CRC: {
    name: "Costa Rica Colon",
    symbol: "\u20A1"
  },
  CUP: {
    name: "Cuba Peso",
    symbol: "\u20B1"
  },
  CVE: {
    name: "Cape Verdean escudo",
    symbol: "CVE"
  },
  CYP: {
    name: "Cypriot Pound",
    symbol: "\xA3"
  },
  CZK: {
    name: "Czech Republic Koruna",
    symbol: "K\u010D"
  },
  DJF: {
    name: "Djiboutian Franc",
    symbol: "Fdj"
  },
  DKK: {
    name: "Denmark Krone",
    symbol: "kr"
  },
  DOP: {
    name: "Dominican Republic Peso",
    symbol: "RD$"
  },
  DZD: {
    name: "Algerian Dinar",
    symbol: "\u062F\u062C"
  },
  EEK: {
    name: "Estonian Kroon",
    symbol: "kr"
  },
  EGP: {
    name: "Egypt Pound",
    symbol: "\xA3"
  },
  ERN: {
    name: "Eritrean Nakfa",
    symbol: "Nkf"
  },
  ETB: {
    name: "Ethiopian Birr",
    symbol: "\u1265\u122D"
  },
  EUR: {
    name: "Euro",
    symbol: "\u20AC"
  },
  FIM: {
    name: "Finnish Markka",
    symbol: "MK"
  },
  FJD: {
    name: "Fiji Dollar",
    symbol: "FJ$"
  },
  FKP: {
    name: "Malvinas Pound",
    symbol: "\xA3"
  },
  Fr: {
    name: "Franc",
    symbol: "Fr"
  },
  GBP: {
    name: "United Kingdom Pound",
    symbol: "\xA3"
  },
  GEL: {
    name: "Georgian Lari",
    symbol: "\u10DA"
  },
  GGP: {
    name: "Guernsey Pound",
    symbol: "\xA3"
  },
  GHS: {
    name: "Ghana Cedi",
    symbol: "\xA2"
  },
  GIP: {
    name: "Gibraltar Pound",
    symbol: "\xA3"
  },
  GMD: {
    name: "Gambian Dalasi",
    symbol: "D"
  },
  GNF: {
    name: "Guinean franc",
    symbol: "GFr"
  },
  GTQ: {
    name: "Guatemala Quetzal",
    symbol: "Q"
  },
  GYD: {
    name: "Guyana Dollar",
    symbol: "GY$"
  },
  HKD: {
    name: "Hong Kong Dollar",
    symbol: "HK$"
  },
  HNL: {
    name: "Honduras Lempira",
    symbol: "L"
  },
  HRK: {
    name: "Croatia Kuna",
    symbol: "kn"
  },
  HTG: {
    name: "Haitian Gourde",
    symbol: "G"
  },
  HUF: {
    name: "Hungary Forint",
    symbol: "Ft"
  },
  IDR: {
    name: "Indonesia Rupiah",
    symbol: "Rp"
  },
  IEP: {
    name: "Irish Pound",
    symbol: "IR\xA3"
  },
  ILS: {
    name: "Israel Shekel",
    symbol: "\u20AA"
  },
  IMP: {
    name: "Isle of Man Pound",
    symbol: "\xA3"
  },
  INR: {
    name: "India Rupee",
    symbol: "\u20B9"
  },
  IQD: {
    name: "Iraqi Dinar",
    symbol: "\u0639.\u062F"
  },
  IRR: {
    name: "Iran Rial",
    symbol: "\uFDFC"
  },
  ISK: {
    name: "Iceland Krona",
    symbol: "KR"
  },
  JEP: {
    name: "Jersey Pound",
    symbol: "\xA3"
  },
  JMD: {
    name: "Jamaica Dollar",
    symbol: "J$"
  },
  JOD: {
    name: "Jordanian Dinar",
    symbol: "\u062F.\u0627"
  },
  JPY: {
    name: "Japan Yen",
    symbol: "\xA5"
  },
  KES: {
    name: "Kenyan Shilling",
    symbol: "KSh"
  },
  KGS: {
    name: "Kyrgyzstan Som",
    symbol: "\u043B\u0432"
  },
  KHR: {
    name: "Cambodia Riel",
    symbol: "\u17DB"
  },
  KMF: {
    name: "Comorian Franc",
    symbol: "CF"
  },
  KPW: {
    name: "North Korean Won",
    symbol: "\u20A9"
  },
  KRW: {
    name: "South Korean Won",
    symbol: "\u20A9"
  },
  KWD: {
    name: "Kuwaiti Dinar",
    symbol: "\u062F.\u0643"
  },
  KYD: {
    name: "Cayman Islands Dollar",
    symbol: "CI$"
  },
  KZ: {
    name: "Angolan Kwanza",
    symbol: "Kz"
  },
  KZT: {
    name: "Kazakhstan Tenge",
    symbol: "\u043B\u0432"
  },
  LAK: {
    name: "Laos Kip",
    symbol: "\u20AD"
  },
  LBP: {
    name: "Lebanon Pound",
    symbol: "\xA3"
  },
  LKR: {
    name: "Sri Lanka Rupee",
    symbol: "\u20A8"
  },
  LRD: {
    name: "Liberia Dollar",
    symbol: "L$"
  },
  LTL: {
    name: "Lithuanian Litas",
    symbol: "Lt"
  },
  LUF: {
    name: "Luxembourg Franc",
    symbol: "F"
  },
  LVL: {
    name: "Latvian Lats",
    symbol: "Ls"
  },
  LYD: {
    name: "Libyan Dinar",
    symbol: "\u0644.\u062F"
  },
  MDL: {
    name: "Moldovan Leu",
    symbol: "L"
  },
  MDN: {
    name: "Moroccan Dirham",
    symbol: "\u062F.\u0645."
  },
  MGF: {
    name: "Madagascar Franc",
    symbol: "MF"
  },
  MKD: {
    name: "Macedonian Denar",
    symbol: "\u0434\u0435\u043D"
  },
  MMK: {
    name: "Burmese Kyat",
    symbol: "K"
  },
  MNT: {
    name: "Mongolian T\xF6gr\xF6g",
    symbol: "\u20AE"
  },
  MOP: {
    name: "Macanese Pataca",
    symbol: "MOP$"
  },
  MRU: {
    name: "Mauritanian ouguiya",
    symbol: "UM"
  },
  MTL: {
    name: "Maltese Lira",
    symbol: "Lm"
  },
  MUR: {
    name: "Mauritius Rupee",
    symbol: "\u20A8"
  },
  MVR: {
    name: "Maldivian Rufiyaa",
    symbol: "Rf"
  },
  MWK: {
    name: "Malawian kwacha",
    symbol: "K"
  },
  MXN: {
    name: "Mexico Peso",
    symbol: "Mex$"
  },
  MYR: {
    name: "Malaysia Ringgit",
    symbol: "RM"
  },
  MZN: {
    name: "Mozambique Metical",
    symbol: "MT"
  },
  NAD: {
    name: "Namibia Dollar",
    symbol: "N$"
  },
  NGN: {
    name: "Nigeria Naira",
    symbol: "\u20A6"
  },
  NIO: {
    name: "Nicaragua Cordoba",
    symbol: "C$"
  },
  NOK: {
    name: "Norway Krone",
    symbol: "kr"
  },
  NPR: {
    name: "Nepal Rupee",
    symbol: "\u20A8"
  },
  NZD: {
    name: "New Zealand Dollar",
    symbol: "NZ$"
  },
  OMR: {
    name: "Oman Rial",
    symbol: "\uFDFC"
  },
  PAB: {
    name: "Panama Balboa",
    symbol: "B/."
  },
  PEN: {
    name: "Peru Sol",
    symbol: "S/."
  },
  PGK: {
    name: "Papua New Guinean Kina",
    symbol: "K"
  },
  PHP: {
    name: "Philippines Peso",
    symbol: "\u20B1"
  },
  PKR: {
    name: "Pakistan Rupee",
    symbol: "\u20A8"
  },
  PLN: {
    name: "Poland Zloty",
    symbol: "z\u0142"
  },
  PYG: {
    name: "Paraguay Guarani",
    symbol: "Gs"
  },
  QAR: {
    name: "Qatar Riyal",
    symbol: "\uFDFC"
  },
  RON: {
    name: "Romania Leu",
    symbol: "lei"
  },
  RSD: {
    name: "Serbia Dinar",
    symbol: "\u0414\u0438\u043D."
  },
  RUB: {
    name: "Russia Ruble",
    symbol: "\u20BD"
  },
  RWF: {
    name: "Rwandan Franc",
    symbol: "R\u20A3"
  },
  SAR: {
    name: "Saudi Arabia Riyal",
    symbol: "\uFDFC"
  },
  SBD: {
    name: "Solomon Islands Dollar",
    symbol: "Si$"
  },
  SCR: {
    name: "Seychelles Rupee",
    symbol: "\u20A8"
  },
  SDG: {
    name: "Sudanese Pound",
    symbol: "\u062C.\u0633."
  },
  SEK: {
    name: "Sweden Krona",
    symbol: "kr"
  },
  SGD: {
    name: "Singapore Dollar",
    symbol: "S$"
  },
  SHP: {
    name: "Saint Helena Pound",
    symbol: "\xA3"
  },
  SKK: {
    name: "Slovak Koruna",
    symbol: "Sk"
  },
  SLL: {
    name: "Sierra Leonean leone",
    symbol: "Le"
  },
  SOS: {
    name: "Somalia Shilling",
    symbol: "S"
  },
  SRD: {
    name: "Suriname Dollar",
    symbol: "Sr$"
  },
  SSP: {
    name: "South Sudanese Pound",
    symbol: "SS\xA3"
  },
  STD: {
    name: "S\xE3o Tom\xE9 & Pr\xEDncipe Dobra",
    symbol: "Db"
  },
  SVC: {
    name: "El Salvador Colon",
    symbol: "\u20A1"
  },
  SYP: {
    name: "Syria Pound",
    symbol: "\xA3"
  },
  SZL: {
    name: "Swazi Lilangeni",
    symbol: "L"
  },
  THB: {
    name: "Thailand Baht",
    symbol: "\u0E3F"
  },
  TJS: {
    name: "Tajikistani Somoni",
    symbol: "SM"
  },
  TMT: {
    name: "Turkmenistan Manat",
    symbol: "T"
  },
  TND: {
    name: "Tunisian Dinar",
    symbol: "\u062F.\u062A"
  },
  TRY: {
    name: "Turkey Lira",
    symbol: "\u20BA"
  },
  TTD: {
    name: "Trinidad & Tobago Dollar",
    symbol: "TT$"
  },
  TVD: {
    name: "Tuvalu Dollar",
    symbol: "TV$"
  },
  TWD: {
    name: "Taiwan New Dollar",
    symbol: "NT$"
  },
  TZS: {
    name: "Tanzanian shilling",
    symbol: "TSh"
  },
  UAH: {
    name: "Ukraine Hryvnia",
    symbol: "\u20B4"
  },
  UGX: {
    name: "Ugandan Shilling",
    symbol: "USh"
  },
  USD: {
    name: "United States Dollar",
    symbol: "$"
  },
  UYU: {
    name: "Uruguay Peso",
    symbol: "$U"
  },
  UZS: {
    name: "Uzbekistan Som",
    symbol: "\u043B\u0432"
  },
  VEF: {
    name: "Venezuela Bol\xEDvar",
    symbol: "Bs"
  },
  VND: {
    name: "Vietnam Dong",
    symbol: "\u20AB"
  },
  WST: {
    name: "Samoan T\u0101l\u0101",
    symbol: "WS$"
  },
  XAF: {
    name: "Central African CFA franc",
    symbol: "FCFA"
  },
  XCD: {
    name: "Eastern Caribbean Dollar",
    symbol: "EC$"
  },
  XOF: {
    name: "West African CFA franc",
    symbol: "CFA"
  },
  YER: {
    name: "Yemen Rial",
    symbol: "\uFDFC"
  },
  ZAR: {
    name: "South Africa Rand",
    symbol: "R"
  },
  ZMW: {
    name: "Zambian Kwacha",
    symbol: "K"
  },
  ZWD: {
    name: "Zimbabwe Dollar",
    symbol: "Z$"
  }
};
// ../dev/@libs/common/constants/mock-data.ts
var MOCK = {
  ACCOUNTS: [
    {
      id: "CASH",
      name: "Cash in Wallet",
      balance: 3587,
      currency: "INR"
    },
    {
      id: "ICICI_SAVINGS",
      accountId: "022901511014",
      name: "ICICI Savings Account",
      balance: 118495,
      currency: "INR"
    },
    {
      id: "HDFC_SAVINGS",
      accountId: "3600012345689",
      name: "HDFC Savings Account",
      balance: 835723,
      currency: "INR"
    },
    {
      id: "AXIS_SAVINGS",
      accountId: "549912345689",
      name: "Axis Savings Account",
      balance: 9423,
      currency: "INR"
    },
    {
      id: "AXIS_CREDIT",
      accountId: "549922228888",
      name: "Axis Credit Account",
      balance: 90000,
      currency: "INR"
    },
    {
      id: "SODEXO",
      accountId: "chnkrydv@sodexo.com",
      name: "Sodexo",
      balance: 2200,
      currency: "INR"
    }
  ],
  PAYMENT_METHODS: [
    {
      code: "COINS_NOTES",
      displayName: "Coins & Notes",
      defaultAccountId: "CASH",
      connectedAccountIds: ["CASH"]
    },
    {
      code: "GPAY",
      displayName: "Google Pay",
      uniqueId: "9852430671@okaxis",
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS"]
    },
    {
      code: "PHONEPE",
      displayName: "PhonePe",
      uniqueId: "9852430671@ybl",
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS"]
    },
    {
      code: "PAYTM",
      displayName: "Paytm",
      uniqueId: "9852430671@paytm",
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS", "AXIS_SAVINGS"]
    },
    {
      code: "ICICI_DEBIT",
      displayName: "ICICI Debit Card",
      uniqueId: "4300111122223333",
      expiry: new Date(2028, 10),
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS"]
    },
    {
      code: "AXIS_CREDIT",
      displayName: "AXIS Credit Card",
      uniqueId: "4300111122223333",
      expiry: new Date(2026, 3),
      defaultAccountId: "AXIS_CREDIT",
      connectedAccountIds: ["AXIS_CREDIT"]
    },
    {
      code: "ICICI_NET_BANKING",
      displayName: "ICICI Net Banking",
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS"]
    },
    {
      code: "HDFC_NET_BANKING",
      displayName: "HDFC Net Banking",
      defaultAccountId: "HDFC_SAVINGS",
      connectedAccountIds: ["HDFC_SAVINGS"]
    },
    {
      code: "SODEXO_COUPONS",
      displayName: "Sodexo Coupons",
      uniqueId: "chnkrydv@sodexo.com",
      expiry: new Date(2025, 0, 31),
      defaultAccountId: "SODEXO",
      connectedAccountIds: ["SODEXO"]
    }
  ],
  TAGS: [
    {
      name: "cash",
      type: "PAYMENT_SOURCE",
      isEditable: false
    },
    {
      name: "icicibank",
      type: "PAYMENT_SOURCE",
      isEditable: false
    },
    {
      name: "hdfcbank",
      type: "PAYMENT_SOURCE",
      isEditable: false
    },
    {
      name: "axisbank",
      type: "PAYMENT_SOURCE",
      isEditable: false
    },
    {
      name: "sodexo",
      type: "PAYMENT_SOURCE",
      isEditable: false
    },
    {
      name: "coinsnnotes",
      type: "PAYMENT_METHOD",
      isEditable: false
    },
    {
      name: "gpay",
      type: "PAYMENT_METHOD",
      isEditable: false
    },
    {
      name: "phonepe",
      type: "PAYMENT_METHOD",
      isEditable: false
    },
    {
      name: "paytm",
      type: "PAYMENT_METHOD",
      isEditable: false
    },
    {
      name: "icicidebitcard",
      type: "PAYMENT_METHOD",
      isEditable: false
    },
    {
      name: "axiscreditcard",
      type: "PAYMENT_METHOD",
      isEditable: false
    },
    {
      name: "icicinetbanking",
      type: "PAYMENT_METHOD",
      isEditable: false
    },
    {
      name: "hdfcnetbanking",
      type: "PAYMENT_METHOD",
      isEditable: false
    },
    {
      name: "sodexocoupons",
      type: "PAYMENT_METHOD",
      isEditable: false
    },
    {
      name: "essential",
      type: "NECESSITY",
      isEditable: false
    },
    {
      name: "maybeluxary",
      type: "NECESSITY",
      isEditable: false
    },
    {
      name: "luxary",
      type: "NECESSITY",
      isEditable: false
    },
    {
      name: "uber",
      type: "COMMUTE",
      isEditable: true
    },
    {
      name: "airbnb",
      type: "TRAVEL",
      isEditable: true
    },
    {
      name: "bookingdotcom",
      type: "TRAVEL",
      isEditable: true
    },
    {
      name: "decathlon",
      type: "SHOP_OR_MARKET",
      isEditable: true
    },
    {
      name: "amazon",
      type: "SHOP_OR_MARKET",
      isEditable: true
    },
    {
      name: "ikea",
      type: "SHOP_OR_MARKET",
      isEditable: true
    },
    {
      name: "grocery",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "apparel",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "gadgets",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "furniture",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "grooming",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "gifting",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "jewellery",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "stationery",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "books",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "gardening",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "sportsnfitness",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "treatment",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "vehicle",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "outing",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "softwareapp",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "appliances",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "education",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "petsupplies",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "diningout",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "homenkitchen",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "luggagenbags",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "toysngames",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "accessories",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    },
    {
      name: "moviesnshows",
      type: "PRODUCT_CATEGORY",
      isEditable: true
    }
  ]
};
// ../dev/@libs/config.ts
var deploySubpath = "batua";
var PUBLISHED_SITE_ROOT = `/${deploySubpath}`;

// ../dev/@libs/common/transforms.ts
var path = (href) => window.location.hostname === "127.0.0.1" ? href : `${PUBLISHED_SITE_ROOT}${href}`;
// ../dev/@libs/ui-kit/icon.ts
var Icon = ({
  className,
  size,
  onClick,
  iconName,
  title
}) => m.Span({
  class: dstr`material-symbols-rounded ${() => onClick ? "pointer" : ""} ${className}`,
  style: dstr`font-size: ${() => val(size) || "16"}px`,
  onclick: onClick,
  children: iconName,
  title: val(title) || ""
});
// ../dev/@libs/ui-kit/tag.ts
var Tag = ({
  classNames,
  label,
  iconClassNames,
  iconName,
  iconHint,
  iconSize,
  onIconClick
}) => m.Span({
  class: dstr`bg-near-white br2 flex items-center ${classNames}`,
  children: [
    m.Span(label),
    m.If({
      condition: derived(() => !!val(iconName)),
      then: () => Icon({
        className: dstr`pointer silver ${iconClassNames}`,
        size: derived(() => val(iconSize) || 16),
        onClick: onIconClick,
        iconName,
        title: iconHint
      })
    })
  ]
});
// ../dev/@libs/widgets/add-button-tile.ts
var AddButtonTile = ({
  classNames,
  label,
  onClick
}) => TileCard({
  classNames: dstr`tc pointer ${classNames}`,
  onClick,
  children: [
    Icon({
      className: "mb2",
      size: 42,
      iconName: "add"
    }),
    m.Div({
      class: "light-silver f6",
      children: label
    })
  ]
});
// ../dev/@libs/widgets/header.ts
var Header = ({ title }) => m.Div({
  class: "sticky left-0 top-0 right-0 pv4 f1 fw1 black bg-white",
  children: title
});
// ../dev/@libs/widgets/tile-card.ts
var TileCard = ({
  classNames,
  onClick,
  children
}) => m.Div({
  class: dstr`br4 ph3 pt3 pb0 ${classNames}`,
  onclick: onClick,
  children
});

// ../dev/@libs/widgets/list-tile.ts
var ListTile = ({
  classNames,
  titleIconName,
  title,
  subtitle,
  child
}) => TileCard({
  classNames,
  children: [
    m.Div({
      class: "black b mb1 flex items-center",
      children: [
        m.If({
          condition: derived(() => val(titleIconName)),
          then: () => Icon({
            size: 20,
            className: "b mr2",
            iconName: titleIconName
          })
        }),
        title
      ]
    }),
    m.Div({
      class: "light-silver h1 f6",
      children: subtitle
    }),
    child
  ]
});
// ../dev/@libs/widgets/navbar.ts
var Navbar = ({
  classNames,
  rightLink,
  links,
  selectedLinkIndex
}) => {
  return m.Div({
    class: dstr`bg-almost-white flex flex-column vh-100 sticky left-0 top-0 bottom-0 ${classNames}`,
    children: [
      m.A({
        class: "no-underline green",
        href: path("/"),
        children: m.Div({
          class: "tc f3 ph4 pv3 ma4 bn br3 bg-white",
          children: "batua 1.04"
        })
      }),
      m.Div({
        class: "h-100",
        children: m.For({
          items: links,
          map: (link2, i) => NavbarLink({
            classNames: "ml3 pa3 mv3",
            icon: link2.icon,
            label: link2.label,
            href: link2.href,
            isSelected: val(selectedLinkIndex) === link2.index
          })
        })
      }),
      NavbarLink({
        classNames: "ml3 pa3 mb3",
        icon: val(rightLink).icon,
        label: val(rightLink).label,
        href: val(rightLink).href,
        isSelected: val(selectedLinkIndex) === val(rightLink).index
      })
    ]
  });
};
var NavbarLink = ({
  classNames,
  icon: icon4,
  label,
  href,
  isSelected
}) => m.Div({
  class: dstr`pointer br4 br--left ${() => val(isSelected) ? "bg-white" : ""} ${classNames}`,
  children: m.A({
    class: dstr`no-underline hover-black ${() => val(isSelected) ? "black" : "silver"}`,
    href,
    children: m.Div({
      class: "flex items-center",
      children: [
        Icon({
          size: 22,
          iconName: icon4
        }),
        m.Div({
          class: "f5 pl3",
          children: label
        })
      ]
    })
  })
});
// ../dev/@libs/widgets/page.ts
var Page = ({
  title,
  headerTitle,
  scriptSrcPrefix,
  selectedTabIndex,
  mainContent,
  sideContent
}) => {
  console.log(window.location.host);
  console.log(window.location.hostname);
  console.log(window.location.origin);
  console.log(window.location.href);
  console.log(window.location.pathname);
  return m.Html({
    lang: "en",
    children: [
      m.Head([
        ...defaultMetaTags(),
        m.Title(title),
        m.Link({
          rel: "stylesheet",
          href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css"
        }),
        m.Link({
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
        }),
        m.Link({ rel: "stylesheet", href: path("/assets/styles.css") })
      ]),
      m.Body({
        class: "mid-gray",
        children: [
          m.Script({
            src: (scriptSrcPrefix ? `${scriptSrcPrefix}` : "") + "main.js",
            defer: "true"
          }),
          m.Div({
            class: "flex items-start",
            children: [
              Navbar({
                classNames: "fg1",
                selectedLinkIndex: val(selectedTabIndex) ?? -1,
                links: [
                  {
                    index: 0,
                    icon: "swap_horiz",
                    label: "Transactions",
                    href: path("/transactions")
                  },
                  {
                    index: 1,
                    icon: "bar_chart_4_bars",
                    label: "Charts & Trends",
                    href: path("/charts.html")
                  },
                  {
                    index: 2,
                    icon: "savings",
                    label: "Budget & Investments",
                    href: path("/budget.html")
                  },
                  {
                    index: 3,
                    icon: "sell",
                    label: "Tags & Categories",
                    href: path("/tags")
                  },
                  {
                    index: 4,
                    icon: "account_balance_wallet",
                    label: "Accounts & Payment Methods",
                    href: path("/accounts-and-payments")
                  }
                ],
                rightLink: {
                  index: 5,
                  icon: "settings",
                  label: "Settings",
                  href: path("/settings.html")
                }
              }),
              m.Div({
                class: "relative pl5 fg4",
                children: [
                  Header({ title: headerTitle }),
                  m.Div({
                    class: "flex",
                    children: [
                      m.Div({ class: "fg3", children: mainContent }),
                      m.Div({
                        class: "fg2 bg-almost-white",
                        children: sideContent
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};
// ../dev/@libs/widgets/section-title.ts
var SectionTitle = ({
  classNames,
  iconName,
  label
}) => m.H2({
  class: dstr`flex items-center mid-gray ${classNames}`,
  children: [
    m.If({
      condition: derived(() => !!val(iconName)),
      then: () => Icon({
        size: 28,
        className: "b mr3",
        iconName
      })
    }),
    label
  ]
});
// ../dev/accounts-and-payments/@components/accounts-list.ts
var AccountsList = ({ classNames }) => m.Div({
  class: dstr`${classNames}`,
  children: [
    SectionTitle({
      classNames: "mt2 mb4",
      iconName: "account_balance",
      label: "Bank Accounts and Other Money Sources"
    }),
    m.Div({
      class: "flex flex-wrap nl4",
      children: m.For({
        items: MOCK.ACCOUNTS,
        n: 1000,
        nthChild: () => {
          return AddButtonTile({
            classNames: "ba bw1 b--near-white ml4 mb4 pt4 h4 w-43",
            label: "Add new account",
            onClick: () => console.log("Add new account")
          });
        },
        map: (account) => ListTile({
          classNames: "ba bw1 b--near-white ml4 mb4 h4 w-43",
          title: account.name,
          subtitle: `${account.accountId ? `${account.accountId} ` : ""}(${account.currency})`,
          child: m.Div({
            class: "mt3",
            children: [
              m.Span(`${CURRENCIES[account.currency].symbol}`),
              m.Span({
                class: "ml1 f3",
                children: `${account.balance.toLocaleString("en-IN")}`
              })
            ]
          })
        })
      })
    })
  ]
});
// ../dev/accounts-and-payments/@components/payment-methods-list.ts
var PaymentMethodsList = ({
  classNames
}) => m.Div({
  class: dstr`${classNames}`,
  children: [
    SectionTitle({
      classNames: "mt2 mb4",
      iconName: "account_balance_wallet",
      label: "Payment Methods and Wallet Apps"
    }),
    m.Div({
      class: "flex flex-wrap nl4",
      children: m.For({
        items: MOCK.PAYMENT_METHODS,
        n: 1000,
        nthChild: () => {
          return AddButtonTile({
            classNames: "ba bw1 b--near-white ml4 mb4 pt4 h5 w-43",
            label: "Add new payment method",
            onClick: () => console.log("Add new payment method")
          });
        },
        map: (pm) => ListTile({
          classNames: "ba bw1 b--near-white ml4 mb4 h5 w-43",
          title: pm.displayName,
          subtitle: `${pm.uniqueId ? `${pm.uniqueId} ` : " "}${pm.expiry ? " \u2022 " + pm.expiry.toLocaleDateString() : " "}`,
          child: m.Div({
            class: "mt3 flex flex-wrap",
            children: m.For({
              items: pm.connectedAccountIds,
              map: (accId) => {
                const label = MOCK.ACCOUNTS.find((a) => a.id === accId)?.name || "";
                console.log(label);
                return Tag({ classNames: "ph3 pv2 mr2 mb2", label });
              }
            })
          })
        })
      })
    })
  ]
});
// ../dev/accounts-and-payments/main.ts
var main_default = () => Page({
  title: "Batua | Accounts & Assets",
  headerTitle: "Accounts and payment methods",
  selectedTabIndex: 4,
  mainContent: m.Div([
    AccountsList({
      classNames: "pv4"
    }),
    PaymentMethodsList({
      classNames: "pv4"
    })
  ]),
  sideContent: ""
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
    main_default();
    idGen.resetIdCounter();
    if (window)
      window.isDomAccessPhase = false;
  });
};
runScript();