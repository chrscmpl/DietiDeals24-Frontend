import{a as N,b as j}from"./chunk-EFBLQ7J7.js";import{c as R,d as $,e as D}from"./chunk-AP53WQDE.js";import"./chunk-DF4H5URN.js";import{c as B}from"./chunk-DVYGJR5L.js";import{q as E,r as z}from"./chunk-AR6ESCK6.js";import"./chunk-2CJT4ORM.js";import{J as I,K as S,j as x}from"./chunk-6MRKP2W7.js";import{Bb as u,Ca as k,Da as C,Eb as M,Jb as r,Kb as a,Lb as l,Pb as L,Sb as w,Tb as O,Z as _,_b as m,eb as c,fb as g,ic as A,rc as d,sa as P,sc as v,u as y,ub as f,zb as b}from"./chunk-I3PUZZLM.js";function V(e,o){if(e&1&&(r(0,"button",11,2),l(2,"i",13),d(3,"async"),d(4,"async"),a()),e&2){let s,i=m(1),n=O();c(2),u("dd24icon-inbox-fill",i.isActive),b("value",(s=v(3,4,n.notificationsService.unreadNotificationsCount$))!==null&&s!==void 0?s:0)("badgeDisabled",v(4,6,n.notificationsService.unreadNotificationsCount$)===0)}}function W(e,o){if(e&1&&(r(0,"button",11,3),l(2,"i",14),a()),e&2){let s=m(1);c(2),u("dd24icon-inbox-fill",s.isActive)}}var ie=(()=>{let o=class o{constructor(i,n){this.authenticationService=i,this.notificationsService=n,this.subscriptions=[],this.showImagePlaceholder=!0,this.profilePicture$=this.authenticationService.loggedUser$.pipe(_(null),y(t=>t?.profilePictureUrl??null))}ngOnInit(){this.subscriptions.push(this.profilePicture$.subscribe(i=>this.showImagePlaceholder=!i))}ngOnDestroy(){this.subscriptions.forEach(i=>i.unsubscribe())}onImageError(){this.showImagePlaceholder=!0}};o.\u0275fac=function(n){return new(n||o)(g(B),g(R))},o.\u0275cmp=P({type:o,selectors:[["dd24-mobile-navbar"]],standalone:!0,features:[A],decls:14,vars:11,consts:[["homeLink","routerLinkActive"],["yourPageLink","routerLinkActive"],["notificationsLinkWithBadge","routerLinkActive"],["notificationsLink","routerLinkActive"],[1,"mobile-navbar"],["pRipple","","routerLink","/home","routerLinkActive","nav-entry-active",1,"nav-entry"],[1,"nav-link-icon","medium-icon","pi","pi-home"],["pRipple","","routerLink","/auctions","routerLinkActive","nav-entry-active",1,"nav-entry"],[1,"nav-link-icon","medium-icon","pi","pi-search"],["pRipple","","routerLink","/create-auction","routerLinkActive","nav-entry-active",1,"nav-entry"],[1,"nav-link-icon","medium-icon","create","pi","pi-plus-circle"],["pRipple","","routerLink","/notifications","routerLinkActive","nav-entry-active",1,"nav-entry"],["pRipple","","routerLink","/your-page","routerLinkActive","nav-entry-active",1,"avatar","nav-entry",3,"onImageError","icon","shape","image","styleClass"],["pBadge","",1,"nav-link-icon","medium-icon","pi","pi-inbox",3,"value","badgeDisabled"],[1,"nav-link-icon","medium-icon","pi","pi-inbox"]],template:function(n,t){if(n&1){let p=L();r(0,"nav",4)(1,"button",5,0),l(3,"i",6),a(),r(4,"button",7),l(5,"i",8),a(),r(6,"button",9),l(7,"i",10),a(),f(8,V,5,8,"button",11),d(9,"async"),f(10,W,3,2),r(11,"p-avatar",12,1),d(13,"async"),w("onImageError",function(){return k(p),C(t.onImageError())}),a()()}if(n&2){let p,h=m(2),T=m(12);c(3),u("dd24icon-home-fill",h.isActive),c(5),M(8,v(9,7,t.authenticationService.isLogged$)?8:10),c(3),b("icon",t.showImagePlaceholder?T.isActive?"dd24icon-user-fill":"pi pi-user":"")("shape",t.showImagePlaceholder?"square":"circle")("image",t.showImagePlaceholder?void 0:(p=v(13,9,t.profilePicture$))!==null&&p!==void 0?p:void 0)("styleClass",t.showImagePlaceholder?"":"using-picture")}},dependencies:[D,$,I,x,j,N,S,z,E],styles:[".mobile-navbar[_ngcontent-%COMP%]{display:grid;grid-template:1fr/repeat(5,1fr);grid-gap:0;justify-items:center;align-items:center;justify-content:stretch;align-content:stretch;height:calc(var(--mobile-icon-size) * 2);overflow:hidden;padding:0;width:100%;border-top:var(--border);background-color:var(--component-color)}.mobile-navbar[_ngcontent-%COMP%]   .nav-entry[_ngcontent-%COMP%]{aspect-ratio:1/1;font-size:var(--mobile-icon-size);height:calc(var(--mobile-icon-size) + 20px);display:flex;flex-direction:column;justify-content:start;align-items:center;gap:0;flex-wrap:nowrap;padding:var(--mobile-icon-padding) 0;text-decoration:none;border-radius:5000px;overflow:hidden}.mobile-navbar[_ngcontent-%COMP%]   .nav-entry[_ngcontent-%COMP%]   .nav-link-icon[_ngcontent-%COMP%]{color:var(--mobile-tab-icon-color);cursor:pointer}.mobile-navbar[_ngcontent-%COMP%]   .nav-entry[_ngcontent-%COMP%]   .nav-link-icon.create[_ngcontent-%COMP%]{color:var(--accent-color-1)}.mobile-navbar[_ngcontent-%COMP%]   .nav-entry.nav-entry-active[_ngcontent-%COMP%]   .nav-link-icon[_ngcontent-%COMP%]{font-weight:900}[_nghost-%COMP%]     .p-badge{transform:translate(25%,-25%)}[_nghost-%COMP%]     .p-avatar{box-sizing:content-box;background:transparent}[_nghost-%COMP%]     .p-avatar .p-avatar-icon{color:var(--mobile-tab-icon-color);font-size:var(--mobile-icon-size);border-radius:0;overflow:visible}[_nghost-%COMP%]     .p-avatar.using-picture{height:calc(var(--mobile-icon-size) - 4px);width:calc(var(--mobile-icon-size) - 4px);margin-top:2px}[_nghost-%COMP%]     .nav-entry-active .p-avatar.using-picture{margin-top:0;border:2px solid var(--mobile-tab-icon-color)}[_nghost-%COMP%]     .nav-entry-active .p-avatar-icon{font-weight:900}[_nghost-%COMP%]     .p-badge{text-shadow:none}"]});let e=o;return e})();export{ie as MobileNavbarComponent};
