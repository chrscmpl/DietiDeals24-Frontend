import{o as j}from"./chunk-27INX3PV.js";import{B as d,D as b,F as y,N as g,O as h,Oa as M,Qa as S,W as l,Z as v,_ as x,ba as E,ca as I,ha as a,j as m,l as f,lb as u,ma as r,q as w,u as c}from"./chunk-I3PUZZLM.js";var p;try{p=typeof Intl<"u"&&Intl.v8BreakIterator}catch{p=!1}var N=(()=>{let t=class t{constructor(i){this._platformId=i,this.isBrowser=this._platformId?j(this._platformId):typeof document=="object"&&!!document,this.EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent),this.TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent),this.BLINK=this.isBrowser&&!!(window.chrome||p)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT,this.WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT,this.IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window),this.FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent),this.ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT,this.SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT}};t.\u0275fac=function(o){return new(o||t)(r(M))},t.\u0275prov=a({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();var T=new Set,s,R=(()=>{let t=class t{constructor(i,o){this._platform=i,this._nonce=o,this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):F}matchMedia(i){return(this._platform.WEBKIT||this._platform.BLINK)&&O(i,this._nonce),this._matchMedia(i)}};t.\u0275fac=function(o){return new(o||t)(r(N),r(S,8))},t.\u0275prov=a({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();function O(e,t){if(!T.has(e))try{s||(s=document.createElement("style"),t&&s.setAttribute("nonce",t),s.setAttribute("type","text/css"),document.head.appendChild(s)),s.sheet&&(s.sheet.insertRule(`@media ${e} {body{ }}`,0),T.add(e))}catch(L){console.error(L)}}function F(e){return{matches:e==="all"||e==="",media:e,addListener:()=>{},removeListener:()=>{}}}var X=(()=>{let t=class t{constructor(i,o){this.mediaMatcher=i,this.zone=o,this.maxHeight=window.innerHeight,this.matchMobile=this.mediaMatcher.matchMedia("(max-width: 768px)"),this.throttledResize$=new m,this.isSidebarVisible=!1,this.UIhiddenSUbject=new f,this.UIhidden$=this.UIhiddenSUbject.asObservable().pipe(h()),this.isMobile$=d(this.matchMobile,"change").pipe(c(n=>n.matches),v(this.matchMobile.matches),l(1)),this.isVirtualKeyboardShown$=b(d(document.body,"focus",{capture:!0,passive:!0}),d(document.body,"blur",{capture:!0,passive:!0}),this.throttledResize$.pipe(c(()=>window.innerHeight<this.maxHeight-100))).pipe(I(this.isMobile$),y(([n,A])=>A),c(([n])=>typeof n=="boolean"?n:n.type==="focus"&&n?.target?.matches?.("input, textarea, select")&&!["checkbox","radio"].includes(n?.target?.getAttribute("type")??"")),h(),x(n=>w(n).pipe(g(n?0:50))),l(1)),this.UIhiddenSUbject.next(!0),this.initStyles(),this.zone.runOutsideAngular(()=>{d(window,"resize").pipe(E(1e3)).subscribe(()=>{this.zone.run(()=>{window.innerHeight>this.maxHeight&&(this.maxHeight=window.innerHeight),this.throttledResize$.next()})})})}setUIvisibility(i){this.UIhiddenSUbject.next(!i)}confirmReload(i){i?window.onbeforeunload=o=>{let n="Are you sure you want to leave?";return o.returnValue=n,n}:window.onbeforeunload!==null&&(window.onbeforeunload=null)}setSmoothScrolling(i){i?document.documentElement.classList.add("dd24-smooth-scroll"):document.documentElement.classList.remove("dd24-smooth-scroll")}initStyles(){this.styles=document.createElement("style"),this.styles.innerHTML=".dd24-smooth-scroll {scroll-behavior: smooth;}",document.head.appendChild(this.styles)}};t.\u0275fac=function(o){return new(o||t)(r(R),r(u))},t.\u0275prov=a({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();export{R as a,X as b};