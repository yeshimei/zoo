"use strict";(self["webpackChunkzoo"]=self["webpackChunkzoo"]||[]).push([[49],{3049:function(e,t,a){a.r(t),a.d(t,{default:function(){return h}});var r=a(3396),s=a(7139),u=a(9242);const n={id:"register"},o={class:"wrapper"};function i(e,t,a,i,l,c){return(0,r.wg)(),(0,r.iD)("div",n,[(0,r._)("div",o,[(0,r.wy)((0,r._)("input",{class:(0,s.C_)({error:l.userData.username.length>8}),type:"text",placeholder:"输入您的昵称","onUpdate:modelValue":t[0]||(t[0]=e=>l.userData.username=e),onClickCapture:t[1]||(t[1]=(0,u.iM)((e=>e.target.focus()),["stop","prevent"]))},null,34),[[u.nr,l.userData.username]]),(0,r._)("button",{onClick:t[2]||(t[2]=e=>c.onSubmit()),class:(0,s.C_)({down:l.userData.username})},(0,s.zw)(l.userData.username.length>8?"这么多字，你能记住吗":"冲冲冲！"),3)])])}var l={name:"RegisterView",data(){return{maxlength:8,userData:{username:"",score:0}}},methods:{onSubmit(){this.userData.username&&this.userData.username.length<=8&&(this.userData.id=Math.random().toString(16).slice(2),localStorage.setItem("__userData__",JSON.stringify(this.userData)),this.$router.push("/"))}},created(){let e=JSON.parse(localStorage.getItem("__userData__"));e&&(this.userData=e)}},c=a(89);const d=(0,c.Z)(l,[["render",i],["__scopeId","data-v-35140724"]]);var h=d}}]);