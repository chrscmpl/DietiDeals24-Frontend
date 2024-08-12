import{a as X}from"./chunk-2QTCJQT7.js";import{b as Y}from"./chunk-FVFUZT4Q.js";import{c as Q}from"./chunk-JEZKEUTN.js";import{F as G,G as J,j as $,k as N,l as K,m as q,n as W}from"./chunk-LCU4DL3S.js";import{$b as x,Aa as z,Ab as F,Ba as T,Cb as w,Ec as R,Hb as c,Hc as V,Ia as E,Ib as d,Jb as S,Nb as H,Qb as k,Rb as M,Zb as u,_a as j,_b as P,ac as B,cb as a,db as f,gc as O,hc as U,ic as D,pc as m,qa as C,qc as h,rc as I,sb as _,ta as b,xb as v,zb as L}from"./chunk-BYEFBY3C.js";var rt=()=>["help"],ct=t=>({overlay:null,primary:t}),st=t=>({outlets:t}),dt=t=>["/",t],Z=(()=>{let o=class o{constructor(){}stopPropagation(i){i.stopPropagation()}};o.\u0275fac=function(n){return new(n||o)},o.\u0275cmp=C({type:o,selectors:[["dd24-auction-ruleset-link"]],inputs:{ruleSet:"ruleSet"},standalone:!0,features:[O],decls:5,vars:12,consts:[[1,"auction-type"],["tabindex","0",1,"auction-type-link",3,"click","keypress","routerLink","fragment"],[1,"pi","pi-info-circle"]],template:function(n,e){n&1&&(c(0,"span",0),u(1),m(2,"uppercase"),c(3,"span",1),k("click",function(p){return e.stopPropagation(p)})("keypress",function(p){return e.stopPropagation(p)}),S(4,"i",2),d()()),n&2&&(a(),x("",h(2,3,e.ruleSet+" AUCTION")," "),a(2),v("routerLink",D(10,dt,D(8,st,D(6,ct,U(5,rt)))))("fragment",e.ruleSet+"-auction"))},dependencies:[N,J],styles:[".auction-type[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:start;align-items:center;gap:.5ch;flex-wrap:nowrap;font-size:var(--font-size-large);color:var(--accent-color-2);font-weight:var(--font-weight-bolder);text-overflow:ellipsis;white-space:nowrap}.auction-type-link[_ngcontent-%COMP%]{text-decoration:none;cursor:pointer}.auction-type-link[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:var(--font-size-large);color:var(--accent-color-2);font-weight:var(--font-weight-bolder)}"]});let t=o;return t})();var tt=(()=>{let o=class o{constructor(i){this.locale=i,this.datePipe=new K(i)}transform(i){let n=new Date(i),e=this.dayDifference(n);return e<0?this.datePipe.transform(n,"dd/MM/yyyy"):e===0?this.datePipe.transform(n,"'today at' HH:mm"):e<=1?this.datePipe.transform(n,"'tomorrow at' HH:mm"):e<7?this.datePipe.transform(n,"EEEE 'at' HH:mm"):this.datePipe.transform(n,"EEEE dd/MM/yyyy 'at' HH:mm")}dayDifference(i){let n=new Date().setHours(0,0,0,0);return(new Date(i).setHours(0,0,0,0)-n)/(1e3*60*60*24)}};o.\u0275fac=function(n){return new(n||o)(f(R,16))},o.\u0275pipe=b({name:"localDate",type:o,pure:!0,standalone:!0});let t=o;return t})();var r=function(t){return t[t.years=0]="years",t[t.months=1]="months",t[t.days=2]="days",t[t.hours=3]="hours",t[t.minutes=4]="minutes",t[t.seconds=5]="seconds",t}(r||{}),et=(()=>{let o=class o{transform(i,n="seconds"){let e=n in r?r[n]:r.seconds;if(i<=0)return"now";let s=this.getValues(i,e);return s.years||s.months||s.days||e<r.days?this.buildLongString(s,e):this.buildShortString(s,e)}buildLongString(i,n){let{years:e,months:s,days:p,hours:y,minutes:it,seconds:ot}=i,g=[];return e&&g.push(this.pluralize("year",e)),(s||e)&&n>=r.months&&g.push(this.pluralize("month",s)),n>=r.days&&g.push(this.pluralize("day",p)),n>=r.hours&&g.push(this.pluralize("hour",y)),n>=r.minutes&&g.push(this.pluralize("minute",it)),n>=r.seconds&&g.push(this.pluralize("second",ot)),g.filter(at=>at.length).join(", ")}buildShortString(i,n){let{hours:e,minutes:s,seconds:p}=i,y=[];return y.push(this.formatNumber(e)),n>=r.minutes&&y.push(this.formatNumber(s)),n>=r.seconds&&y.push(this.formatNumber(p)),y.join(":")}getValues(i,n){let e={};return e.years=Math.floor(i/31536e3),n===r.years||(i%=31536e3,e.months=Math.floor(i/2592e3),n===r.months)||(i%=2592e3,e.days=Math.floor(i/86400),n===r.days)||(i%=86400,e.hours=Math.floor(i/3600),n===r.hours)||(i%=3600,e.minutes=Math.floor(i/60),n===r.minutes)||(e.seconds=i%60),e}pluralize(i,n){return n?`${n} ${i}${n!==1?"s":""}`:""}formatNumber(i){return i=i??0,i<10?`0${i}`:i.toString()}};o.\u0275fac=function(n){return new(n||o)},o.\u0275pipe=b({name:"interval",type:o,pure:!0,standalone:!0});let t=o;return t})();var nt=(()=>{let o=class o{constructor(i){this.changeDetector=i,this.timeAmount=0}ngOnInit(){this.timeAmount=Math.floor((this.endDate.getTime()-Date.now())/1e3),this.timerTimeout=setTimeout(()=>{this.timerInterval=setInterval(()=>{this.timeAmount-=60,this.changeDetector.markForCheck(),this.timeAmount<=0&&clearInterval(this.timerInterval)},6e4)},this.timeAmount%60)}ngOnDestroy(){clearTimeout(this.timerTimeout),clearInterval(this.timerInterval)}};o.\u0275fac=function(n){return new(n||o)(f(V))},o.\u0275cmp=C({type:o,selectors:[["dd24-timer"]],inputs:{endDate:"endDate"},standalone:!0,features:[O],decls:3,vars:6,consts:[[1,"auction-card-time-left-amount"]],template:function(n,e){n&1&&(c(0,"span",0),u(1),m(2,"interval"),d()),n&2&&(L("danger",e.timeAmount>0&&e.timeAmount<86400),a(),P(I(2,3,e.timeAmount,"minutes")))},dependencies:[et],changeDetection:0});let t=o;return t})();function ut(t,o){if(t&1){let l=H();c(0,"img",12),k("error",function(){z(l);let n=M();return T(n.onImageError())}),d()}if(t&2){let l=M();v("src",l.auction.pictureUrl,j)}}function lt(t,o){t&1&&S(0,"i",13)}function mt(t,o){if(t&1&&u(0),t&2){let l=M();x(" | ",l.auction.conditions," ")}}function pt(t,o){if(t&1&&(u(0),m(1,"oneCharUpper"),c(2,"span",9),u(3),m(4,"currency"),d()),t&2){let l=M();x(" ",h(1,2,l.auction.lastBidDescription),": "),a(3),P(I(4,4,l.auction.lastBid,l.auction.currency))}}function gt(t,o){t&1&&u(0," Time left: ")}function ft(t,o){if(t&1&&(u(0),m(1,"localDate")),t&2){let l=M();x(" (Until ",h(1,1,l.auction.endTime),") ")}}var $t=(()=>{let o=class o{constructor(i,n){this.windowService=i,this.router=n,this.cardStyle={},this.skipLocationChange=!1,this.loaded=new E,this.statuses=Q.STATUSES,this.showImagePlaceholder=!1}ngOnInit(){this.loaded.emit()}onImageError(){this.showImagePlaceholder=!0}onClick(){this.router.navigate(["",{outlets:{overlay:["auctions",this.auction.id]}}],{skipLocationChange:this.skipLocationChange,queryParamsHandling:"merge"})}onKeyPress(i){i.key==="Enter"&&this.onClick()}};o.\u0275fac=function(n){return new(n||o)(f(Y),f(G))},o.\u0275cmp=C({type:o,selectors:[["dd24-auction-card"]],inputs:{auction:"auction",cardStyle:"cardStyle",skipLocationChange:"skipLocationChange"},outputs:{loaded:"loaded"},standalone:!0,features:[O],decls:21,vars:17,consts:[["tabindex","0",1,"auction-card",3,"click","keypress"],[1,"auction-card-image-container"],["alt","Auction image",1,"auction-card-image",3,"src"],[1,"auction-card-title-container"],[1,"auction-card-title","wk-nowrap"],[1,"auction-card-secondary-line","wk-nowrap"],[1,"auction-card-auction-type",3,"ruleSet"],[1,"auction-card-details-container"],[1,"auction-card-sum"],[1,"auction-card-sum-amount"],[1,"auction-card-time-left","wk-nowrap"],[2,"font-weight","var(--font-weight-bolder)",3,"endDate"],["alt","Auction image",1,"auction-card-image",3,"error","src"],[1,"auction-card-missing-image","pi","pi-image"]],template:function(n,e){n&1&&(c(0,"div",0),k("click",function(){return e.onClick()})("keypress",function(p){return e.onKeyPress(p)}),c(1,"div",1),_(2,ut,1,1,"img",2)(3,lt,1,0),d(),c(4,"div",3)(5,"span",4),u(6),d(),c(7,"span",5),u(8),_(9,mt,1,1),d()(),c(10,"dd24-auction-ruleset-link",6),u(11),d(),c(12,"div",7)(13,"span",8),_(14,pt,5,7,"span",9),d(),c(15,"span",10),_(16,gt,1,0),m(17,"async"),S(18,"dd24-timer",11),_(19,ft,2,3),m(20,"async"),d()()()),n&2&&(F(e.cardStyle),a(2),w(2,e.auction.pictureUrl&&!e.showImagePlaceholder?2:3),a(4),P(e.auction.title),a(2),B(" from ",e.auction.location.country,", ",e.auction.location.city," "),a(),w(9,e.auction.conditions?9:-1),a(),v("ruleSet",e.auction.ruleSet),a(),P(e.auction.ruleSet),a(3),w(14,e.auction.status===e.statuses.active?14:-1),a(2),w(16,h(17,13,e.windowService.isMobile$)===!1?16:-1),a(2),v("endDate",e.auction.endTime),a(),w(19,h(20,15,e.windowService.isMobile$)===!1?19:-1))},dependencies:[W,$,q,Z,X,tt,nt],styles:['.auction-card[_ngcontent-%COMP%]{display:grid;grid-template:"image title" auto "image type" auto "image details" minmax(0,1fr)/auto 1fr;grid-gap:0;justify-items:stretch;align-items:stretch;justify-content:stretch;align-content:stretch;min-height:var(--card-height);width:100%;border:var(--border);border-radius:var(--border-radius-large);overflow:hidden;cursor:pointer;background-color:var(--component-color)}@media (max-width: 768px){.auction-card[_ngcontent-%COMP%]{display:grid;grid-template:"type type" auto "image title" auto "image details" auto/auto 1fr;grid-gap:0;justify-items:stretch;align-items:stretch;justify-content:stretch;align-content:stretch;padding-bottom:1rem}}.auction-card[_ngcontent-%COMP%]   .auction-card-image-container[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:center;align-items:center;gap:0;flex-wrap:nowrap;grid-area:image;height:var(--card-height);width:var(--card-height);border-right:var(--border)}@media (max-width: 768px){.auction-card[_ngcontent-%COMP%]   .auction-card-image-container[_ngcontent-%COMP%]{height:calc(var(--card-height) / 2);width:calc(var(--card-height) / 2);border-radius:var(--border-radius-medium);border:var(--border);margin-left:1rem}}.auction-card[_ngcontent-%COMP%]   .auction-card-image[_ngcontent-%COMP%]{object-fit:cover;max-width:100%;max-height:100%}.auction-card[_ngcontent-%COMP%]   .auction-card-missing-image[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:center;align-items:center;gap:0;flex-wrap:nowrap;height:100%;width:100%;font-size:8rem;color:var(--border-color)}@media (max-width: 768px){.auction-card[_ngcontent-%COMP%]   .auction-card-missing-image[_ngcontent-%COMP%]{font-size:3rem}}.auction-card[_ngcontent-%COMP%]   .auction-card-title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:start;align-items:start;gap:0;flex-wrap:nowrap;color:var(--text-color-1);padding:1rem;grid-area:title;overflow:hidden}@media (max-width: 768px){.auction-card[_ngcontent-%COMP%]   .auction-card-title-container[_ngcontent-%COMP%]{padding:0 1rem;justify-content:center}}.auction-card[_ngcontent-%COMP%]   .auction-card-title[_ngcontent-%COMP%]{font-size:var(--font-size-large);font-weight:var(--font-weight-bolder);line-height:var(--line-height-large)}@media (max-width: 768px){.auction-card[_ngcontent-%COMP%]   .auction-card-title[_ngcontent-%COMP%]{line-height:normal}}.auction-card[_ngcontent-%COMP%]   .auction-card-secondary-line[_ngcontent-%COMP%]{font-size:var(--font-size-medium);color:var(--text-color-3)}.auction-card[_ngcontent-%COMP%]   .auction-card-auction-type[_ngcontent-%COMP%]{grid-area:type;padding:.2rem 1rem}@media (max-width: 768px){.auction-card[_ngcontent-%COMP%]   .auction-card-auction-type[_ngcontent-%COMP%]{padding:1rem 1rem .2rem}}.auction-card[_ngcontent-%COMP%]   .auction-card-details-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:start;align-items:start;gap:.1em;flex-wrap:nowrap;grid-area:details;color:var(--text-color-1);padding:1rem;padding-top:0;font-size:var(--font-size-medium);font-weight:var(--font-weight-regular)}@media (max-width: 768px){.auction-card[_ngcontent-%COMP%]   .auction-card-details-container[_ngcontent-%COMP%]{padding:0 1rem}}.auction-card[_ngcontent-%COMP%]   .auction-card-sum[_ngcontent-%COMP%]{font-weight:var(--font-weight-bolder);font-size:var(--font-size-large);line-height:var(--line-height-large)}@media (max-width: 768px){.auction-card[_ngcontent-%COMP%]   .auction-card-sum[_ngcontent-%COMP%]{font-size:var(--font-size-medium);line-height:var(--line-height-medium)}.auction-card[_ngcontent-%COMP%]   .auction-card-sum[_ngcontent-%COMP%]   .auction-card-sum-amount[_ngcontent-%COMP%]{color:var(--accent-color-2);font-weight:var(--font-weight-bolder)}}.auction-card[_ngcontent-%COMP%]   .auction-card-time-left[_ngcontent-%COMP%]{font-size:var(--font-size-medium);color:var(--text-color-3)}.auction-card[_ngcontent-%COMP%]   .auction-card-time-left[_ngcontent-%COMP%], .auction-card[_ngcontent-%COMP%]   .auction-card-secondary-line[_ngcontent-%COMP%], .auction-card[_ngcontent-%COMP%]   .auction-card-title[_ngcontent-%COMP%]{-webkit-line-clamp:2}@media (max-width: 768px){.auction-card[_ngcontent-%COMP%]   .auction-card-time-left[_ngcontent-%COMP%], .auction-card[_ngcontent-%COMP%]   .auction-card-secondary-line[_ngcontent-%COMP%]{-webkit-line-clamp:1}}'],changeDetection:0});let t=o;return t})();export{Z as a,tt as b,nt as c,$t as d};
