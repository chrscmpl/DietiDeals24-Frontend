import{o as I}from"./chunk-27INX3PV.js";import{B as a,D as f,N as w,O as c,Oa as v,Qa as g,W as l,Z as b,_ as y,ha as s,l as p,ma as o,q as m,u as d}from"./chunk-I3PUZZLM.js";var h;try{h=typeof Intl<"u"&&Intl.v8BreakIterator}catch{h=!1}var x=(()=>{let t=class t{constructor(n){this._platformId=n,this.isBrowser=this._platformId?I(this._platformId):typeof document=="object"&&!!document,this.EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent),this.TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent),this.BLINK=this.isBrowser&&!!(window.chrome||h)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT,this.WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT,this.IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window),this.FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent),this.ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT,this.SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT}};t.\u0275fac=function(i){return new(i||t)(o(v))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();var S=new Set,r,M=(()=>{let t=class t{constructor(n,i){this._platform=n,this._nonce=i,this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):R}matchMedia(n){return(this._platform.WEBKIT||this._platform.BLINK)&&L(n,this._nonce),this._matchMedia(n)}};t.\u0275fac=function(i){return new(i||t)(o(x),o(g,8))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();function L(e,t){if(!S.has(e))try{r||(r=document.createElement("style"),t&&r.setAttribute("nonce",t),r.setAttribute("type","text/css"),document.head.appendChild(r)),r.sheet&&(r.sheet.insertRule(`@media ${e} {body{ }}`,0),S.add(e))}catch(j){console.error(j)}}function R(e){return{matches:e==="all"||e==="",media:e,addListener:()=>{},removeListener:()=>{}}}var G=(()=>{let t=class t{constructor(n){this.mediaMatcher=n,this.matchMobile=this.mediaMatcher.matchMedia("(max-width: 768px)"),this.isSidebarVisible=!1,this.UIhiddenSUbject=new p,this.UIhidden$=this.UIhiddenSUbject.asObservable().pipe(c()),this.isMobile$=a(this.matchMobile,"change").pipe(d(i=>i.matches),b(this.matchMobile.matches),l(1)),this.isVirtualKeyboardShownVKAPI$=this.getVirtualKeyboard()?a(this.getVirtualKeyboard(),"geometrychange").pipe(d(i=>!!i.height)):null,this.isVirtualKeyboardShownFallback$=f(a(document.body,"focus",{capture:!0,passive:!0}),a(document.body,"blur",{capture:!0,passive:!0})).pipe(d(i=>i.type==="focus"&&i?.target?.matches?.("input, textarea, select"))),this.isVirtualKeyboardShown$=(this.isVirtualKeyboardShownVKAPI$??this.isVirtualKeyboardShownFallback$).pipe(c(),y(i=>m(i).pipe(w(i?0:50))),l(1)),this.UIhiddenSUbject.next(!0),this.initStyles(),alert(this.getVirtualKeyboard())}setUIvisibility(n){this.UIhiddenSUbject.next(!n)}confirmReload(n){n?window.onbeforeunload=i=>{let u="Are you sure you want to leave?";return i.returnValue=u,u}:window.onbeforeunload!==null&&(window.onbeforeunload=null)}setSmoothScrolling(n){n?document.documentElement.classList.add("dd24-smooth-scroll"):document.documentElement.classList.remove("dd24-smooth-scroll")}initStyles(){this.styles=document.createElement("style"),this.styles.innerHTML=".dd24-smooth-scroll {scroll-behavior: smooth;}",document.head.appendChild(this.styles)}getVirtualKeyboard(){return window.navigator.virtualKeyboard}};t.\u0275fac=function(i){return new(i||t)(o(M))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();export{M as a,G as b};
