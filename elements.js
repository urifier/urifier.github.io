class e extends HTMLElement{constructor(){super().attachShadow({mode:'open'}).innerHTML=""}title(e=this.nodeName){return`<h4 style="margin:5px 0">${e}</h4>`}get input(){return document.querySelector("uri-input")}src(){return this.input.value}dictionary(){return this.input.dictionary.split("-")}async fetch(){return await fetch(this.src())}connectedCallback(){this.log(this.nodeName);this.render();this.connected&&this.connected()}log(...e){document.body.append(...e,document.createElement("br"))}query(e,t=this.shadowRoot||this){return t.querySelector(e)}get URIfier(){return document.querySelector("URIfier")}dispatch({name:e=this.nodeName,detail:t={},options:i={detail:t,bubbles:!0,composed:!0,cancelable:!1},root:n=this}){n.dispatchEvent(new CustomEvent(e,i))}}class t extends e{render(){fetch(this.src()).then((e=>e.text())).then((e=>this.setText(e)))}textarea(e){this.shadowRoot.innerHTML=`<style>textarea{width:100%}</style>${this.title()}<textarea>${e}</textarea><hr>`}}customElements.define('uri-input',class extends e{get dictionary(){return this.query("input").value}set dictionary(e){}render(){let e=localStorage.getItem("URIinput")||"https://URIfier.github.io/element.js?-customElements-define-HTMLElement-attachShadow-innerHTML";this.shadowRoot.innerHTML=`<input style="width:100%" value="${e}">`;this.query("input").onkeyup=e=>{this.dispatch({name:"update",detail:e.target.value})}}});customElements.define('uri-dictionary',class extends e{connected(){this.URIfier.addEventListener("update",(e=>{this.render()}))}render(){this.dictionary&&(this.shadowRoot.innerHTML=this.title()+this.dictionary().map(((e,t)=>`<div>${t}. ${e}</div>`)).join``)}});customElements.define('uri-source',class extends t{setText(e){this.textarea(e)}});customElements.define('uri-compressed',class extends t{setText(e){this.textarea(e.replace(/\.currentScript/g,"[d[21]]"))}})