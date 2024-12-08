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
// ../dev/@libs/ui-kit/button.ts
var Button = ({ className, onTap, label }) => m.Button({
  class: dstr`pv2 ph3 br-pill ba bw1 b--light-silver b--hover-black pointer bg-white black ${className}`,
  onclick: onTap,
  children: label
});
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
// ../dev/@libs/widgets/header.ts
var Header = ({ title }) => m.Div({
  class: "sticky left-0 top-0 right-0 pv4 f1 fw1 black bg-white",
  children: title
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
// ../dev/main.ts
var main_default = () => Page({
  title: "Batua - Money Tracker App",
  headerTitle: "Home Page",
  mainContent: m.Div([
    m.H3("home page stuff"),
    Button({
      label: "Go to transactions",
      onTap: () => location.href = path("/transactions")
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