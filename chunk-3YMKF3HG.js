import{i as B,j as R}from"./chunk-XF7E4TG4.js";import{b as $}from"./chunk-ECLP4C72.js";import"./chunk-24P7UAVE.js";import"./chunk-2CJT4ORM.js";import{H as L,I as V,j as H,z as E}from"./chunk-2323NQD4.js";import{$ as S,Ab as O,Ba as f,Ca as _,Db as g,Ia as T,Ib as a,Jb as l,Kb as p,N as w,Ob as h,Rb as C,Sb as u,W as M,Y as x,_b as I,ac as j,db as m,eb as o,hc as z,jb as P,kb as y,qc as c,ra as k,rc as d,tb as v,u as b}from"./chunk-WPROLY2X.js";function q(i,t){if(i&1){let s=h();a(0,"button",3),C("click",function(){f(s);let e=u();return _(e.navigationService.back())}),p(1,"i",4),l()}}function F(i,t){if(i&1){let s=h();a(0,"button",3),C("click",function(){f(s);let e=u();return _(e.windowService.isSidebarVisible=!0)}),p(1,"i",5),l()}}function N(i,t){if(i&1&&(a(0,"h1",1),I(1),c(2,"async"),l()),i&2){let s=u();m(),j(" ",d(2,1,s.title$)," ")}}function W(i,t){i&1&&p(0,"dd24-logo",6)(1,"div",7)}function Z(i,t){i&1&&(a(0,"button",2),p(1,"i",8),l())}var te=(()=>{let t=class t{constructor(n,e,r,A,D,U){this.windowService=n,this.titleService=e,this.navigationService=r,this.element=A,this.renderer=D,this.zone=U,this.title$=this.navigationService.navigationEnd$.pipe(x(null),w(50),b(()=>this.titleService.getTitle()),S(this.adjustTitleSize.bind(this)),M(1))}adjustTitleSize(){this.zone.runOutsideAngular(()=>{let n=this.getTitle();n&&this.setLongTitle(n,!1),setTimeout(()=>{let e=this.getTitle();e&&this.setLongTitle(e,e.clientHeight<e.scrollHeight)},50)})}getTitle(){return this.element.nativeElement.querySelector(".title")}setLongTitle(n,e){e?this.renderer.addClass(n,"title-long"):this.renderer.removeClass(n,"title-long")}};t.\u0275fac=function(e){return new(e||t)(o($),o(E),o(B),o(T),o(P),o(y))},t.\u0275cmp=k({type:t,selectors:[["dd24-mobile-header"]],standalone:!0,features:[z],decls:10,vars:13,consts:[[1,"mobile-nav"],[1,"title","wk-nowrap"],["routerLink","/help","routerLinkActive","link-active"],[3,"click"],[1,"pi","pi-arrow-left","medium-icon"],[1,"pi","pi-bars","medium-icon"],[1,"logo"],[1,"spacer"],[1,"link-icon","pi","pi-question-circle","medium-icon"]],template:function(e,r){e&1&&(a(0,"nav",0),c(1,"async"),v(2,q,2,0,"button"),c(3,"async"),v(4,F,2,0)(5,N,3,3,"h1",1),c(6,"async"),v(7,W,2,0)(8,Z,2,0,"button",2),c(9,"async"),l()),e&2&&(O("minimal",d(1,5,r.windowService.UIhidden$)),m(2),g(2,d(3,7,r.windowService.UIhidden$)?2:4),m(3),g(5,d(6,9,r.title$)!=="DietiDeals24"?5:7),m(3),g(8,d(9,11,r.windowService.UIhidden$)===!1?8:-1))},dependencies:[H,L,V,R],styles:[".mobile-nav[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:start;align-items:center;gap:1.5rem;flex-wrap:nowrap;padding:10px 4%;background-color:var(--component-color);border-bottom:var(--border);width:100%;max-width:100%}.mobile-nav.minimal[_ngcontent-%COMP%]{padding:.5rem 1rem}.mobile-nav[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:var(--basic-affordances-color)}.mobile-nav[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-size:var(--font-size-large);flex:1;line-height:normal}.mobile-nav[_ngcontent-%COMP%]   .title.title-long[_ngcontent-%COMP%]{font-size:var(--font-size-medium)}.mobile-nav[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{height:var(--mobile-icon-size);width:fit-content;display:block}.mobile-nav[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%]{flex:1}.link-active[_ngcontent-%COMP%]{background:radial-gradient(var(--border-color-transparent) 0%,transparent 100%);border-radius:5000px}.link-active[_ngcontent-%COMP%]   .link-icon[_ngcontent-%COMP%]{text-shadow:var(--active-icon-shadow)}"]});let i=t;return i})();export{te as MobileHeaderComponent};
