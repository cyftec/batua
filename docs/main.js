var YJ=["onmount","onunmount"],UJ=["onerror","onload","onresize","onblur","onchange","oncontextmenu","onfocus","oninput","oninvalid","onreset","onselect","onsubmit","onkeydown","onkeypress","onkeyup","onclick","ondblclick","ondrag","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop","onmousedown","onmousemove","onmouseout","onmouseover","onmouseup","onscroll","onabort","oncanplay","oncanplaythrough","ondurationchange","onemptied","onended","onerror","onloadeddata","onloadedmetadata","onloadstart","onpause","onplay","onplaying","onprogress","onratechange","onseeked","onseeking","onstalled","onsuspend","ontimeupdate","onvolumechange","onwaiting"],VJ=[...UJ,...YJ],AJ=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"],E,EJ=(J)=>{if(!E)E=document.createElement("textarea");return E.innerHTML=J,E.value},TJ=()=>{let J=0;return{getNewId:()=>++J,resetIdCounter:()=>J=0}},BJ=TJ(),f={currentIs:(J)=>window._currentAppPhase===J,start:(J)=>{window._currentAppPhase=J,console.log(`Current phase is ${J}`)}},h=(J)=>{let Q=Object.entries(J).sort((X,Z)=>X[0].localeCompare(Z[0]));return Q.forEach(([X,Z],$)=>{if(Z&&typeof Z==="object"&&!Array.isArray(Z))Q[$]=[X,h(Z)]}),Object.fromEntries(Q)},GJ=(J)=>{if(typeof J!=="object"||J===null||Array.isArray(J))return!1;return Object.prototype.toString.call(J)==="[object Object]"},C=(J)=>{if(Array.isArray(J)){let Q=[...J],X=[];return Q.forEach((Z)=>{X.push(C(Z))}),X}if(GJ(J)){let Q={...J},X={};return Object.keys(Q).forEach((Z)=>{X[Z]=C(Q[Z])}),Object.freeze(X)}return J},x=(J)=>{if(Array.isArray(J)){let X=[...J],Z=[];return X.forEach(($)=>{Z.push(x($))}),Z}if(GJ(J)){let X={...J},Z={};return Object.keys(X).forEach(($)=>{Z[$]=x(X[$])}),Z}return J},i=(J,Q="index")=>J.map((X,Z)=>({[Q]:Z,value:X})),CJ=(J,Q)=>{let X=h(J),Z=h(Q),$=Object.keys(X),z=Object.keys(Z);if($.length!==z.length)return!1;for(let W of $)if(!z.includes(W)||!s(X[W],Z[W]))return!1;return!0},bJ=(J,Q)=>{if(J.length!==Q.length)return!1;if(J.length===0)return!0;for(let X=0;X<J.length;X++)if(!s(J[X],Q[X]))return!1;return!0},s=(J,Q)=>{if(typeof J!==typeof Q)return!1;if(Array.isArray(J))return bJ(J,Q);if(J===null||Q===null)return J===Q;if(typeof J==="object"&&!(J instanceof Set))return CJ(J,Q);if(typeof J==="bigint"||typeof J==="number"||typeof J==="string"||typeof J==="boolean")return J===Q;return J===Q},IJ=(J,Q,X)=>{let $=i(x(J),"index");return i(x(Q),"index").map((W)=>{let Y="add",B=-1,G=W.value;return $.some((R,L)=>{if(Y=s(R.value,W.value)?R.index===W.index?"idle":"shuffle":X&&R.value[X]!==void 0&&R.value[X]===W.value[X]?"update":"add",Y!=="add")return B=R.index,$.splice(L,1),!0;return!1}),{type:Y,oldIndex:B,value:G}})},b=null,c=(J)=>{let Q=C(J),X=new Set;return{type:"source-signal",get value(){if(b)X.add(b);return x(Q)},set value(Z){if(Z===Q)return;Q=C(Z),X.forEach(($)=>$&&$())}}},V=(J)=>{b=J,J(),b=null},H=(J)=>{let Q,X=c(Q);return V(()=>{Q=J(Q),X.value=Q}),{type:"derived-signal",get prevValue(){return Q},get value(){return X.value}}},K=(J)=>["source-signal","derived-signal"].includes(J?.type),RJ=(J,Q)=>J?.type==="non-signal"&&(!Q||!Q.length||Q.some((X)=>typeof J?.value===X)),o=(J)=>K(J)||RJ(J),_J=(J)=>RJ(J,["string"]),FJ=(J)=>J?.type==="non-signal"&&Array.isArray(J?.value)&&(J?.value).every((Q)=>typeof Q==="string"),A=(J)=>o(J)?J.value:J,F=(J,...Q)=>H(()=>{return J.reduce((X,Z,$)=>{let z,W=Q[$];if(typeof W==="function")z=W()??"";else if(o(W))z=W.value??"";else z=W??"";return`${X}${Z}${z.toString()}`},"")}),I=(J)=>Array.isArray(J),g=(J)=>!isNaN(J?.elementId)&&J?.elementId>0,S=(J)=>typeof J==="string"||typeof J==="function"&&J.isElementGetter,d=(J)=>K(J)&&S(J.value),gJ=(J)=>S(J)||d(J),qJ=(J)=>{return K(J)&&(S(J.value)||I(J.value)&&J.value.every((Q)=>S(Q)))},LJ=(J)=>{return!K(J)&&(_J(J)||FJ(J)||S(J)||I(J)&&J.every((Q)=>gJ(Q)))},r=(J)=>{return qJ(J)||LJ(J)},n=!1,yJ={},k={},NJ=globalThis.MutationObserver,vJ=new NJ((J)=>{J.forEach((Q)=>{if(Q.type==="childList")Q.addedNodes.forEach((X)=>{if(g(X)){let Z=X,$=Z.elementId;if(k[$])delete k[$];else yJ[$]=Z.tagName}}),Q.removedNodes.forEach((X)=>{if(g(X)){let Z=X,$=Z.elementId,z=Z.unmountListener;if(z)k[$]={element:Z,unmountListener:z}}})}),Object.entries(k).forEach(([Q,X])=>{let{element:Z,unmountListener:$}=X;HJ(Z,$)})}),HJ=(J,Q)=>{if(!g(J))return;let X=J.children;for(let Z=0;Z<X.length;Z++){let $=X[Z];HJ($,$.unmountListener)}if(Q&&Q(J),k[J.elementId])delete k[J.elementId]},hJ=()=>{if(!n&&!f.currentIs("build"))vJ.observe(document.body,{childList:!0,subtree:!0}),n=!0},PJ=(J,Q)=>VJ.includes(J)&&Q===void 0,MJ=(J,Q)=>UJ.includes(J)&&typeof Q==="function",jJ=(J,Q)=>YJ.includes(J)&&typeof Q==="function",cJ=(J,Q)=>PJ(J,Q)||MJ(J,Q)||jJ(J,Q),pJ=(J,Q)=>{Object.entries(Q).forEach(([X,Z])=>{if(PJ(X,Z));else if(MJ(X,Z)){let $=X.slice(2);J.addEventListener($,(z)=>{if($==="keypress")z.preventDefault();Z(z)})}else if(jJ(X,Z)){if(X==="onmount"&&!f.currentIs("build")){let $=Z;setTimeout(()=>$(J),0)}if(X==="onunmount")hJ(),J.unmountListener=Z}else console.error(`Invalid event key: ${X} for element with tagName: ${J.tagName}`)})},l=(J,Q,X)=>{let Z=(o(X)?X.value:X)??"";if(typeof Z==="boolean")if(Z)J.setAttribute(Q,"");else J.removeAttribute(Q);else if(Q==="value")J.value=Z;else if(Z)J.setAttribute(Q,Z)},uJ=(J,Q)=>{let X={};Object.entries(Q).forEach((Z)=>{let[$,z]=Z;if(K(z))X[$]=z;l(J,$,z)}),V(()=>{Object.entries(X).forEach((Z)=>{let[$,z]=Z,W=z.value;if(!f.currentIs("run"))return;l(J,$,W)})})},T=(J)=>{if(d(J)){let Q=J.value;return T(Q)}if(typeof J==="string")return document.createTextNode(EJ(J));if(S(J)){let Q=J();if(!g(Q))throw new Error(`Invalid MHtml element getter child. Type: ${typeof J}`);return Q}throw new Error(`Invalid child. Type of child: ${typeof J}`)},mJ=(J,Q)=>{if(!Q)return;if(qJ(Q))V(()=>{let Z=Q.value,$=I(Z)?Z:[Z];$.forEach((W,Y)=>{let B=J.childNodes[Y],G=T(W);if(B&&G)J.replaceChild(G,B);else if(G)J.appendChild(G);else console.error(`No child found for node with tagName: ${J.tagName}`)});let z=$.length;while(z<J.childNodes.length){let W=J.childNodes[z];if(W)J.removeChild(W)}});if(LJ(Q)){let X=_J(Q)?[Q.value]:FJ(Q)?Q.value:I(Q)?Q:[Q],Z=[];if(X.forEach(($,z)=>{if(d($))Z.push({index:z,childSignal:$});let W=T($),Y=J.childNodes[z];if(Y&&W)J.replaceChild(W,Y);else if(!Y&&W)J.appendChild(W);else console.error(`No child found for node with tagName: ${J.tagName}`)}),Z.length)Z.forEach(({index:$,childSignal:z})=>{V(()=>{if(!z.value)return;if(!f.currentIs("run"))return;let W=T(z.value),Y=J.childNodes[$];if(Y&&W)J.replaceChild(W,Y);else if(!Y&&W)J.appendChild(W);else console.error(`No child found for node with tagName: ${J.tagName}`)})})}},sJ=(J,Q)=>{let X=void 0,Z={},$={};return Object.entries(J).forEach(([z,W])=>{if(z==="children")if(r(W))X=W;else throw new Error(`Invalid children prop for node with tagName: ${Q}

 ${JSON.stringify(W)}`);else if(cJ(z,W))Z[z]=W;else $[z]=W}),{children:X,eventProps:Z,attributeProps:$}},oJ=(J,Q)=>{let X=()=>{let Z=BJ.getNewId(),$=f.currentIs("mount")?document.querySelector(`[data-elem-id="${Z}"]`):document.createElement(J);$.elementId=Z,$.unmountListener=void 0;let z=r(Q)?{children:Q}:Q;if(!f.currentIs("run"))z["data-elem-id"]=$.elementId.toString();let W=sJ(z,$.tagName);if(pJ($,W.eventProps),uJ($,W.attributeProps),mJ($,W.children),!f.currentIs("build"))$.removeAttribute("data-elem-id");return $};return X.isElementGetter=!0,X},a=(J,Q,X)=>{let Z=c(Q),$=c(J),z=X(H(()=>$.value),H(()=>Z.value)),W,Y,B=!1;if(z?.isElementGetter)W=()=>{if(B&&Y)return Y;return Y=z(),B=!0,Y},W.isElementGetter=!0;else if(typeof z==="string")W=z;else throw`One of the child, ${z} passed in ForElement is invalid.`;return{indexSignal:Z,itemSignal:$,mappedChild:W}},t=(J,Q,X)=>{if(Q!==void 0&&Q>=0&&X){let Z=Q>J.length?J.length:Q;J.splice(Z,0,X)}return J},dJ=({subject:J,itemKey:Q,map:X,n:Z,nthChild:$})=>{if($&&Z===void 0||Z!==void 0&&Z>-1&&!$)throw new Error("Either both 'n' and 'nthChild' be passed or none of them.");let z=H(()=>{let _=A(J);return Array.isArray(_)?_:[]});if(!Q)return H(()=>t(z.value.map(X),Z,$));let W=$;if($&&typeof $!=="string"){let _=$(),w=()=>_;w.isElementGetter=!0,W=w}let Y=z.value;if(Y.length&&typeof Y[0]!=="object")throw new Error("for mutable map, item in the list must be an object");let B=null,G=H((_)=>{return B=_||B,z.value}),R=H((_)=>{if(!_||!B)return G.value.map((O,j)=>a(O,j,X));return IJ(B,G.value,Q).map((D,O)=>{let j=(_||[])[D.oldIndex];if(console.assert(D.type==="add"&&D.oldIndex===-1&&!j||D.oldIndex>-1&&!!j,"In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer."),j){if(D.type==="shuffle")j.indexSignal.value=O;if(D.type==="update")j.indexSignal.value=O,j.itemSignal.value={...D.value};return j}return a(D.value,O,X)})});return H(()=>t(R.value.map((_)=>_.mappedChild),Z,W))},rJ=({subject:J,isTruthy:Q,isFalsy:X})=>{let Z=U.Span({style:"display: none;"}),$=()=>(A(J)?Q:X)||Z;return K(J)?H($):$()},iJ=({subject:J,caseMatcher:Q,defaultCase:X,cases:Z})=>{let $=()=>{let z=A(J),W=void 0;for(let[Y,B]of Object.entries(Z))if(Q&&Q(J,Y)||z===Y){W=B;break}return W||X||U.Span({style:"display: none;"})};return K(J)?H($):$()},nJ=AJ.reduce((J,Q)=>{let X=Q.split("").map(($,z)=>!z?$.toUpperCase():$).join(""),Z=($)=>oJ(Q,$);return J[X]=Z,J},{}),lJ={For:dJ,If:rJ,Switch:iJ},U={...nJ,...lJ},q=(J)=>(Q)=>{for(let Z of Object.keys(Q))if(Q[Z]===void 0)delete Q[Z];let X=Object.entries(Q).reduce((Z,$)=>{let[z,W]=$,Y=typeof W==="string",B=Array.isArray(W)&&W.every((R)=>typeof R==="string"),G=K(W)||typeof W==="function"?W:Y||B?{type:"non-signal",get value(){return A(W)}}:r(W)?W:{type:"non-signal",get value(){return A(W)}};return Z[z]=G,Z},{});return J(X)},p=q(({className:J,onTap:Q,label:X})=>U.Button({class:F`pv2 ph3 br-pill ba bw1 b--light-silver b--hover-black pointer bg-white black ${J}`,onclick:()=>Q(),children:X})),aJ=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],tJ=(J)=>{let Q={FUT:{isFuture:!0,label:"ERROR: Future date or time"},TOD:{isFuture:!1,label:"Today"},YST:{isFuture:!1,label:"Yesterday"},DBY:{isFuture:!1,label:"Day before yesterday"},XDB:(R)=>({isFuture:!1,label:`${R} days back`})},X=86400000,Z=new Date,$=new Date(Z.getFullYear(),Z.getMonth(),Z.getDate()),z=Z.getTime(),W=J.getTime(),Y=$.getTime();if(W>z)return Q.FUT;if(W<=z&&W>Y)return Q.TOD;let B=Y-W,G=Math.ceil(B/86400000);if(G<=1)return Q.YST;if(G<=2)return Q.DBY;return Q.XDB(G)},eJ=(J)=>{let Q=J.toLocaleDateString().split("/").reverse().join("-"),X=J.toLocaleTimeString().split(":");X.pop();let Z=X.join(":");return`${Q}T${Z}`},jQ=q(({classNames:J,dateTime:Q,onchange:X})=>{console.log(Q.toString()+"sdfkjajsn");let Z=H(()=>{return aJ[Q.value.getDay()].substring(0,3)}),$=H(()=>eJ(Q.value)),z=H(()=>tJ(Q.value));return U.Div({class:F`dark-gray flex items-center justify-between ${J}`,children:[U.Div({class:"ph3 pv2 br3 ba bw1 b--light-gray",children:[U.Span(Z),U.Span({class:"pr3 mr3 br b--light-gray bw1"}),U.Input({class:"bn pointer",type:"datetime-local",value:$,onchange:(W)=>X(new Date(W.target.value))})]}),U.Span({class:F`${()=>z.value.isFuture?"red":"silver"}`,children:F`${()=>z.value.label}`})]})}),DQ=q(({header:J,isOpen:Q,onPrev:X,onNext:Z,onTapOutside:$,child:z})=>{return console.log(Q),JQ({classNames:"pa4",isOpen:Q,onTapOutside:$,content:U.Div([U.H2({class:"ma0 pb4",children:J}),z,U.Div({class:"flex items-center w-100 pt4",children:[p({className:"w-inherit",label:"Cancel",onTap:X}),U.Span({class:"pa3"}),p({className:"w-inherit",label:"Save",onTap:Z})]})])})}),fQ=q(({classNames:J,options:Q,onchange:X})=>U.Select({class:F`pointer bn bg-near-white ${J}`,onchange:(Z)=>X(Z.target.value),children:U.For({subject:Q,map:(Z)=>U.Option({...Z.isSelected?{selected:""}:{},value:Z.id,children:Z.label})})})),N=q(({className:J,size:Q,onClick:X,iconName:Z,title:$})=>U.Span({class:F`material-symbols-rounded ${()=>X?"pointer":""} ${J}`,style:F`font-size: ${()=>Q?.value||"16"}px`,onclick:X,children:Z,title:$})),wQ=q(({className:J,onClick:Q,label:X})=>U.Span({class:F`underline pointer hover-black f6 ${J}`,onclick:Q,children:X})),JQ=q(({classNames:J,isOpen:Q,content:X,onTapOutside:Z})=>{return U.Dialog({onmount:($)=>setTimeout(()=>V(()=>{if(Q.value)$.showModal();else $.close()})),onclick:Z,class:F`pa0 br3 b--gray`,children:[U.Div({class:F` ${J}`,onclick:($)=>$.stopPropagation(),children:X})]})}),KQ=q(({classNames:J,placeholder:Q,num:X,onchange:Z})=>{let $=(z)=>{let W=z.target.value;Z(Number.parseFloat(Number.parseFloat(W||"0").toFixed(2)))};return U.Input({class:J,type:"number",placeholder:Q,value:H(()=>(X.value??"").toString()),onchange:$})}),OQ=q(({classNames:J,label:Q,iconClassNames:X,iconName:Z,iconHint:$,iconSize:z,onIconClick:W})=>U.Span({class:F`bg-near-white br2 flex items-center ${J}`,children:[U.Span(Q),U.If({subject:Z,isTruthy:N({className:F`pointer mid-gray ${X}`,size:H(()=>z?.value||16),onClick:W,iconName:Z,title:$})})]})),kQ=q(({classNames:J,placeholder:Q,text:X,onchange:Z,onfocus:$,onblur:z})=>{let W=(Y)=>{let B=Y.target.value;Z(B)};return U.Input({class:F`${J}`,type:"text",placeholder:Q,value:X,onchange:W,onfocus:$,onblur:z})}),SQ=q(({classNames:J,children:Q,onClick:X})=>DJ({classNames:F`tc ${J}`,onClick:X,children:Q})),QQ=q(({title:J,classNames:Q})=>U.Div({class:F`sticky left-0 top-0 right-0 pv4 f2 fw2 black bg-pale ${Q}`,children:J})),DJ=q(({classNames:J,onClick:Q,children:X})=>{return console.log("onclick handler for tile-card is",Q),U.Div({class:F`ba b--light-gray br4 ph3 pt3 pb0 ${Q?"hover-pop pointer hover-bg-white":""} ${J}`,onclick:Q,children:X})}),xQ=q(({classNames:J,titleIconName:Q,title:X,subtitle:Z,child:$,onClick:z})=>{return console.log(`onclick handler for '${X.value}' is`,z),DJ({classNames:J,onClick:z,children:[U.Div({class:"black b mb1 flex items-center",children:[U.If({subject:Q,isTruthy:N({size:20,className:"b mr2",iconName:Q})}),X.value]}),U.Div({class:"light-silver h1 f6",children:Z}),$]})}),XQ=q(({classNames:J,rightLink:Q,links:X,selectedLinkIndex:Z})=>{return U.Div({class:F`bg-almost-white flex flex-column mnw5 vh-100 sticky left-0 top-0 bottom-0 ${J}`,children:[U.A({class:"flex items-center no-underline ma3 pa3 br4 hover-pop",href:"/",children:[U.Img({class:"h3rem w3rem mr2 br3",src:"/assets/images/batua-logo.png"}),U.Div({class:"ml1 black fw2",children:[U.Div({class:"tl f4 bn br3",children:[U.Span({class:"mr2 f2",children:"batua"}),U.Span({class:"f7 silver"})]}),U.Div({class:"f6 fw3 mb1 silver",children:"Money Tracker App"})]})]}),U.Div({class:"h-100",children:U.For({subject:X,map:($,z)=>e({classNames:"mh3 mb3",icon:$.icon,label:$.label,href:$.href,isSelected:Z.value===$.index})})}),e({classNames:"mh3 mb3",icon:Q.value.icon,label:Q.value.label,href:Q.value.href,isSelected:Z.value===Q.value.index})]})}),e=q(({classNames:J,icon:Q,label:X,href:Z,isSelected:$})=>U.Div({class:F`br4 ba ${()=>$.value?"bg-white b--light-gray black":"b--pale light-silver hover-pop"} ${J}`,children:U.A({class:F`no-underline hover-black ${()=>$.value?"black fw3 no-pointer":"fw2 light-silver"}`,href:H(()=>$.value?void 0:Z.value),children:U.Div({class:"pa3 flex items-center",children:[N({size:22,iconName:Q}),U.Div({class:"f5 pl3",children:X})]})})})),fJ=crypto.randomUUID(),wJ=crypto.randomUUID(),ZQ=crypto.randomUUID(),$Q=[{id:fJ,type:"savings",name:"Cash",uniqueId:void 0,balance:1000,currency:"INR"}],WQ=[{id:wJ,name:"Notes & Coins",uniqueId:void 0,expiry:void 0},{id:ZQ,name:"Bank Transfer",uniqueId:void 0,expiry:void 0}],y=new Date,JJ=new Date(y.getFullYear(),y.getMonth(),1),QJ=new Date(y.getFullYear(),y.getMonth()+1,0),zQ=[{id:crypto.randomUUID(),name:"Monthly household expense",limit:15000,spend:0,startDate:JJ,endDate:QJ,currency:"INR",tags:["essential","grocery","stationery","education","homenkitchen"]},{id:crypto.randomUUID(),name:"Entertainment Budget",limit:1000,spend:0,startDate:JJ,endDate:QJ,currency:"INR",tags:["netflix","hotstar","standupshows","movies"]}],YQ=[{icon:"warning",name:"Necessity of transaction"},{icon:"account_balance",name:"Payemnt Source"},{icon:"credit_card",name:"Payemnt Method"},{icon:"commute",name:"Commute and Transportation"},{icon:"luggage",name:"Travel"},{icon:"storefront",name:"Shop or Marketplace"},{icon:"production_quantity_limits",name:"Product Category"},{icon:"brand_family",name:"Product Brand"},{icon:"family_restroom",name:"Relatives or Friends"},{icon:"location_on",name:"Location of transaction"},{icon:"routine",name:"Time of transaction"},{icon:"celebration",name:"Events, groups or situations"},{icon:"dangerous",name:"Not categorized"},{icon:"category",name:"Miscellaneous category"},{icon:"attractions",name:"Entertainment"},{icon:"subscriptions",name:"Subscription"}],UQ=[{name:"essential",isEditable:0,category:"Necessity of transaction"},{name:"maybeluxary",isEditable:0,category:"Necessity of transaction"},{name:"luxary",isEditable:0,category:"Necessity of transaction"},{name:"uber",isEditable:1,category:"Commute and Transportation"},{name:"airbnb",isEditable:1,category:"Travel"},{name:"bookingdotcom",isEditable:1,category:"Travel"},{name:"decathlon",isEditable:1,category:"Shop or Marketplace"},{name:"amazon",isEditable:1,category:"Shop or Marketplace"},{name:"ikea",isEditable:1,category:"Shop or Marketplace"},{name:"grocery",isEditable:1,category:"Product Category"},{name:"apparel",isEditable:1,category:"Product Category"},{name:"gadgets",isEditable:1,category:"Product Category"},{name:"furniture",isEditable:1,category:"Product Category"},{name:"grooming",isEditable:1,category:"Product Category"},{name:"gifting",isEditable:1,category:"Product Category"},{name:"jewellery",isEditable:1,category:"Product Category"},{name:"stationery",isEditable:1,category:"Product Category"},{name:"books",isEditable:1,category:"Product Category"},{name:"gardening",isEditable:1,category:"Product Category"},{name:"sportsnfitness",isEditable:1,category:"Product Category"},{name:"treatment",isEditable:1,category:"Product Category"},{name:"vehicle",isEditable:1,category:"Product Category"},{name:"outing",isEditable:1,category:"Product Category"},{name:"softwareapp",isEditable:1,category:"Product Category"},{name:"appliances",isEditable:1,category:"Product Category"},{name:"education",isEditable:1,category:"Product Category"},{name:"petsupplies",isEditable:1,category:"Product Category"},{name:"diningout",isEditable:1,category:"Product Category"},{name:"homenkitchen",isEditable:1,category:"Product Category"},{name:"luggagenbags",isEditable:1,category:"Product Category"},{name:"toysngames",isEditable:1,category:"Product Category"},{name:"accessories",isEditable:1,category:"Product Category"},{name:"movies",isEditable:1,category:"Entertainment"},{name:"standupshows",isEditable:1,category:"Entertainment"},{name:"netflix",isEditable:1,category:"Subscription"},{name:"hotstar",isEditable:1,category:"Subscription"}],v=new Date,KJ=crypto.randomUUID(),OJ=crypto.randomUUID(),BQ=[{id:KJ,date:v,createdAt:v,modifiedAt:v,type:"purchase",title:"My first expense (You can delete this)",tags:["test","dummyexpense"],payments:[OJ]}],GQ=[{id:OJ,transactionId:KJ,amount:10,currencyCode:"INR",account:fJ,paymentMethod:wJ,type:"debit"}],M={ACCOUNTS:$Q,PAYMENT_METHODS:WQ,TAG_CATEGORIES:YQ,TAGS:UQ,BUDGETS:zQ,TRANSACTIONS:BQ,PAYMENTS:GQ};class kJ{static open(J,Q,X){return new Promise((Z,$)=>{let z=window.indexedDB.open(J,Q);z.onerror=()=>$(new Error(`Failed opening '${J} v${Q}' db.`)),z.onsuccess=(W)=>{let Y=W.target.result;Z(Y)},z.onupgradeneeded=(W)=>{let Y=W.target.result;X(Y,$)}})}}var RQ=(J,Q,X,Z)=>{return Object.keys(X).reduce((z,W)=>{let Y=async(B,G,R)=>{let L=await kJ.open(J,Q,Z);L.onerror=()=>console.error(`Error opening '${J}' db`);let _=L.transaction(W,G);_.onerror=()=>console.error(`Error initializing transaction. ${R}`);let w=_.objectStore(W);return new Promise((D,O)=>{let j=B(w);j.onerror=()=>O(new Error(R)),j.onsuccess=(xJ)=>D(xJ.target.result)})};return z[W]={add:(B,G)=>Y((R)=>R.add(B,G),"readwrite",`Error adding value - ${B} to '${W}' store`),clear:()=>Y((B)=>B.clear(),"readonly",`Error clearing records in '${W}' store`),count:(B)=>Y((G)=>G.count(B),"readonly",`Error counting records in '${W}' store`),delete:(B)=>Y((G)=>G.delete(B),"readwrite",`Error deleting records from '${W}' store`),get:async(B)=>Y((G)=>G.get(B),"readonly",`Error fetching specific record from '${W}' store`),getAll:async(B,G)=>Y((R)=>R.getAll(B,G),"readonly",`Error fetching all records from '${W}' store`),getAllKeys:async(B,G)=>Y((R)=>R.getAllKeys(B,G),"readonly",`Error fetching multiple keys from '${W}' store`),getKey:async(B)=>Y((G)=>G.getKey(B),"readonly",`Error fetching specific key from '${W}' store`),put:async(B,G)=>Y((R)=>R.put(B,G),"readwrite",`Error updating value - ${B} to '${W}' store`),indices:X[W].indices.reduce((B,G)=>{let R=Object.entries(G)[0][0];return B[R]={count:async(L)=>Y((_)=>_.index(R).count(L),"readonly",`Error counting records in '${W}.${R}' index`),get:async(L)=>Y((_)=>_.index(R).get(L),"readonly",`Error fetching specific record from '${W}.${R}' index`),getAll:async(L,_)=>Y((w)=>w.index(R).getAll(L,_),"readonly",`Error fetching all records from '${W}.${R}' index`),getAllKeys:async(L,_)=>Y((w)=>w.getAllKeys(L,_),"readonly",`Error fetching multiple keys from '${W}.${R}' index`),getKey:async(L)=>Y((_)=>_.getKey(L),"readonly",`Error fetching specific key from '${W}.${R}' index`)},B},{})},z},{})},u="batua",m=1,SJ={accounts:{keyPathsShorthand:"id",indices:[],initialData:M.ACCOUNTS},budgets:{keyPathsShorthand:"id",indices:[],initialData:M.BUDGETS},payments:{keyPathsShorthand:"id",indices:[{amount:"amount|multiEntry"},{currencyCode:"currencyCode|multiEntry"},{account:"account|multiEntry"},{paymentMethod:"paymentMethod|multiEntry"},{type:"type|multiEntry"}],initialData:M.PAYMENTS},paymentMethods:{keyPathsShorthand:"id",indices:[],initialData:M.PAYMENT_METHODS},tags:{keyPathsShorthand:"id",indices:[{name:"name|unique"},{category:"category|multiEntry"},{isEditable:"isEditable|multiEntry"}],initialData:M.TAGS},tagCategories:{keyPathsShorthand:"id",indices:[],initialData:M.TAG_CATEGORIES},transactions:{keyPathsShorthand:"id",indices:[{date:"date|multiEntry"},{createdAt:"createdAt|multiEntry"},{modifiedAt:"modifiedAt|multiEntry"},{title:"title|multiEntry"},{payments:"payments|multiEntry"},{tags:"tags|multiEntry"}],initialData:M.TRANSACTIONS}},XJ=(J)=>J.includes("+")?J.split("+"):J,_Q=(J)=>({[J]:!0}),FQ=(J,Q)=>{Object.entries(SJ).forEach(([X,Z])=>{let{keyPathsShorthand:$,indices:z}=Z,W=J.createObjectStore(X,{keyPath:XJ($),autoIncrement:!1});W.transaction.onerror=()=>Q(new Error(`error creating '${X}' store on upgrade of '${u}' db v${m}`)),z.forEach((Y)=>{let[B,G]=Object.entries(Y)[0],[R,L]=G.split("|");W.createIndex(B,XJ(R),_Q(L))}),W.transaction.oncomplete=()=>console.log(`'${X}' store created for '${u}' db v${m}`)})},P=RQ(u,m,SJ,FQ),qQ=async()=>{try{let J=await P.accounts.getAll();if(!J)throw new Error("DB didn't return records from accounts store");if(!J.length)for(let Y of M.ACCOUNTS)await P.accounts.add({...Y});else console.log("accounts store store already populated");let Q=await P.paymentMethods.getAll();if(!Q)throw new Error("DB didn't return records from payment-services store");if(!Q.length)for(let Y of M.PAYMENT_METHODS)await P.paymentMethods.add({...Y});else console.log("payment-services store already populated");let X=await P.tagCategories.getAll();if(!X)throw new Error("DB didn't return records from tag-categories store");if(!X.length)for(let Y of M.TAG_CATEGORIES)await P.tagCategories.add({...Y});else console.log("tag-categories store already populated");let Z=await P.tagCategories.getAll();if(!Z)throw new Error("DB didn't return newly created records from tag-categories store");let $=await P.tags.getAll();if(!$)throw new Error("DB didn't return records from tags store");if(!$.length)for(let Y of M.TAGS){let B=Z.find((G)=>G.name===Y.category);if(!B)throw new Error(`No category id fround for tag with category - ${Y.name}`);await P.tags.add({id:Y.id,name:Y.name,category:B.name,isEditable:Y.isEditable})}else console.log("tags store already populated");let z=await P.transactions.getAll();if(!z)throw new Error("DB didn't return records from transactions store");if(!z.length)for(let Y of M.TRANSACTIONS){await P.transactions.add({...Y});for(let B of Y.payments){let G=M.PAYMENTS.find((R)=>R.id===B);if(!G)throw new Error("No payment found for this transaction. Add correct payment for relevant transaction.");await P.payments.add(G)}}else console.log("transactions store already populated");let W=await P.budgets.getAll();if(!W)throw new Error("DB didn't return records from tag-categories store");if(!W.length)for(let Y of M.BUDGETS)await P.budgets.add({...Y});else console.log("budgets store already populated")}catch(J){console.log(J)}},ZJ="batua",$J={localCurrency:`${ZJ}-local-currency`,dbInitPhase:`${ZJ}-db-init-phase`},WJ=(J,Q)=>({get value(){if(f.currentIs("build"))return"";return window.localStorage.getItem(J)||Q},set value(X){if(f.currentIs("build"))return;window.localStorage.setItem(J,X)}}),LQ={localCurrency:WJ($J.localCurrency,"INR"),dbInitPhase:WJ($J.dbInitPhase,"pending")},zJ={db:P,prefs:LQ},HQ=q(({htmlTitle:J,headElements:Q,headerTitle:X,selectedTabIndex:Z,mainContent:$,sideContent:z})=>{let W=async()=>{if(zJ.prefs.dbInitPhase.value==="pending")await qQ(),zJ.prefs.dbInitPhase.value="done"};return U.Html({onmount:W,lang:"en",children:[U.Head([U.Meta({name:"viewport",content:"width=device-width, initial-scale=1"}),U.Title(J),U.Link({rel:"icon",type:"image/x-icon",href:"/assets/images/favicon.ico"}),U.Link({rel:"stylesheet",href:"/assets/styles.css"}),...Q||[]]),U.Body({class:"mid-gray",children:[U.Script({src:"main.js",defer:"true"}),U.Div({class:"flex items-start",children:[XQ({classNames:"fg3",selectedLinkIndex:Z?.value??-1,links:[{index:0,icon:"swap_horiz",label:"Transactions",href:"/transactions"},{index:1,icon:"bar_chart_4_bars",label:"Charts & Trends",href:"/charts"},{index:2,icon:"savings",label:"Budget & Investments",href:"/budget"},{index:3,icon:"sell",label:"Tags & Categories",href:"/tags"},{index:4,icon:"account_balance_wallet",label:"Accounts & Payment Methods",href:"/accounts-and-payments"}],rightLink:{index:5,icon:"settings",label:"Settings",href:"/settings"}}),U.Div({class:"fg11",children:[QQ({classNames:"ml4 pt45 z-999",title:X}),U.Div({class:"flex pt3",children:[U.Div({class:"mh4 fg7",children:$}),U.Div({class:"dn db-ns dn-m bg-near-white fg4",children:z})]})]})]})]})]})}),VQ=q(({classNames:J,iconName:Q,label:X})=>U.Div({class:F`flex items-center mt3 gray f5 fw4 ${J}`,children:[U.If({subject:Q,isTruthy:N({size:24,className:"mr2",iconName:Q})}),X.value.toUpperCase()]})),PQ=HQ({htmlTitle:"Batua - Money Tracker App",headerTitle:"Home Page",mainContent:U.Div([U.H3("home page stuff"),p({label:"Go to transactions",onTap:()=>location.href="/transactions"})]),sideContent:""}),MQ=()=>{f.start("mount"),BJ.resetIdCounter(),PQ(),f.start("run")};MQ();
