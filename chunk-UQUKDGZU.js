import{a as C}from"./chunk-ME6MQEWM.js";import{$a as c,Cb as k,Db as y,Ma as g,Ua as r,Va as a,Wa as _,ba as u,kb as m,mb as f,oa as o,tb as h,va as p}from"./chunk-N2EQA6T4.js";var E=(()=>{let t=class t{constructor(){this.deleted=new o,this.read=new o,this.loaded=new o}ngAfterViewInit(){this.loaded.emit()}onDelete(){this.deleted.emit()}onRead(){this.read.emit()}onKeyPress(s){s.key==="Enter"&&this.onRead()}};t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=u({type:t,selectors:[["dd24-notification"]],inputs:{notification:"notification"},outputs:{deleted:"deleted",read:"read",loaded:"loaded"},standalone:!0,features:[h],decls:8,vars:6,consts:[[1,"notification-wrapper"],["tabindex","0",1,"notification-header",3,"click","keypress"],["tabindex","0",1,"notification-message",3,"click","keypress"],[1,"notification-delete-btn",3,"click"],[1,"pi","pi-times"]],template:function(n,e){n&1&&(r(0,"div",0)(1,"h6",1),c("click",function(){return e.onRead()})("keypress",function(l){return e.onKeyPress(l)}),m(2),a(),r(3,"p",2),c("click",function(){return e.onRead()})("keypress",function(l){return e.onKeyPress(l)}),m(4),k(5,"findCurrency"),a(),r(6,"button",3),c("click",function(){return e.onDelete()}),_(7,"i",4),a()()),n&2&&(g("unread",!e.notification.read),p(2),f(" ",e.notification.heading," "),p(2),f(" ",y(5,4,e.notification.message)," "))},dependencies:[C],styles:['.notification-wrapper[_ngcontent-%COMP%]{display:grid;grid-template:"header delete" auto " message delete" 1fr/1fr auto;grid-gap:0;justify-items:start;align-items:center;justify-content:center;align-content:center;padding:.4rem;column-gap:1ch;cursor:pointer}.notification-wrapper.unread[_ngcontent-%COMP%]{background-color:var(--accent-color-1-transparent)}@media (max-width: 768px){.notification-wrapper[_ngcontent-%COMP%]{padding:1rem .4rem;row-gap:.5rem}}.notification-header[_ngcontent-%COMP%], .notification-message[_ngcontent-%COMP%]{font-size:var(--font-size-medium);color:var(--text-color-1);word-break:break-word;max-width:100%;line-height:normal}.notification-header[_ngcontent-%COMP%]{font-weight:var(--font-weight-bolder);grid-area:header}.notification-message[_ngcontent-%COMP%]{grid-area:message}.notification-delete-btn[_ngcontent-%COMP%]{grid-area:delete;color:var(--basic-affordances-color);cursor:pointer}.unread[_ngcontent-%COMP%]   .notification-delete-btn[_ngcontent-%COMP%]{color:var(--accent-color-1)}']});let d=t;return d})();export{E as NotificationComponent};
