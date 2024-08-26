import{B as h,Ia as d,aa as o,eb as i,jb as a,kb as c,ta as l}from"./chunk-WPROLY2X.js";var n=function(e){return e[e.UP=0]="UP",e[e.DOWN=1]="DOWN",e}(n||{}),u=(()=>{let s=class s{set showOffset(t){if(t<0)throw new Error("SmartStickyDirective: showOffset must be greater than 0");this.offsetShow=t}set hideOffset(t){if(t<0)throw new Error("SmartStickyDirective: hideOffset must be greater than 0");this.offsetHide=t}set transitionTime(t){this._transitionTime=t,this.setRules()}get transitionTime(){return this._transitionTime}constructor(t,r,m){this.element=t,this.renderer=r,this.zone=m,this.lastTurn=0,this._scrollingDown=n.DOWN,this._sticky=!1,this._shown=!1,this.scrollPosition=0,this.lastScrollPosition=0,this.stylesheet=null,this.animationStylesheet=null,this._transitionTime=.3,this.offsetHide=-1,this.offsetShow=-1,this.scroll$=h(window,"scroll",{passive:!0}).pipe(o(100)),this.subscriptions=[]}ngAfterViewInit(){this.stylesheet||this.setRules(),this.setAnimation(),this.setOffsets(),this.renderer.addClass(this.element.nativeElement,"dd24-smart-sticky"),this.zone.runOutsideAngular(()=>{this.subscriptions.push(this.scroll$.subscribe(this.onScroll.bind(this)))})}ngOnDestroy(){this.subscriptions.forEach(t=>t.unsubscribe()),this.stylesheet&&this.renderer.removeChild(document.head,this.stylesheet),this.animationStylesheet&&this.renderer.removeChild(document.head,this.animationStylesheet)}onScroll(){this.scrollPosition=window.scrollY||document.documentElement.scrollTop;let t=this.element.nativeElement.clientHeight;this.scrollPosition<=10?this.sticky=!1:this.scrollPosition>t&&(this.shown&&this.scrollPosition>this.lastTurn+this.offsetHide?this.shown=!1:this.scrollPosition<this.lastTurn-this.offsetShow&&(this.sticky||(this.sticky=!0),this.shown=!0)),this.updateScrollingDirection(),this.lastScrollPosition=this.scrollPosition}get sticky(){return this._sticky}set sticky(t){this._sticky=t,t?this.renderer.addClass(this.element.nativeElement,"dd24ss-sticky"):(this._shown=!1,this.renderer.removeClass(this.element.nativeElement,"dd24ss-sticky"),this.renderer.removeClass(this.element.nativeElement,"dd24ss-shown"),this.renderer.removeClass(this.element.nativeElement,"dd24ss-hidden"))}get shown(){return this._shown}set shown(t){this._shown=t,t?(this.renderer.addClass(this.element.nativeElement,"dd24ss-shown"),this.renderer.removeClass(this.element.nativeElement,"dd24ss-hidden")):(this.renderer.addClass(this.element.nativeElement,"dd24ss-hidden"),this.renderer.removeClass(this.element.nativeElement,"dd24ss-shown"))}updateScrollingDirection(){this.scrollPosition<this.lastScrollPosition?this.setScrollingDirection(n.UP):this.scrollPosition>this.lastScrollPosition&&this.setScrollingDirection(n.DOWN)}setScrollingDirection(t){this._scrollingDown!==t&&(this.lastTurn=this.scrollPosition),this._scrollingDown=t}setRules(){this.stylesheet&&this.renderer.removeChild(document.head,this.stylesheet),this.stylesheet=this.renderer.createElement("style");let t=this.renderer.createText(`
            .dd24-smart-sticky.dd24ss-sticky{
                position:sticky;
            }
            .dd24-smart-sticky.dd24ss-sticky.dd24ss-shown{
                animation: dd24-smart-sticky-slide-in ${this.transitionTime}s ease-in-out;
            }
            .dd24-smart-sticky.dd24ss-sticky.dd24ss-hidden{
                animation: dd24-smart-sticky-slide-out ${this.transitionTime*2}s ease-in-out forwards;
            }
            `);this.renderer.appendChild(this.stylesheet,t),this.renderer.appendChild(document.head,this.stylesheet)}setAnimation(){this.animationStylesheet&&this.renderer.removeChild(document.head,this.animationStylesheet),this.animationStylesheet=this.renderer.createElement("style");let t=this.renderer.createText(`
            @keyframes dd24-smart-sticky-slide-in {
                0% {
                    transform: translateY(-100%);
                }
                100% {
                    transform: translateY(0);
                }
            }
            @keyframes dd24-smart-sticky-slide-out {
                0% {
                    transform: translateY(0);
                }
                50%{
                    transform: translateY(-100%);
                }
                100% {
                    position: static;
                }
            }
            `);this.renderer.appendChild(this.animationStylesheet,t),this.renderer.appendChild(document.head,this.animationStylesheet)}setOffsets(){this.offsetHide===-1&&(this.offsetHide=this.element.nativeElement.clientHeight),this.offsetShow===-1&&(this.offsetShow=this.element.nativeElement.clientHeight)}};s.\u0275fac=function(r){return new(r||s)(i(d),i(a),i(c))},s.\u0275dir=l({type:s,selectors:[["","dd24SmartSticky",""]],inputs:{showOffset:"showOffset",hideOffset:"hideOffset",transitionTime:"transitionTime"},standalone:!0});let e=s;return e})();export{u as SmartStickyDirective};
