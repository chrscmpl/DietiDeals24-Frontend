import{a as R}from"./chunk-C6O6P6QR.js";import{n as Q,s as Z}from"./chunk-LCU4DL3S.js";import{E as W,G as O,Sb as F,Tb as x,Y as P,_ as U,a as A,aa as k,db as q,fa as T,fb as Y,ga as B,j as y,ka as G,l as I,mb as $,pa as V,qa as M,r as L,ra as z,sa as K,u as _}from"./chunk-BYEFBY3C.js";var C=class{constructor(s){this._id=String(s.userId),this._username=s.username,this._name=s.name,this._surname=s.surname,this._birthday=s.birthday,this._email=s.email,this._onlineAuctionsCounter=s.onlineAuctionsCounter??0,this._pastDealsCounter=s.pastDealsCounter??0,this._profilePictureUrl=s.profilePictureUrl??null,this._country=s.country??null,this._city=s.city??null,this._bio=s.bio??null,this._links=s.links??[]}get id(){return this._id}get username(){return this._username}get name(){return this._name}get surname(){return this._surname}get birthday(){return this._birthday}get email(){return this._email}get onlineAuctionsCounter(){return this._onlineAuctionsCounter}get pastDealsCounter(){return this._pastDealsCounter}get profilePictureUrl(){return this._profilePictureUrl}get country(){return this._country}get city(){return this._city}get bio(){return this._bio}get links(){return this._links}},J=class{constructor(s){this._id=s.id,this._username=s.username,this._profilePictureUrl=s.profilePictureUrl,this._location={country:s.country,city:s.city}}get id(){return this._id}get username(){return this._username}get profilePictureUrl(){return this._profilePictureUrl}get location(){return this._location}};var E=class{constructor(s){this.error=s}};var b=class extends E{constructor(s){super(s)}};var N=class extends E{constructor(s){super(s)}};var v=class extends E{constructor(s){super(s)}};var D=class extends E{constructor(s){super(s)}};var Rt=(()=>{let s=class s{get isLogged(){return this._isLogged}get loggedUser(){return this._loggedUser}constructor(e){this.http=e,this._isLogged=!1,this._loggedUser=null,this._initialized=!1,this.emailToVerify=null,this.initializedSubject=new I(1),this.loggedUserSubject=new I(1),this.isLoggedSubject=new I(1),this.isLogged$=this.isLoggedSubject.asObservable().pipe(_(()=>this.isLogged)),this.loggedUser$=this.loggedUserSubject.asObservable().pipe(k(this.isLogged$),W(()=>this.isLogged),_(()=>this.loggedUser)),this.initialized$=this.initializedSubject.asObservable(),this.isLoggedSubject.next(),s.authorizationToken?this.getUserDataObservable().subscribe():this.setInitialized()}login(e,i){this.http.post(`${R.backendHost}/login`,e,{observe:"response"}).pipe(O(r=>L(()=>new b(r))),P(r=>(s.extractToken(r),this.getUserDataObservable()))).subscribe(i)}register(e,i){this.http.post(`${R.backendHost}/register/init`,e,{responseType:"text"}).pipe(O(r=>L(()=>new v(r)))).subscribe(i)}verifyEmail(e,i){this.http.post(`${R.backendHost}/register/confirm`,e,{observe:"response"}).pipe(O(r=>L(()=>new D(r))),P(r=>(s.extractToken(r),this.getUserDataObservable()))).subscribe(i)}getUserDataObservable(){return this.http.get(`${R.backendHost}/profile/owner-view`).pipe(_(e=>new C(e)),U(this.setLoggedUser.bind(this)),O(e=>(this.setInitialized(),L(()=>new N(e)))))}logout(){localStorage.removeItem("authorizationToken"),this._isLogged=!1,this._loggedUser=null,this.isLoggedSubject.next()}setLoggedUser(e){this.setInitialized(),this._isLogged=!0,this._loggedUser=e,this.isLoggedSubject.next(),this.loggedUserSubject.next()}setInitialized(){this._initialized||(this._initialized=!0,this.initializedSubject.next())}static extractToken(e){let i=e.headers.get("X-Auth-Token");i&&(this.authorizationToken=i)}static set authorizationToken(e){localStorage.setItem("authorizationToken",e)}static get authorizationToken(){return localStorage.getItem("authorizationToken")}};s.\u0275fac=function(i){return new(i||s)(G(Z))},s.\u0275prov=T({token:s,factory:s.\u0275fac,providedIn:"root"});let n=s;return n})();var u=class n{static isArray(s,t=!0){return Array.isArray(s)&&(t||s.length!==0)}static isObject(s,t=!0){return typeof s=="object"&&!Array.isArray(s)&&s!=null&&(t||Object.keys(s).length!==0)}static equals(s,t,e){return e?this.resolveFieldData(s,e)===this.resolveFieldData(t,e):this.equalsByValue(s,t)}static equalsByValue(s,t){if(s===t)return!0;if(s&&t&&typeof s=="object"&&typeof t=="object"){var e=Array.isArray(s),i=Array.isArray(t),r,a,o;if(e&&i){if(a=s.length,a!=t.length)return!1;for(r=a;r--!==0;)if(!this.equalsByValue(s[r],t[r]))return!1;return!0}if(e!=i)return!1;var l=this.isDate(s),f=this.isDate(t);if(l!=f)return!1;if(l&&f)return s.getTime()==t.getTime();var c=s instanceof RegExp,p=t instanceof RegExp;if(c!=p)return!1;if(c&&p)return s.toString()==t.toString();var h=Object.keys(s);if(a=h.length,a!==Object.keys(t).length)return!1;for(r=a;r--!==0;)if(!Object.prototype.hasOwnProperty.call(t,h[r]))return!1;for(r=a;r--!==0;)if(o=h[r],!this.equalsByValue(s[o],t[o]))return!1;return!0}return s!==s&&t!==t}static resolveFieldData(s,t){if(s&&t){if(this.isFunction(t))return t(s);if(t.indexOf(".")==-1)return s[t];{let e=t.split("."),i=s;for(let r=0,a=e.length;r<a;++r){if(i==null)return null;i=i[e[r]]}return i}}else return null}static isFunction(s){return!!(s&&s.constructor&&s.call&&s.apply)}static reorderArray(s,t,e){let i;s&&t!==e&&(e>=s.length&&(e%=s.length,t%=s.length),s.splice(e,0,s.splice(t,1)[0]))}static insertIntoOrderedArray(s,t,e,i){if(e.length>0){let r=!1;for(let a=0;a<e.length;a++)if(this.findIndexInList(e[a],i)>t){e.splice(a,0,s),r=!0;break}r||e.push(s)}else e.push(s)}static findIndexInList(s,t){let e=-1;if(t){for(let i=0;i<t.length;i++)if(t[i]==s){e=i;break}}return e}static contains(s,t){if(s!=null&&t&&t.length){for(let e of t)if(this.equals(s,e))return!0}return!1}static removeAccents(s){return s&&(s=s.normalize("NFKD").replace(new RegExp("\\p{Diacritic}","gu"),"")),s}static isDate(s){return Object.prototype.toString.call(s)==="[object Date]"}static isEmpty(s){return s==null||s===""||Array.isArray(s)&&s.length===0||!this.isDate(s)&&typeof s=="object"&&Object.keys(s).length===0}static isNotEmpty(s){return!this.isEmpty(s)}static compare(s,t,e,i=1){let r=-1,a=this.isEmpty(s),o=this.isEmpty(t);return a&&o?r=0:a?r=i:o?r=-i:typeof s=="string"&&typeof t=="string"?r=s.localeCompare(t,e,{numeric:!0}):r=s<t?-1:s>t?1:0,r}static sort(s,t,e=1,i,r=1){let a=n.compare(s,t,i,e),o=e;return(n.isEmpty(s)||n.isEmpty(t))&&(o=r===1?e:r),o*a}static merge(s,t){if(!(s==null&&t==null)){{if((s==null||typeof s=="object")&&(t==null||typeof t=="object"))return A(A({},s||{}),t||{});if((s==null||typeof s=="string")&&(t==null||typeof t=="string"))return[s||"",t||""].join(" ")}return t||s}}static isPrintableCharacter(s=""){return this.isNotEmpty(s)&&s.length===1&&s.match(/\S| /)}static getItemValue(s,...t){return this.isFunction(s)?s(...t):s}static findLastIndex(s,t){let e=-1;if(this.isNotEmpty(s))try{e=s.findLastIndex(t)}catch{e=s.lastIndexOf([...s].reverse().find(t))}return e}static findLast(s,t){let e;if(this.isNotEmpty(s))try{e=s.findLast(t)}catch{e=[...s].reverse().find(t)}return e}static deepEquals(s,t){if(s===t)return!0;if(s&&t&&typeof s=="object"&&typeof t=="object"){var e=Array.isArray(s),i=Array.isArray(t),r,a,o;if(e&&i){if(a=s.length,a!=t.length)return!1;for(r=a;r--!==0;)if(!this.deepEquals(s[r],t[r]))return!1;return!0}if(e!=i)return!1;var l=s instanceof Date,f=t instanceof Date;if(l!=f)return!1;if(l&&f)return s.getTime()==t.getTime();var c=s instanceof RegExp,p=t instanceof RegExp;if(c!=p)return!1;if(c&&p)return s.toString()==t.toString();var h=Object.keys(s);if(a=h.length,a!==Object.keys(t).length)return!1;for(r=a;r--!==0;)if(!Object.prototype.hasOwnProperty.call(t,h[r]))return!1;for(r=a;r--!==0;)if(o=h[r],!this.deepEquals(s[o],t[o]))return!1;return!0}return s!==s&&t!==t}},X=0;function It(n="pn_id_"){return X++,`${n}${X}`}function st(){let n=[],s=(r,a)=>{let o=n.length>0?n[n.length-1]:{key:r,value:a},l=o.value+(o.key===r?0:a)+2;return n.push({key:r,value:l}),l},t=r=>{n=n.filter(a=>a.value!==r)},e=()=>n.length>0?n[n.length-1].value:0,i=r=>r&&parseInt(r.style.zIndex,10)||0;return{get:i,set:(r,a,o)=>{a&&(a.style.zIndex=String(s(r,o)))},clear:r=>{r&&(t(i(r)),r.style.zIndex="")},getCurrent:()=>e()}}var _t=st();var j=["*"],rt=function(n){return n[n.ACCEPT=0]="ACCEPT",n[n.REJECT=1]="REJECT",n[n.CANCEL=2]="CANCEL",n}(rt||{}),Ut=(()=>{class n{requireConfirmationSource=new y;acceptConfirmationSource=new y;requireConfirmation$=this.requireConfirmationSource.asObservable();accept=this.acceptConfirmationSource.asObservable();confirm(t){return this.requireConfirmationSource.next(t),this}close(){return this.requireConfirmationSource.next(null),this}onAccept(){this.acceptConfirmationSource.next(null)}static \u0275fac=function(e){return new(e||n)};static \u0275prov=T({token:n,factory:n.\u0275fac})}return n})();var d=(()=>{class n{static STARTS_WITH="startsWith";static CONTAINS="contains";static NOT_CONTAINS="notContains";static ENDS_WITH="endsWith";static EQUALS="equals";static NOT_EQUALS="notEquals";static IN="in";static LESS_THAN="lt";static LESS_THAN_OR_EQUAL_TO="lte";static GREATER_THAN="gt";static GREATER_THAN_OR_EQUAL_TO="gte";static BETWEEN="between";static IS="is";static IS_NOT="isNot";static BEFORE="before";static AFTER="after";static DATE_IS="dateIs";static DATE_IS_NOT="dateIsNot";static DATE_BEFORE="dateBefore";static DATE_AFTER="dateAfter"}return n})();var kt=(()=>{class n{filter(t,e,i,r,a){let o=[];if(t)for(let l of t)for(let f of e){let c=u.resolveFieldData(l,f);if(this.filters[r](c,i,a)){o.push(l);break}}return o}filters={startsWith:(t,e,i)=>{if(e==null||e.trim()==="")return!0;if(t==null)return!1;let r=u.removeAccents(e.toString()).toLocaleLowerCase(i);return u.removeAccents(t.toString()).toLocaleLowerCase(i).slice(0,r.length)===r},contains:(t,e,i)=>{if(e==null||typeof e=="string"&&e.trim()==="")return!0;if(t==null)return!1;let r=u.removeAccents(e.toString()).toLocaleLowerCase(i);return u.removeAccents(t.toString()).toLocaleLowerCase(i).indexOf(r)!==-1},notContains:(t,e,i)=>{if(e==null||typeof e=="string"&&e.trim()==="")return!0;if(t==null)return!1;let r=u.removeAccents(e.toString()).toLocaleLowerCase(i);return u.removeAccents(t.toString()).toLocaleLowerCase(i).indexOf(r)===-1},endsWith:(t,e,i)=>{if(e==null||e.trim()==="")return!0;if(t==null)return!1;let r=u.removeAccents(e.toString()).toLocaleLowerCase(i),a=u.removeAccents(t.toString()).toLocaleLowerCase(i);return a.indexOf(r,a.length-r.length)!==-1},equals:(t,e,i)=>e==null||typeof e=="string"&&e.trim()===""?!0:t==null?!1:t.getTime&&e.getTime?t.getTime()===e.getTime():t==e?!0:u.removeAccents(t.toString()).toLocaleLowerCase(i)==u.removeAccents(e.toString()).toLocaleLowerCase(i),notEquals:(t,e,i)=>e==null||typeof e=="string"&&e.trim()===""?!1:t==null?!0:t.getTime&&e.getTime?t.getTime()!==e.getTime():t==e?!1:u.removeAccents(t.toString()).toLocaleLowerCase(i)!=u.removeAccents(e.toString()).toLocaleLowerCase(i),in:(t,e)=>{if(e==null||e.length===0)return!0;for(let i=0;i<e.length;i++)if(u.equals(t,e[i]))return!0;return!1},between:(t,e)=>e==null||e[0]==null||e[1]==null?!0:t==null?!1:t.getTime?e[0].getTime()<=t.getTime()&&t.getTime()<=e[1].getTime():e[0]<=t&&t<=e[1],lt:(t,e,i)=>e==null?!0:t==null?!1:t.getTime&&e.getTime?t.getTime()<e.getTime():t<e,lte:(t,e,i)=>e==null?!0:t==null?!1:t.getTime&&e.getTime?t.getTime()<=e.getTime():t<=e,gt:(t,e,i)=>e==null?!0:t==null?!1:t.getTime&&e.getTime?t.getTime()>e.getTime():t>e,gte:(t,e,i)=>e==null?!0:t==null?!1:t.getTime&&e.getTime?t.getTime()>=e.getTime():t>=e,is:(t,e,i)=>this.filters.equals(t,e,i),isNot:(t,e,i)=>this.filters.notEquals(t,e,i),before:(t,e,i)=>this.filters.lt(t,e,i),after:(t,e,i)=>this.filters.gt(t,e,i),dateIs:(t,e)=>e==null?!0:t==null?!1:t.toDateString()===e.toDateString(),dateIsNot:(t,e)=>e==null?!0:t==null?!1:t.toDateString()!==e.toDateString(),dateBefore:(t,e)=>e==null?!0:t==null?!1:t.getTime()<e.getTime(),dateAfter:(t,e)=>e==null?!0:t==null?!1:(t.setHours(0,0,0,0),t.getTime()>e.getTime())};register(t,e){this.filters[t]=e}static \u0275fac=function(e){return new(e||n)};static \u0275prov=T({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),Bt=(()=>{class n{messageSource=new y;clearSource=new y;messageObserver=this.messageSource.asObservable();clearObserver=this.clearSource.asObservable();add(t){t&&this.messageSource.next(t)}addAll(t){t&&t.length&&this.messageSource.next(t)}clear(t){this.clearSource.next(t||null)}static \u0275fac=function(e){return new(e||n)};static \u0275prov=T({token:n,factory:n.\u0275fac})}return n})(),Gt=(()=>{class n{clickSource=new y;clickObservable=this.clickSource.asObservable();add(t){t&&this.clickSource.next(t)}static \u0275fac=function(e){return new(e||n)};static \u0275prov=T({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var Vt=(()=>{class n{ripple=!1;inputStyle=$("outlined");overlayOptions={};filterMatchModeOptions={text:[d.STARTS_WITH,d.CONTAINS,d.NOT_CONTAINS,d.ENDS_WITH,d.EQUALS,d.NOT_EQUALS],numeric:[d.EQUALS,d.NOT_EQUALS,d.LESS_THAN,d.LESS_THAN_OR_EQUAL_TO,d.GREATER_THAN,d.GREATER_THAN_OR_EQUAL_TO],date:[d.DATE_IS,d.DATE_IS_NOT,d.DATE_BEFORE,d.DATE_AFTER]};translation={startsWith:"Starts with",contains:"Contains",notContains:"Not contains",endsWith:"Ends with",equals:"Equals",notEquals:"Not equals",noFilter:"No Filter",lt:"Less than",lte:"Less than or equal to",gt:"Greater than",gte:"Greater than or equal to",is:"Is",isNot:"Is not",before:"Before",after:"After",dateIs:"Date is",dateIsNot:"Date is not",dateBefore:"Date is before",dateAfter:"Date is after",clear:"Clear",apply:"Apply",matchAll:"Match All",matchAny:"Match Any",addRule:"Add Rule",removeRule:"Remove Rule",accept:"Yes",reject:"No",choose:"Choose",upload:"Upload",cancel:"Cancel",pending:"Pending",fileSizeTypes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],chooseYear:"Choose Year",chooseMonth:"Choose Month",chooseDate:"Choose Date",prevDecade:"Previous Decade",nextDecade:"Next Decade",prevYear:"Previous Year",nextYear:"Next Year",prevMonth:"Previous Month",nextMonth:"Next Month",prevHour:"Previous Hour",nextHour:"Next Hour",prevMinute:"Previous Minute",nextMinute:"Next Minute",prevSecond:"Previous Second",nextSecond:"Next Second",am:"am",pm:"pm",dateFormat:"mm/dd/yy",firstDayOfWeek:0,today:"Today",weekHeader:"Wk",weak:"Weak",medium:"Medium",strong:"Strong",passwordPrompt:"Enter a password",emptyMessage:"No results found",searchMessage:"{0} results are available",selectionMessage:"{0} items selected",emptySelectionMessage:"No selected item",emptySearchMessage:"No results found",emptyFilterMessage:"No results found",aria:{trueLabel:"True",falseLabel:"False",nullLabel:"Not Selected",star:"1 star",stars:"{star} stars",selectAll:"All items selected",unselectAll:"All items unselected",close:"Close",previous:"Previous",next:"Next",navigation:"Navigation",scrollTop:"Scroll Top",moveTop:"Move Top",moveUp:"Move Up",moveDown:"Move Down",moveBottom:"Move Bottom",moveToTarget:"Move to Target",moveToSource:"Move to Source",moveAllToTarget:"Move All to Target",moveAllToSource:"Move All to Source",pageLabel:"{page}",firstPageLabel:"First Page",lastPageLabel:"Last Page",nextPageLabel:"Next Page",prevPageLabel:"Previous Page",rowsPerPageLabel:"Rows per page",previousPageLabel:"Previous Page",jumpToPageDropdownLabel:"Jump to Page Dropdown",jumpToPageInputLabel:"Jump to Page Input",selectRow:"Row Selected",unselectRow:"Row Unselected",expandRow:"Row Expanded",collapseRow:"Row Collapsed",showFilterMenu:"Show Filter Menu",hideFilterMenu:"Hide Filter Menu",filterOperator:"Filter Operator",filterConstraint:"Filter Constraint",editRow:"Row Edit",saveEdit:"Save Edit",cancelEdit:"Cancel Edit",listView:"List View",gridView:"Grid View",slide:"Slide",slideNumber:"{slideNumber}",zoomImage:"Zoom Image",zoomIn:"Zoom In",zoomOut:"Zoom Out",rotateRight:"Rotate Right",rotateLeft:"Rotate Left",listLabel:"Option List",selectColor:"Select a color",removeLabel:"Remove",browseFiles:"Browse Files",maximizeLabel:"Maximize"}};zIndex={modal:1100,overlay:1e3,menu:1e3,tooltip:1100};translationSource=new y;translationObserver=this.translationSource.asObservable();getTranslation(t){return this.translation[t]}setTranslation(t){this.translation=A(A({},this.translation),t),this.translationSource.next(this.translation)}static \u0275fac=function(e){return new(e||n)};static \u0275prov=T({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),zt=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=M({type:n,selectors:[["p-header"]],ngContentSelectors:j,decls:1,vars:0,template:function(e,i){e&1&&(F(),x(0))},encapsulation:2})}return n})(),Kt=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=M({type:n,selectors:[["p-footer"]],ngContentSelectors:j,decls:1,vars:0,template:function(e,i){e&1&&(F(),x(0))},encapsulation:2})}return n})(),qt=(()=>{class n{template;type;name;constructor(t){this.template=t}getType(){return this.name}static \u0275fac=function(e){return new(e||n)(q(Y))};static \u0275dir=K({type:n,selectors:[["","pTemplate",""]],inputs:{type:"type",name:[V.None,"pTemplate","name"]}})}return n})(),Yt=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=z({type:n});static \u0275inj=B({imports:[Q]})}return n})(),$t=(()=>{class n{static STARTS_WITH="startsWith";static CONTAINS="contains";static NOT_CONTAINS="notContains";static ENDS_WITH="endsWith";static EQUALS="equals";static NOT_EQUALS="notEquals";static NO_FILTER="noFilter";static LT="lt";static LTE="lte";static GT="gt";static GTE="gte";static IS="is";static IS_NOT="isNot";static BEFORE="before";static AFTER="after";static CLEAR="clear";static APPLY="apply";static MATCH_ALL="matchAll";static MATCH_ANY="matchAny";static ADD_RULE="addRule";static REMOVE_RULE="removeRule";static ACCEPT="accept";static REJECT="reject";static CHOOSE="choose";static UPLOAD="upload";static CANCEL="cancel";static PENDING="pending";static FILE_SIZE_TYPES="fileSizeTypes";static DAY_NAMES="dayNames";static DAY_NAMES_SHORT="dayNamesShort";static DAY_NAMES_MIN="dayNamesMin";static MONTH_NAMES="monthNames";static MONTH_NAMES_SHORT="monthNamesShort";static FIRST_DAY_OF_WEEK="firstDayOfWeek";static TODAY="today";static WEEK_HEADER="weekHeader";static WEAK="weak";static MEDIUM="medium";static STRONG="strong";static PASSWORD_PROMPT="passwordPrompt";static EMPTY_MESSAGE="emptyMessage";static EMPTY_FILTER_MESSAGE="emptyFilterMessage";static SHOW_FILTER_MENU="showFilterMenu";static HIDE_FILTER_MENU="hideFilterMenu";static SELECTION_MESSAGE="selectionMessage";static ARIA="aria";static SELECT_COLOR="selectColor";static BROWSE_FILES="browseFiles"}return n})();var nt=(()=>{class n{static zindex=1e3;static calculatedScrollbarWidth=null;static calculatedScrollbarHeight=null;static browser;static addClass(t,e){t&&e&&(t.classList?t.classList.add(e):t.className+=" "+e)}static addMultipleClasses(t,e){if(t&&e)if(t.classList){let i=e.trim().split(" ");for(let r=0;r<i.length;r++)t.classList.add(i[r])}else{let i=e.split(" ");for(let r=0;r<i.length;r++)t.className+=" "+i[r]}}static removeClass(t,e){t&&e&&(t.classList?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," "))}static removeMultipleClasses(t,e){t&&e&&[e].flat().filter(Boolean).forEach(i=>i.split(" ").forEach(r=>this.removeClass(t,r)))}static hasClass(t,e){return t&&e?t.classList?t.classList.contains(e):new RegExp("(^| )"+e+"( |$)","gi").test(t.className):!1}static siblings(t){return Array.prototype.filter.call(t.parentNode.children,function(e){return e!==t})}static find(t,e){return Array.from(t.querySelectorAll(e))}static findSingle(t,e){return this.isElement(t)?t.querySelector(e):null}static index(t){let e=t.parentNode.childNodes,i=0;for(var r=0;r<e.length;r++){if(e[r]==t)return i;e[r].nodeType==1&&i++}return-1}static indexWithinGroup(t,e){let i=t.parentNode?t.parentNode.childNodes:[],r=0;for(var a=0;a<i.length;a++){if(i[a]==t)return r;i[a].attributes&&i[a].attributes[e]&&i[a].nodeType==1&&r++}return-1}static appendOverlay(t,e,i="self"){i!=="self"&&t&&e&&this.appendChild(t,e)}static alignOverlay(t,e,i="self",r=!0){t&&e&&(r&&(t.style.minWidth=`${n.getOuterWidth(e)}px`),i==="self"?this.relativePosition(t,e):this.absolutePosition(t,e))}static relativePosition(t,e,i=!0){let r=w=>{if(w)return getComputedStyle(w).getPropertyValue("position")==="relative"?w:r(w.parentElement)},a=t.offsetParent?{width:t.offsetWidth,height:t.offsetHeight}:this.getHiddenElementDimensions(t),o=e.offsetHeight,l=e.getBoundingClientRect(),f=this.getWindowScrollTop(),c=this.getWindowScrollLeft(),p=this.getViewport(),g=r(t)?.getBoundingClientRect()||{top:-1*f,left:-1*c},m,S;l.top+o+a.height>p.height?(m=l.top-g.top-a.height,t.style.transformOrigin="bottom",l.top+m<0&&(m=-1*l.top)):(m=o+l.top-g.top,t.style.transformOrigin="top");let H=l.left+a.width-p.width,et=l.left-g.left;a.width>p.width?S=(l.left-g.left)*-1:H>0?S=et-H:S=l.left-g.left,t.style.top=m+"px",t.style.left=S+"px",i&&(t.style.marginTop=origin==="bottom"?"calc(var(--p-anchor-gutter) * -1)":"calc(var(--p-anchor-gutter))")}static absolutePosition(t,e,i=!0){let r=t.offsetParent?{width:t.offsetWidth,height:t.offsetHeight}:this.getHiddenElementDimensions(t),a=r.height,o=r.width,l=e.offsetHeight,f=e.offsetWidth,c=e.getBoundingClientRect(),p=this.getWindowScrollTop(),h=this.getWindowScrollLeft(),g=this.getViewport(),m,S;c.top+l+a>g.height?(m=c.top+p-a,t.style.transformOrigin="bottom",m<0&&(m=p)):(m=l+c.top+p,t.style.transformOrigin="top"),c.left+o>g.width?S=Math.max(0,c.left+h+f-o):S=c.left+h,t.style.top=m+"px",t.style.left=S+"px",i&&(t.style.marginTop=origin==="bottom"?"calc(var(--p-anchor-gutter) * -1)":"calc(var(--p-anchor-gutter))")}static getParents(t,e=[]){return t.parentNode===null?e:this.getParents(t.parentNode,e.concat([t.parentNode]))}static getScrollableParents(t){let e=[];if(t){let i=this.getParents(t),r=/(auto|scroll)/,a=o=>{let l=window.getComputedStyle(o,null);return r.test(l.getPropertyValue("overflow"))||r.test(l.getPropertyValue("overflowX"))||r.test(l.getPropertyValue("overflowY"))};for(let o of i){let l=o.nodeType===1&&o.dataset.scrollselectors;if(l){let f=l.split(",");for(let c of f){let p=this.findSingle(o,c);p&&a(p)&&e.push(p)}}o.nodeType!==9&&a(o)&&e.push(o)}}return e}static getHiddenElementOuterHeight(t){t.style.visibility="hidden",t.style.display="block";let e=t.offsetHeight;return t.style.display="none",t.style.visibility="visible",e}static getHiddenElementOuterWidth(t){t.style.visibility="hidden",t.style.display="block";let e=t.offsetWidth;return t.style.display="none",t.style.visibility="visible",e}static getHiddenElementDimensions(t){let e={};return t.style.visibility="hidden",t.style.display="block",e.width=t.offsetWidth,e.height=t.offsetHeight,t.style.display="none",t.style.visibility="visible",e}static scrollInView(t,e){let i=getComputedStyle(t).getPropertyValue("borderTopWidth"),r=i?parseFloat(i):0,a=getComputedStyle(t).getPropertyValue("paddingTop"),o=a?parseFloat(a):0,l=t.getBoundingClientRect(),c=e.getBoundingClientRect().top+document.body.scrollTop-(l.top+document.body.scrollTop)-r-o,p=t.scrollTop,h=t.clientHeight,g=this.getOuterHeight(e);c<0?t.scrollTop=p+c:c+g>h&&(t.scrollTop=p+c-h+g)}static fadeIn(t,e){t.style.opacity=0;let i=+new Date,r=0,a=function(){r=+t.style.opacity.replace(",",".")+(new Date().getTime()-i)/e,t.style.opacity=r,i=+new Date,+r<1&&(window.requestAnimationFrame&&requestAnimationFrame(a)||setTimeout(a,16))};a()}static fadeOut(t,e){var i=1,r=50,a=e,o=r/a;let l=setInterval(()=>{i=i-o,i<=0&&(i=0,clearInterval(l)),t.style.opacity=i},r)}static getWindowScrollTop(){let t=document.documentElement;return(window.pageYOffset||t.scrollTop)-(t.clientTop||0)}static getWindowScrollLeft(){let t=document.documentElement;return(window.pageXOffset||t.scrollLeft)-(t.clientLeft||0)}static matches(t,e){var i=Element.prototype,r=i.matches||i.webkitMatchesSelector||i.mozMatchesSelector||i.msMatchesSelector||function(a){return[].indexOf.call(document.querySelectorAll(a),this)!==-1};return r.call(t,e)}static getOuterWidth(t,e){let i=t.offsetWidth;if(e){let r=getComputedStyle(t);i+=parseFloat(r.marginLeft)+parseFloat(r.marginRight)}return i}static getHorizontalPadding(t){let e=getComputedStyle(t);return parseFloat(e.paddingLeft)+parseFloat(e.paddingRight)}static getHorizontalMargin(t){let e=getComputedStyle(t);return parseFloat(e.marginLeft)+parseFloat(e.marginRight)}static innerWidth(t){let e=t.offsetWidth,i=getComputedStyle(t);return e+=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),e}static width(t){let e=t.offsetWidth,i=getComputedStyle(t);return e-=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),e}static getInnerHeight(t){let e=t.offsetHeight,i=getComputedStyle(t);return e+=parseFloat(i.paddingTop)+parseFloat(i.paddingBottom),e}static getOuterHeight(t,e){let i=t.offsetHeight;if(e){let r=getComputedStyle(t);i+=parseFloat(r.marginTop)+parseFloat(r.marginBottom)}return i}static getHeight(t){let e=t.offsetHeight,i=getComputedStyle(t);return e-=parseFloat(i.paddingTop)+parseFloat(i.paddingBottom)+parseFloat(i.borderTopWidth)+parseFloat(i.borderBottomWidth),e}static getWidth(t){let e=t.offsetWidth,i=getComputedStyle(t);return e-=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight)+parseFloat(i.borderLeftWidth)+parseFloat(i.borderRightWidth),e}static getViewport(){let t=window,e=document,i=e.documentElement,r=e.getElementsByTagName("body")[0],a=t.innerWidth||i.clientWidth||r.clientWidth,o=t.innerHeight||i.clientHeight||r.clientHeight;return{width:a,height:o}}static getOffset(t){var e=t.getBoundingClientRect();return{top:e.top+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0),left:e.left+(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0)}}static replaceElementWith(t,e){let i=t.parentNode;if(!i)throw"Can't replace element";return i.replaceChild(e,t)}static getUserAgent(){if(navigator&&this.isClient())return navigator.userAgent}static isIE(){var t=window.navigator.userAgent,e=t.indexOf("MSIE ");if(e>0)return!0;var i=t.indexOf("Trident/");if(i>0){var r=t.indexOf("rv:");return!0}var a=t.indexOf("Edge/");return a>0}static isIOS(){return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream}static isAndroid(){return/(android)/i.test(navigator.userAgent)}static isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}static appendChild(t,e){if(this.isElement(e))e.appendChild(t);else if(e&&e.el&&e.el.nativeElement)e.el.nativeElement.appendChild(t);else throw"Cannot append "+e+" to "+t}static removeChild(t,e){if(this.isElement(e))e.removeChild(t);else if(e.el&&e.el.nativeElement)e.el.nativeElement.removeChild(t);else throw"Cannot remove "+t+" from "+e}static removeElement(t){"remove"in Element.prototype?t.remove():t.parentNode.removeChild(t)}static isElement(t){return typeof HTMLElement=="object"?t instanceof HTMLElement:t&&typeof t=="object"&&t!==null&&t.nodeType===1&&typeof t.nodeName=="string"}static calculateScrollbarWidth(t){if(t){let e=getComputedStyle(t);return t.offsetWidth-t.clientWidth-parseFloat(e.borderLeftWidth)-parseFloat(e.borderRightWidth)}else{if(this.calculatedScrollbarWidth!==null)return this.calculatedScrollbarWidth;let e=document.createElement("div");e.className="p-scrollbar-measure",document.body.appendChild(e);let i=e.offsetWidth-e.clientWidth;return document.body.removeChild(e),this.calculatedScrollbarWidth=i,i}}static calculateScrollbarHeight(){if(this.calculatedScrollbarHeight!==null)return this.calculatedScrollbarHeight;let t=document.createElement("div");t.className="p-scrollbar-measure",document.body.appendChild(t);let e=t.offsetHeight-t.clientHeight;return document.body.removeChild(t),this.calculatedScrollbarWidth=e,e}static invokeElementMethod(t,e,i){t[e].apply(t,i)}static clearSelection(){if(window.getSelection)window.getSelection().empty?window.getSelection().empty():window.getSelection().removeAllRanges&&window.getSelection().rangeCount>0&&window.getSelection().getRangeAt(0).getClientRects().length>0&&window.getSelection().removeAllRanges();else if(document.selection&&document.selection.empty)try{document.selection.empty()}catch{}}static getBrowser(){if(!this.browser){let t=this.resolveUserAgent();this.browser={},t.browser&&(this.browser[t.browser]=!0,this.browser.version=t.version),this.browser.chrome?this.browser.webkit=!0:this.browser.webkit&&(this.browser.safari=!0)}return this.browser}static resolveUserAgent(){let t=navigator.userAgent.toLowerCase(),e=/(chrome)[ \/]([\w.]+)/.exec(t)||/(webkit)[ \/]([\w.]+)/.exec(t)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t)||/(msie) ([\w.]+)/.exec(t)||t.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t)||[];return{browser:e[1]||"",version:e[2]||"0"}}static isInteger(t){return Number.isInteger?Number.isInteger(t):typeof t=="number"&&isFinite(t)&&Math.floor(t)===t}static isHidden(t){return!t||t.offsetParent===null}static isVisible(t){return t&&t.offsetParent!=null}static isExist(t){return t!==null&&typeof t<"u"&&t.nodeName&&t.parentNode}static focus(t,e){t&&document.activeElement!==t&&t.focus(e)}static getFocusableSelectorString(t=""){return`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        .p-inputtext:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        .p-button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`}static getFocusableElements(t,e=""){let i=this.find(t,this.getFocusableSelectorString(e)),r=[];for(let a of i){let o=getComputedStyle(a);this.isVisible(a)&&o.display!="none"&&o.visibility!="hidden"&&r.push(a)}return r}static getFocusableElement(t,e=""){let i=this.findSingle(t,this.getFocusableSelectorString(e));if(i){let r=getComputedStyle(i);if(this.isVisible(i)&&r.display!="none"&&r.visibility!="hidden")return i}return null}static getFirstFocusableElement(t,e){let i=this.getFocusableElements(t,e);return i.length>0?i[0]:null}static getLastFocusableElement(t,e){let i=this.getFocusableElements(t,e);return i.length>0?i[i.length-1]:null}static getNextFocusableElement(t,e=!1){let i=n.getFocusableElements(t),r=0;if(i&&i.length>0){let a=i.indexOf(i[0].ownerDocument.activeElement);e?a==-1||a===0?r=i.length-1:r=a-1:a!=-1&&a!==i.length-1&&(r=a+1)}return i[r]}static generateZIndex(){return this.zindex=this.zindex||999,++this.zindex}static getSelection(){return window.getSelection?window.getSelection().toString():document.getSelection?document.getSelection().toString():document.selection?document.selection.createRange().text:null}static getTargetElement(t,e){if(!t)return null;switch(t){case"document":return document;case"window":return window;case"@next":return e?.nextElementSibling;case"@prev":return e?.previousElementSibling;case"@parent":return e?.parentElement;case"@grandparent":return e?.parentElement.parentElement;default:let i=typeof t;if(i==="string")return document.querySelector(t);if(i==="object"&&t.hasOwnProperty("nativeElement"))return this.isExist(t.nativeElement)?t.nativeElement:void 0;let a=(o=>!!(o&&o.constructor&&o.call&&o.apply))(t)?t():t;return a&&a.nodeType===9||this.isExist(a)?a:null}}static isClient(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}static getAttribute(t,e){if(t){let i=t.getAttribute(e);return isNaN(i)?i==="true"||i==="false"?i==="true":i:+i}}static calculateBodyScrollbarWidth(){return window.innerWidth-document.documentElement.offsetWidth}static blockBodyScroll(t="p-overflow-hidden"){document.body.style.setProperty("--scrollbar-width",this.calculateBodyScrollbarWidth()+"px"),this.addClass(document.body,t)}static unblockBodyScroll(t="p-overflow-hidden"){document.body.style.removeProperty("--scrollbar-width"),this.removeClass(document.body,t)}}return n})(),tt=class{element;listener;scrollableParents;constructor(s,t=()=>{}){this.element=s,this.listener=t}bindScrollListener(){this.scrollableParents=nt.getScrollableParents(this.element);for(let s=0;s<this.scrollableParents.length;s++)this.scrollableParents[s].addEventListener("scroll",this.listener)}unbindScrollListener(){if(this.scrollableParents)for(let s=0;s<this.scrollableParents.length;s++)this.scrollableParents[s].removeEventListener("scroll",this.listener)}destroy(){this.unbindScrollListener(),this.element=null,this.listener=null,this.scrollableParents=null}};export{u as a,It as b,_t as c,rt as d,Ut as e,kt as f,Bt as g,Gt as h,Vt as i,zt as j,Kt as k,qt as l,Yt as m,$t as n,nt as o,tt as p,J as q,E as r,Rt as s};
