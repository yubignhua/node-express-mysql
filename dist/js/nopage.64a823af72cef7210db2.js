webpackJsonp([1],{127:function(t,e,l){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(l(11)),o=n(l(2)),s=n(l(3)),i=n(l(4)),a=n(l(5)),u=l(30),c=n(l(152));l(153);var p=n(l(155)),h=(l(16),function(t){function e(){return(0,o.default)(this,e),(0,i.default)(this,(e.__proto__||(0,r.default)(e)).apply(this,arguments))}return(0,a.default)(e,t),(0,s.default)(e,[{key:"componentWillMount",value:function(){}},{key:"loadData",value:function(){}},{key:"render",value:function(){return u.React.createElement("div",{className:"nopage"},u.React.createElement(c.default,{pullDown:this.loadData.bind(this,!0),up:this.loadData.bind(this,!0)},u.React.createElement("h1",null),u.React.createElement(p.default,{type:"blank",height:"100px",width:"100px",color:"red"}),u.React.createElement(p.default,{type:"balls",height:"100px",width:"100px",color:"red"}),u.React.createElement(p.default,{type:"bars",height:"100px",width:"100px",color:"red"}),u.React.createElement(p.default,{type:"bubbles",height:"100px",width:"100px",color:"red"}),u.React.createElement(p.default,{type:"cubes",height:"100px",width:"100px",color:"red"}),u.React.createElement(p.default,{type:"cylon",height:"100px",width:"100px",color:"red"}),u.React.createElement(p.default,{type:"spin",height:"100px",width:"100px",color:"red"}),u.React.createElement(p.default,{type:"spinningBubbles",height:"100px",width:"100px",color:"red"}),u.React.createElement(p.default,{type:"spokes",height:"100px",width:"100px",color:"red"})))}}]),e}(u.View));console.log(new h);e.default=(0,u.connect)(function(t,e){return{}})(h)},130:function(t,e,l){t.exports=l(0)(697)},131:function(t,e,l){t.exports=l(0)(11)},136:function(t,e,l){t.exports=l(0)(357)},152:function(t,e,l){"use strict";(function(t,n){function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=r(l(6)),s=r(l(1)),i=r(l(131)),a=s.default.createClass({displayName:"ScrollPull",PropTypes:{state:i.default.number.isRequired,txt:i.default.array.isRequired},getHeight:function(){return this.refs.pull?this.refs.pull.offsetHeight:0},getState:function(){return this.props.state},render:function(){return-1==this.props.state?s.default.createElement("div",null):s.default.createElement("div",(0,o.default)({},this.props,{className:"scroll-pull",ref:"pull"}),s.default.createElement("div",{className:"txt"},this.props.txt[this.props.state]))}}),u=s.default.createClass({displayName:"Scroll",mixins:[{stopEvent:function(t){t.preventDefault()},getEvents:function(t){return t||(t=this.stopEvent),{onTouchStart:t,onTouchMove:t,onTouchCancel:t,onTouchEnd:t}}}],getInitialState:function(){return{mPullDown:-1,mPullUp:1==this.props.up?1:-1}},PropTypes:{pullUp:i.default.func,bounce:i.default.bool,scrollX:i.default.bool},getDefaultProps:function(){return{bounce:!0,mPullDown:a,mPullDownTxt:["下拉刷新","松开刷新","刷新中...","暂无刷新"],mPullUp:a,mPullUpTxt:["加载更多","松开加载","正努力加载...","已全部加载"]}},componentDidMount:function(){var e=t(this.refs.Scroll),l=t(this.refs.wrap);l.width(),e.height();l.css({minHeight:e.height()+"px"}),this.mScrollHeight=l.height(),this.pullDownOffset=this.refs.pullDown.getHeight(),this.pullUpOffset=this.refs.pullUp.getHeight(),this.mScroll=new n(this.refs.Scroll,{bounce:this.props.bounce,scrollX:0!=this.props.scrollX}),this.mScroll.on("scrollMove",this.scrollMove),this.mScroll.on("scrollEnd",this.scrollEnd),this.mScroll.on("beforeScrollEnd",this.beforeScrollEnd)},getScroll:function(){return this.mScroll},componentDidUpdate:function(){var e=t(this.refs.wrap).height();0!=e&&(this.mScrollHeight=e,this.mScroll.refresh())},scrollMove:function(t,e){var l=this.mScroll,n=this.refs.pullDown,r=this.refs.pullUp;e>30&&n&&0==n.getState()?(this.setState({mPullDown:1}),l.minScrollY=0):e<30&&n&&1==n.getState()?(this.setState({mPullDown:0}),l.minScrollY=-this.pullDownOffset):e<l.maxScrollY-30&&r&&0==r.getState()?this.setState({mPullUp:1}):e>l.maxScrollY-30&&r&&1==r.getState()&&this.setState({mPullUp:0})},beforeScrollEnd:function(){this.refs.pullDown;var t=this.refs.pullUp;t&&1==t.getState()&&this.mScroll.setBottomOffset(0,!1)},scrollEnd:function(){var t=this.refs.pullDown,e=this.refs.pullUp;t&&1==t.getState()&&this.setState({mPullDown:2}),e&&1==e.getState()&&this.triggerPull(2)},triggerPull:function(t){2===t&&(this.props.pullDown&&this.props.pullDown(),this.setState({mPullUp:2}))},refresh:function(){this.mScroll.refresh()},setPullDownState:function(t){this.setState({mPullUp:t})},render:function(){var t=this.props,e=t.mPullDownTxt,l=t.mPullUpTxt,n=this.props.mPullDown,r=this.props.mPullUp;return s.default.createElement("div",this.getEvents(this.stopEvent),s.default.createElement("div",{className:"react-scroll",id:"react-scroll",ref:"Scroll"},s.default.createElement("div",{className:"wrap",ref:"wrap"},s.default.createElement(n,{txt:e,state:this.state.mPullDown,ref:"pullDown"}),this.props.children,s.default.createElement(r,{txt:l,state:this.state.mPullUp,onClick:this.triggerPull.bind(this,2),ref:"pullUp"}))))}});e.default=u}).call(e,l(130),l(136))},153:function(t,e,l){var n=l(154);"string"==typeof n&&(n=[[t.i,n,""]]);var r={hmr:!0};r.transform=void 0;l(8)(n,r);n.locals&&(t.exports=n.locals)},154:function(t,e,l){(t.exports=l(7)(void 0)).push([t.i,".nopage .items {\n  background-size: 100% 100%;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  text-align: center;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  height: 50;\n  line-height: 1.33333rem; }\n  .nopage .items:nth-child(2n) {\n    background: #bdb8c4; }\n  .nopage .items:nth-child(2n-1) {\n    background: #97c4ab; }\n",""])},155:function(t,e,l){t.exports=l(0)(384)}});