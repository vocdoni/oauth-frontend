"use strict";(self.webpackChunkoauth_frontend=self.webpackChunkoauth_frontend||[]).push([[67,667],{92449:function(e,n,t){t.d(n,{E:function(){return Z}});var r=t(1413),s=t(74165),c=t(15861),i=t(29439),a=t(1396),o=t(26998),u=t(92681),l=t(93241),d=t(53503),f=t(94722),x=t(91321),h=t(35477),j=t(23683),v=t(62048),m=t(67727),p=t(34102),g=t(79968),y=t(47313),b=t(75627),D=t(75590),_=t(26672),E=t(46417),Z=function(){var e,n,t,Z,L=(0,b.cI)({defaultValues:{name:"",description:""}}),S=L.register,C=L.handleSubmit,I=L.formState.errors,k=(0,p.m8)().createAccount,w=(0,D.$G)().t,G=(0,y.useState)(!1),N=(0,i.Z)(G,2),A=N[0],O=N[1],$=(0,y.useState)(),z=(0,i.Z)($,2),P=z[0],q=z[1],M={value:!0,message:w("form.error.field_is_required")},R={value:40,message:w("form.error.field_is_too_long",{max:40})},U=function(){var e=(0,c.Z)((0,s.Z)().mark((function e(n){return(0,s.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return O(!0),e.prev=1,e.next=4,k(new g.mR(n));case 4:e.next=13;break;case 6:if(e.prev=6,e.t0=e.catch(1),"string"!==typeof e.t0){e.next=10;break}return e.abrupt("return",q(e.t0));case 10:if("string"===typeof e.t0||!("message"in e.t0)){e.next=12;break}return e.abrupt("return",q(e.t0.message));case 12:console.error("uncatched error:",e.t0);case 13:return e.prev=13,O(!1),e.finish(13);case 16:case"end":return e.stop()}}),e,null,[[1,6,13,16]])})));return function(n){return e.apply(this,arguments)}}();return(0,E.jsxs)(a.k,{as:"form",direction:"column",onSubmit:C(U),gap:3,children:[(0,E.jsxs)(o.NI,{isRequired:!0,isInvalid:!!I.name,children:[(0,E.jsx)(u.l,{children:w("form.account_create.account_name")}),(0,E.jsx)(l.I,(0,r.Z)((0,r.Z)({type:"text"},S("name",{required:M,maxLength:R})),{},{mb:1})),I.name?(0,E.jsx)(d.J1,{children:null===(e=I.name)||void 0===e||null===(n=e.message)||void 0===n?void 0:n.toString()}):(0,E.jsxs)(f.x,{fontSize:"sm",color:"gray.400",children:[(0,E.jsx)(x.J,{as:_.DAO,mr:1}),w("form.account_create.account_name_note")]})]}),(0,E.jsxs)(o.NI,{isInvalid:!!I.description,children:[(0,E.jsx)(u.l,{children:w("form.account_create.account_description")}),(0,E.jsx)(h.g,(0,r.Z)({},S("description"))),(0,E.jsx)(d.J1,{children:null===(t=I.description)||void 0===t||null===(Z=t.message)||void 0===Z?void 0:Z.toString()})]}),P&&(0,E.jsxs)(j.b,{children:[(0,E.jsx)(v.z,{}),P]}),(0,E.jsx)(m.z,{type:"submit",isLoading:A,children:w("form.account_create.button_create")})]})}},2830:function(e,n,t){t.d(n,{L:function(){return c}});var r=t(34102),s=t(47313),c=function(){var e=(0,r.m8)(),n=e.account,t=e.balance,c=e.fetchAccount;(0,s.useEffect)((function(){"undefined"===typeof n&&c()}),[n,c]);var i="undefined"!==typeof n,a=i&&t>0;return{exists:i,existsVariation:function(e,n){return i?e:n},healthVariation:function(e,n){return a?e:n},isHealthy:a}}},59067:function(e,n,t){t.r(n),t.d(n,{default:function(){return j}});var r=t(26840),s=t(96667),c=t(1396),i=t(72600),a=t(40872),o=t(74200),u=t(14777),l=t(94722),d=t(35766),f=t(75590),x=t(46417),h=function(){var e=(0,f.$G)().t;return(0,x.jsx)(c.k,{direction:"column",gap:4,children:(0,x.jsx)(i.r,{gap:4,children:(0,x.jsx)(a.P,{display:"flex",justifyContent:"center",alignItems:"center",children:(0,x.jsx)(o.Z,{variant:"process-description",children:(0,x.jsxs)(u.e,{children:[(0,x.jsx)(l.x,{variant:"h2",mb:10,children:e("Please, connect your wallet")}),(0,x.jsx)(d.m,{})]})})})})})},j=function(){return(0,r.mA)().isConnected?(0,x.jsx)(s.default,{}):(0,x.jsx)(h,{})}},96667:function(e,n,t){t.r(n),t.d(n,{default:function(){return w}});var r=t(2830),s=t(92449),c=t(23683),i=t(62048),a=t(75590),o=t(34102),u=t(93433),l=t(29439),d=t(1396),f=t(72600),x=t(40872),h=t(13991),j=t(94722),v=t(47313),m=t(2135),p=t(74200),g=t(14707),y=t(14777),b=t(97939),D=t(79968),_=t(20263),E=t(46417),Z=function(){var e=(0,o.Yv)().election,n=(0,a.$G)().t;if(!e)return null;var t=L(n,e.status);return e.status===D.LD.CANCELED?null:(0,E.jsxs)(b.xu,{paddingX:4,children:[(0,E.jsx)(j.x,{color:"process.date",children:t}),(0,E.jsx)(j.x,{children:n("process.date.relative",{date:e.startDate>new Date?e.startDate:e.endDate})})]})},L=function(e,n){switch(n){case D.LD.UPCOMING:return e("process.date.starts");case D.LD.ONGOING:case D.LD.PAUSED:return e("process.date.ends");case D.LD.RESULTS:case D.LD.ENDED:return e("process.date.ended");case D.LD.CANCELED:return e("process.status.canceled");default:return null}},S=function(e){var n=e.election,t=(0,a.$G)().t;return(0,E.jsx)(o.qT,{election:n,children:(0,E.jsxs)(p.Z,{variant:"process-description",children:[(0,E.jsx)(g.O,{children:(0,E.jsx)(o.QW,{})}),(0,E.jsxs)(y.e,{children:[(0,E.jsxs)(b.xu,{children:[n&&(0,E.jsx)(j.x,{children:(0,_.Z)(new Date(n.creationTime),"dd MMM, yyyy")}),(0,E.jsx)(o.hi,{as:"h4",noOfLines:2}),(0,E.jsx)(b.xu,{children:(0,E.jsx)(o.I3,{})})]}),(null===n||void 0===n?void 0:n.status)!==D.LD.CANCELED?(0,E.jsxs)(b.xu,{children:[(0,E.jsx)(b.xu,{children:(0,E.jsx)(Z,{})}),(0,E.jsxs)(b.xu,{children:[(0,E.jsx)(j.x,{children:t("process.voters")}),(0,E.jsx)(j.x,{children:null===n||void 0===n?void 0:n.voteCount})]})]}):(0,E.jsx)(b.xu,{children:(0,E.jsx)(j.x,{children:t("process.status.canceled")})})]})]})})},C=function(){var e=(0,a.$G)().t,n=(0,o.m8)().client,t=(0,o.o8)().organization,r=(0,v.useState)([]),s=(0,l.Z)(r,2),c=s[0],i=s[1],p=(0,v.useState)(!1),g=(0,l.Z)(p,2),y=g[0],b=g[1],D=(0,v.useState)(!1),_=(0,l.Z)(D,2),Z=_[0],L=_[1],C=(0,v.useState)(!1),k=(0,l.Z)(C,2),w=k[0],G=k[1],N=(0,v.useState)(!1),A=(0,l.Z)(N,2),O=A[0],$=A[1],z=(0,v.useRef)(),P=(0,v.useState)(-1),q=(0,l.Z)(P,2),M=q[0],R=q[1];I(z,R),(0,v.useEffect)((function(){i([])}),[null===t||void 0===t?void 0:t.address]),(0,v.useEffect)((function(){O||(L(!1),b(!0),n&&-1!==M&&!w&&null!==t&&void 0!==t&&t.address&&n.fetchElections(null===t||void 0===t?void 0:t.address,M).then((function(e){(!e||e&&!e.length)&&$(!0),e=e.filter((function(e){return"csp"===e.census.type})),i((function(n){return n?[].concat((0,u.Z)(n),(0,u.Z)(e)):e}))})).catch((function(e){console.error("fetch elections error",e),G(e.message),$(!0)})).finally((function(){b(!1),L(!0)})))}),[n,null===t||void 0===t?void 0:t.address,M,w,O]);var U=1===(null===c||void 0===c?void 0:c.length)?{base:"1fr"}:{base:"1fr",lg:"repeat(2, 1fr)"};return(0,E.jsxs)(d.k,{direction:"column",gap:4,children:[(0,E.jsxs)(f.r,{templateColumns:U,gap:4,children:[null===c||void 0===c?void 0:c.map((function(e,n){return(0,E.jsx)(m.rU,{to:"/processes/0x".concat(e.id),children:(0,E.jsx)(x.P,{display:"flex",justifyContent:"center",alignItems:"center",children:(0,E.jsx)(S,{election:e})})},n)})),(0,E.jsx)("div",{ref:z})]}),(0,E.jsxs)(d.k,{justifyContent:"center",mt:4,children:[y&&(0,E.jsx)(h.$,{}),Z&&!c.length&&!w&&(0,E.jsx)(j.x,{children:e("organization.elections_list_empty")}),w&&(0,E.jsx)(j.x,{children:w})]})]})},I=function(e,n){(0,v.useEffect)((function(){return function(){e.current&&(e.current=null)}}),[e]),(0,v.useEffect)((function(){e.current&&new IntersectionObserver((function(e){e[0].isIntersecting&&n((function(e){return e+1}))}),{threshold:.1}).observe(e.current)}),[e,n])},k=function(){var e=(0,o.m8)().account;return(0,E.jsx)(o.f0,{id:null===e||void 0===e?void 0:e.address,children:(0,E.jsx)(C,{})})},w=function(){var e=(0,a.$G)().t,n=(0,r.L)(),t=n.exists,o=(0,n.existsVariation)(k,s.E);return(0,E.jsxs)(E.Fragment,{children:[!t&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsxs)(c.b,{variant:"subtle",status:"error",children:[(0,E.jsx)(i.z,{}),e("form.process_create.unhealthy_account")]}),(0,E.jsx)(s.E,{})]}),(0,E.jsx)(o,{})]})}}}]);