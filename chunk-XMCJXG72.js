import{a as x,b as E}from"./chunk-X5D6C5JQ.js";import{d as S,e as L,f as I}from"./chunk-7YQB2J3D.js";import"./chunk-JEZKEUTN.js";import{r as w}from"./chunk-5SD5RNCM.js";import"./chunk-C6O6P6QR.js";import"./chunk-2CJT4ORM.js";import{G as k,H as O,j as M}from"./chunk-LCU4DL3S.js";import{Cb as y,Hb as t,Ib as a,Jb as p,Qb as _,Rb as P,X as b,cb as v,db as m,gc as C,pc as r,qa as h,qc as o,sb as u,u as g,xb as f}from"./chunk-BYEFBY3C.js";function A(n,i){if(n&1&&(t(0,"a",7),p(1,"i",9),r(2,"async"),r(3,"async"),a()),n&2){let d,c=P();v(),f("value",(d=o(2,2,c.notificationsService.unreadNotificationsCount$))!==null&&d!==void 0?d:0)("badgeDisabled",o(3,4,c.notificationsService.unreadNotificationsCount$)===0)}}function B(n,i){n&1&&(t(0,"a",7),p(1,"i",10),a())}var W=(()=>{let i=class i{constructor(c,l){this.authenticationService=c,this.notificationsService=l,this.showImagePlaceholder=!1,this.profilePicture$=this.authenticationService.loggedUser$.pipe(b(null),g(e=>e?.profilePictureUrl??null))}onImageError(){this.showImagePlaceholder=!0}};i.\u0275fac=function(l){return new(l||i)(m(w),m(S))},i.\u0275cmp=h({type:i,selectors:[["dd24-mobile-navbar"]],standalone:!0,features:[C],decls:14,vars:12,consts:[[1,"mobile-navbar"],["routerLink","/home","routerLinkActive","nav-entry-active",1,"nav-entry"],[1,"nav-link-icon","pi","pi-home"],["routerLink","/auctions","routerLinkActive","nav-entry-active",1,"nav-entry"],[1,"nav-link-icon","pi","pi-search"],["routerLink","/create-auction","routerLinkActive","nav-entry-active",1,"nav-entry"],[1,"nav-link-icon","create","pi","pi-plus-circle"],["routerLink","/notifications","routerLinkActive","nav-entry-active",1,"nav-entry"],["routerLink","/your-page","routerLinkActive","nav-entry-active",1,"avatar","nav-entry",3,"onImageError","icon","shape","image"],["pBadge","",1,"nav-link-icon","pi","pi-inbox",3,"value","badgeDisabled"],[1,"nav-link-icon","pi","pi-inbox"]],template:function(l,e){if(l&1&&(t(0,"nav",0)(1,"a",1),p(2,"i",2),a(),t(3,"a",3),p(4,"i",4),a(),t(5,"a",5),p(6,"i",6),a(),u(7,A,4,6,"a",7),r(8,"async"),u(9,B,2,0),t(10,"p-avatar",8),r(11,"async"),r(12,"async"),r(13,"async"),_("onImageError",function(){return e.onImageError()}),a()()),l&2){let s;v(7),y(7,o(8,4,e.authenticationService.isLogged$)?7:9),v(3),f("icon",o(11,6,e.profilePicture$)!==null&&!e.showImagePlaceholder?"":"pi pi-user")("shape",o(12,8,e.profilePicture$)!==null&&!e.showImagePlaceholder?"circle":"square")("image",e.showImagePlaceholder?void 0:(s=o(13,10,e.profilePicture$))!==null&&s!==void 0?s:void 0)}},dependencies:[I,L,k,M,E,x,O],styles:[".mobile-navbar[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:0;flex-wrap:nowrap;padding:.5rem 1.5rem;width:100%;border-top:var(--border);background-color:var(--component-color)}.mobile-navbar[_ngcontent-%COMP%]   .nav-entry[_ngcontent-%COMP%]{border-radius:5000px;aspect-ratio:1/1;display:flex;flex-direction:row;justify-content:center;align-items:center;text-decoration:none;padding:.4rem}.mobile-navbar[_ngcontent-%COMP%]   .nav-entry[_ngcontent-%COMP%]   .nav-link-icon[_ngcontent-%COMP%]{font-size:2rem;color:var(--basic-affordances-color);cursor:pointer}.mobile-navbar[_ngcontent-%COMP%]   .nav-entry[_ngcontent-%COMP%]   .nav-link-icon.create[_ngcontent-%COMP%]{color:var(--accent-color-1)}.mobile-navbar[_ngcontent-%COMP%]   .nav-entry.nav-entry-active[_ngcontent-%COMP%]{background:radial-gradient(var(--border-color-transparent) 0%,transparent 100%)}.mobile-navbar[_ngcontent-%COMP%]   .nav-entry.nav-entry-active[_ngcontent-%COMP%]   .nav-link-icon[_ngcontent-%COMP%]{text-shadow:var(--active-icon-shadow)}[_nghost-%COMP%]     .p-avatar{background:transparent}[_nghost-%COMP%]     .p-avatar .p-avatar-icon{color:var(--basic-affordances-color);font-size:2rem;border-radius:0;overflow:visible}[_nghost-%COMP%]     .nav-entry-active{background-color:var(--border-color-transparent)}[_nghost-%COMP%]     .nav-entry-active .p-avatar-icon{text-shadow:var(--active-icon-shadow)}[_nghost-%COMP%]     .p-badge{text-shadow:none}"]});let n=i;return n})();export{W as MobileNavbarComponent};
