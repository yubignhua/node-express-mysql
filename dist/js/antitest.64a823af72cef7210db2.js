webpackJsonp([2],{129:function(n,t,e){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}Object.defineProperty(t,"__esModule",{value:!0});var a,r=o(e(32)),i=o(e(132)),l=o(e(11)),d=o(e(2)),s=o(e(3)),u=o(e(4)),c=o(e(5)),b=o(e(137));e(33),e(133);var f=e(30),p={name:"yubinghua",list:["足球","篮球","乒乓球"]},m={AntiTest:function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p;switch(arguments[1].type){case"ADD":return[].concat((0,b.default)(n.list),[["棒球"]]);default:return n}}},g=(0,e(31).withLazyReducer)(m)(a=function(n){function t(){return(0,d.default)(this,t),(0,u.default)(this,(t.__proto__||(0,l.default)(t)).apply(this,arguments))}return(0,c.default)(t,n),(0,s.default)(t,[{key:"componentWillMount",value:function(){}},{key:"render",value:function(){return f.React.createElement("div",{className:"AntiTest"},f.React.createElement(i.default,null,"Start"),f.React.createElement("div",null,f.React.createElement(r.default,{tabs:[{title:"First Tab",sub:"1"},{title:"Second Tab",sub:"2"},{title:"Third Tab",sub:"3"}],initialPage:1,tabBarPosition:"bottom",renderTab:function(n){return f.React.createElement("span",null,n.title)}},f.React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"150px",backgroundColor:"#fff"}},"Content of first tab"),f.React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"150px",backgroundColor:"#fff"}},"Content of second tab"),f.React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"150px",backgroundColor:"#fff"}},"Content of third tab"))))}}]),t}(f.View))||a;t.default=(0,f.connect)(function(n,t){return console.log(n),{}})(g)},132:function(n,t,e){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}function a(n){return"string"==typeof n}function r(n){return a(n.type)&&x(n.props.children)?b.default.cloneElement(n,{},n.props.children.split("").join(" ")):a(n)?(x(n)&&(n=n.split("").join(" ")),b.default.createElement("span",null,n)):n}Object.defineProperty(t,"__esModule",{value:!0});var i=o(e(6)),l=o(e(13)),d=o(e(2)),s=o(e(3)),u=o(e(4)),c=o(e(5)),b=o(e(1)),f=o(e(9)),p=o(e(18)),m=o(e(17)),g=function(n,t){var e={};for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&t.indexOf(o)<0&&(e[o]=n[o]);if(null!=n&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(o=Object.getOwnPropertySymbols(n);a<o.length;a++)t.indexOf(o[a])<0&&(e[o[a]]=n[o[a]])}return e},h=/^[\u4e00-\u9fa5]{2}$/,x=h.test.bind(h),v=function(n){function t(){return(0,d.default)(this,t),(0,u.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,c.default)(t,n),(0,s.default)(t,[{key:"render",value:function(){var n,t=this.props,e=t.children,o=t.className,a=t.prefixCls,d=t.type,s=t.size,u=t.inline,c=t.disabled,h=t.icon,x=t.loading,v=t.activeStyle,y=t.activeClassName,w=t.onClick,k=g(t,["children","className","prefixCls","type","size","inline","disabled","icon","loading","activeStyle","activeClassName","onClick"]),C=x?"loading":h,P=(0,f.default)(a,o,(n={},(0,l.default)(n,a+"-primary","primary"===d),(0,l.default)(n,a+"-ghost","ghost"===d),(0,l.default)(n,a+"-warning","warning"===d),(0,l.default)(n,a+"-small","small"===s),(0,l.default)(n,a+"-inline",u),(0,l.default)(n,a+"-disabled",c),(0,l.default)(n,a+"-loading",x),(0,l.default)(n,a+"-icon",!!C),n)),_=b.default.Children.map(e,r),E=void 0;if("string"==typeof C)E=b.default.createElement(p.default,{"aria-hidden":"true",type:C,size:"small"===s?"xxs":"md",className:a+"-icon"});else if(C){var z=C.props&&C.props.className,j=(0,f.default)("am-icon",a+"-icon","small"===s?"am-icon-xxs":"am-icon-md");E=b.default.cloneElement(C,{className:z?z+" "+j:j})}return b.default.createElement(m.default,{activeClassName:y||(v?a+"-active":void 0),disabled:c,activeStyle:v},b.default.createElement("a",(0,i.default)({role:"button",className:P},k,{onClick:c?void 0:w,"aria-disabled":c}),E,_))}}]),t}(b.default.Component);v.defaultProps={prefixCls:"am-button",size:"large",inline:!1,disabled:!1,loading:!1,activeStyle:{}},t.default=v,n.exports=t.default},133:function(n,t,e){"use strict";e(10),e(19),e(134)},134:function(n,t,e){var o=e(135);"string"==typeof o&&(o=[[n.i,o,""]]);var a={hmr:!0};a.transform=void 0;e(8)(o,a);o.locals&&(n.exports=o.locals)},135:function(n,t,e){(n.exports=e(7)(void 0)).push([n.i,".am-button {\n  display: block;\n  outline: 0 none;\n  -webkit-appearance: none;\n  box-sizing: border-box;\n  padding: 0;\n  text-align: center;\n  font-size: 18px;\n  height: 47px;\n  line-height: 47px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  word-break: break-word;\n  white-space: nowrap;\n  color: #000;\n  background-color: #fff;\n  border: 1PX solid #ddd;\n  border-radius: 5px;\n}\n@media (min-resolution: 2dppx) {\n  html:not([data-scale]) .am-button {\n    position: relative;\n    border: none;\n  }\n  html:not([data-scale]) .am-button::before {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 200%;\n    height: 200%;\n    border: 1PX solid #ddd;\n    border-radius: 10px;\n    transform-origin: 0 0;\n    transform: scale(0.5);\n    box-sizing: border-box;\n    pointer-events: none;\n  }\n}\n.am-button-borderfix:before {\n  transform: scale(0.49) !important;\n}\n.am-button.am-button-active {\n  background-color: #ddd;\n}\n.am-button.am-button-disabled {\n  color: rgba(0, 0, 0, 0.3);\n  opacity: 0.6;\n}\n.am-button-primary {\n  color: #fff;\n  background-color: #108ee9;\n  border: 1PX solid #108ee9;\n  border-radius: 5px;\n}\n@media (min-resolution: 2dppx) {\n  html:not([data-scale]) .am-button-primary {\n    position: relative;\n    border: none;\n  }\n  html:not([data-scale]) .am-button-primary::before {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 200%;\n    height: 200%;\n    border: 1PX solid #108ee9;\n    border-radius: 10px;\n    transform-origin: 0 0;\n    transform: scale(0.5);\n    box-sizing: border-box;\n    pointer-events: none;\n  }\n}\n.am-button-primary.am-button-active {\n  color: rgba(255, 255, 255, 0.3);\n  background-color: #0e80d2;\n}\n.am-button-primary.am-button-disabled {\n  color: rgba(255, 255, 255, 0.6);\n  opacity: 0.4;\n}\n.am-button-ghost {\n  color: #108ee9;\n  background-color: transparent;\n  border: 1PX solid #108ee9;\n  border-radius: 5px;\n}\n@media (min-resolution: 2dppx) {\n  html:not([data-scale]) .am-button-ghost {\n    position: relative;\n    border: none;\n  }\n  html:not([data-scale]) .am-button-ghost::before {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 200%;\n    height: 200%;\n    border: 1PX solid #108ee9;\n    border-radius: 10px;\n    transform-origin: 0 0;\n    transform: scale(0.5);\n    box-sizing: border-box;\n    pointer-events: none;\n  }\n}\n.am-button-ghost.am-button-active {\n  color: rgba(16, 142, 233, 0.6);\n  background-color: transparent;\n  border: 1PX solid rgba(16, 142, 233, 0.6);\n  border-radius: 5px;\n}\n@media (min-resolution: 2dppx) {\n  html:not([data-scale]) .am-button-ghost.am-button-active {\n    position: relative;\n    border: none;\n  }\n  html:not([data-scale]) .am-button-ghost.am-button-active::before {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 200%;\n    height: 200%;\n    border: 1PX solid rgba(16, 142, 233, 0.6);\n    border-radius: 10px;\n    transform-origin: 0 0;\n    transform: scale(0.5);\n    box-sizing: border-box;\n    pointer-events: none;\n  }\n}\n.am-button-ghost.am-button-disabled {\n  color: rgba(0, 0, 0, 0.1);\n  border: 1PX solid rgba(0, 0, 0, 0.1);\n  border-radius: 5px;\n  opacity: 1;\n}\n@media (min-resolution: 2dppx) {\n  html:not([data-scale]) .am-button-ghost.am-button-disabled {\n    position: relative;\n    border: none;\n  }\n  html:not([data-scale]) .am-button-ghost.am-button-disabled::before {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 200%;\n    height: 200%;\n    border: 1PX solid rgba(0, 0, 0, 0.1);\n    border-radius: 10px;\n    transform-origin: 0 0;\n    transform: scale(0.5);\n    box-sizing: border-box;\n    pointer-events: none;\n  }\n}\n.am-button-warning {\n  color: #fff;\n  background-color: #e94f4f;\n}\n.am-button-warning.am-button-active {\n  color: rgba(255, 255, 255, 0.3);\n  background-color: #d24747;\n}\n.am-button-warning.am-button-disabled {\n  color: rgba(255, 255, 255, 0.6);\n  opacity: 0.4;\n}\n.am-button-inline {\n  display: inline-block;\n  padding: 0 15px;\n}\n.am-button-small {\n  font-size: 13px;\n  height: 30px;\n  line-height: 30px;\n  padding: 0 15px;\n}\n.am-button-icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.am-button > .am-button-icon {\n  margin-right: 0.5em;\n}\n",""])},137:function(n,t,e){n.exports=e(0)(74)}});