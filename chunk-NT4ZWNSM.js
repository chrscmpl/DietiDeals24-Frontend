import{d as A,e as B}from"./chunk-V2PBDCB4.js";import{b as $}from"./chunk-X66OMNMQ.js";import{q as L,r as V}from"./chunk-AR6ESCK6.js";import"./chunk-2CJT4ORM.js";import{B as H,J as I,K as E,j as z}from"./chunk-6MRKP2W7.js";import{$b as y,Ca as b,Da as f,Eb as g,Ja as S,Jb as l,Kb as r,Lb as d,N as M,Pb as _,Sb as h,Tb as u,W as w,Z as x,aa as O,bc as R,eb as m,fb as o,ic as j,kb as T,lb as k,rc as p,sa as P,sc as s,u as C,ub as v}from"./chunk-I3PUZZLM.js";function N(i,t){if(i&1){let a=_();l(0,"button",4),h("click",function(){b(a);let e=u();return f(e.navigationService.back())}),d(1,"i",5),r()}}function U(i,t){if(i&1){let a=_();l(0,"button",4),h("click",function(){b(a);let e=u();return f(e.windowService.isSidebarVisible=!0)}),d(1,"i",6),r()}}function W(i,t){if(i&1&&(l(0,"h1",2),y(1),p(2,"async"),r()),i&2){let a=u();m(),R(" ",s(2,1,a.title$)," ")}}function Z(i,t){i&1&&d(0,"dd24-logo",7)(1,"div",8)}function G(i,t){i&1&&(l(0,"button",3),d(1,"i",9),r())}var le=(()=>{let t=class t{constructor(n,e,c,D,q,F){this.windowService=n,this.titleService=e,this.navigationService=c,this.element=D,this.renderer=q,this.zone=F,this.title$=this.navigationService.navigationEnd$.pipe(x(null),M(50),C(()=>this.titleService.getTitle()),O(this.adjustTitleSize.bind(this)),w(1))}adjustTitleSize(){this.zone.runOutsideAngular(()=>{let n=this.getTitle();n&&this.setLongTitle(n,!1),setTimeout(()=>{let e=this.getTitle();e&&this.setLongTitle(e,e.clientHeight<e.scrollHeight)},50)})}getTitle(){return this.element.nativeElement.querySelector(".title")}setLongTitle(n,e){e?this.renderer.addClass(n,"title-long"):this.renderer.removeClass(n,"title-long")}};t.\u0275fac=function(e){return new(e||t)(o($),o(H),o(A),o(S),o(T),o(k))},t.\u0275cmp=P({type:t,selectors:[["dd24-mobile-header"]],standalone:!0,features:[j],decls:9,vars:9,consts:[[1,"mobile-nav"],["pRipple","",1,"mobile-header-btn","custom-ripple"],[1,"title","wk-nowrap"],["pRipple","","routerLink","/help","routerLinkActive","link-active",1,"mobile-header-btn","custom-ripple"],["pRipple","",1,"mobile-header-btn","custom-ripple",3,"click"],[1,"nav-icon","pi","pi-arrow-left","medium-icon"],[1,"pi","pi-bars","medium-icon","hamb-menu"],[1,"logo"],[1,"spacer"],[1,"link-icon","pi","pi-question-circle","medium-icon"]],template:function(e,c){e&1&&(l(0,"nav",0),v(1,N,2,0,"button",1),p(2,"async"),v(3,U,2,0)(4,W,3,3,"h1",2),p(5,"async"),v(6,Z,2,0)(7,G,2,0,"button",3),p(8,"async"),r()),e&2&&(m(),g(1,s(2,3,c.windowService.UIhidden$)?1:3),m(3),g(4,s(5,5,c.title$)!=="DietiDeals24"?4:6),m(3),g(7,s(8,7,c.windowService.UIhidden$)===!1?7:-1))},dependencies:[z,I,E,B,V,L],styles:[".mobile-nav[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:start;align-items:center;gap:1.5rem;flex-wrap:nowrap;padding:3px calc(4% - var(--mobile-icon-padding));background-color:var(--component-color);border-bottom:var(--border);width:100%;max-width:100%}.mobile-nav[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:var(--basic-affordances-color)}.mobile-nav[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-size:var(--font-size-large);flex:1;line-height:normal}.mobile-nav[_ngcontent-%COMP%]   .title.title-long[_ngcontent-%COMP%]{font-size:var(--font-size-medium)}.mobile-nav[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{height:var(--mobile-icon-size);width:fit-content;display:block}.mobile-nav[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%]{flex:1}.mobile-nav[_ngcontent-%COMP%]   .link-icon[_ngcontent-%COMP%], .mobile-nav[_ngcontent-%COMP%]   .hamb-menu[_ngcontent-%COMP%], .mobile-nav[_ngcontent-%COMP%]   .nav-icon[_ngcontent-%COMP%]{color:var(--mobile-tab-icon-color)}.mobile-header-btn[_ngcontent-%COMP%]{padding:var(--mobile-icon-padding);border-radius:5000px}.link-active[_ngcontent-%COMP%]   .link-icon[_ngcontent-%COMP%]{font-weight:900}"]});let i=t;return i})();export{le as MobileHeaderComponent};
