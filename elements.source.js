let URIdictionary_variable = "DDD";
let URI = "https://urifier.github.io/elements.source.js";
let URIStrings = "-customElements-define-HTMLElement-attachShadow-innerHTML-nodeName-querySelector-input-split-render";
URIStrings = "-customElements-define-HTMLElement-attachShadow";
class URIElement extends HTMLElement {
  constructor() {
    super().attachShadow({
      mode: 'open'
    }).innerHTML = ``;
  }
  title(txt = this.nodeName) {
    return `<h4 style="margin:5px 0">${txt}</h4>`;
  }
  get URI() {
    return document.querySelector("uri-input#URI").query("input").value;
  }
  get source() {
    return document.querySelector("uri-source").query("textarea").value;
  }
  dictionary() {
    return this.URI.split("-");
  }
  connectedCallback() {
    this.log(this.nodeName);
    this.render();
    this.connected && this.connected();
    this.URIfier.addEventListener("update", (evt) => {
      this.update && this.update();
    });
  }
  log(...txt) {
    document.body.append(...txt, document.createElement("br"));
  }
  query(selector, root = this.shadowRoot || this) {
    return root.querySelector(selector);
  }
  get URIfier() {
    return document.querySelector("URIfier");
  }
  dispatch({
    name = this.nodeName,
    detail = {},
    options = {
      detail,
      bubbles: true,
      composed: true,
      cancelable: false,
    },
    root = this
  }) {
    root.dispatchEvent(new CustomEvent(name, options));
  }
  dispatchUpdate(detail = {}) {
    this.dispatch({
      name: "update",
      detail
    });
  }
  set HTML(html){
  	this.shadowRoot.innerHTML = html;
  }
}
class URITextarea extends URIElement {
  render() {
    fetch(this.URI)
      .then(res => res.text())
      .then(txt => {
        this.setText(txt)
        this.dispatchUpdate();
      });
  }
  textarea(txt, size = txt.length) {
    txt = txt.replace(/</g, "&lt;");
    this.HTML = `<style>textarea{width:100%;height:10em}</style>${this.title(this.nodeName+` ${size} Bytes`)}<textarea>${txt}</textarea>`;
  }
}
customElements.define('uri-input', class extends URIElement {
  render() {
  	let value="666";
		if(this.id=="URI") value = localStorage.getItem("URIinput") || URI + "?" + URIStrings;
    this.HTML = this.title() + `<input style="width:100%" value="${value}">`;
  }
	connected(){
    this.query("input").onkeyup = (evt) => {
      this.dispatchUpdate(evt.target.value);
    };
  }
});
customElements.define('uri-string', class extends URIElement {
  render() {
  	let str = "." + this.getAttribute("string");
    let count = this.source.split(new RegExp(str)).length;
		this.HTML = `<div>${this.getAttribute("idx")}. <b>${count}</b> ${str}</div>`;
  }
  update() {
    this.render();
  }
});
customElements.define('uri-dictionary', class extends URIElement {
  render() {
    this.URIfier.strings = {};
    let dict = this.dictionary();
    this.HTML = this.title() +
      dict.map((str, idx) => {
        if (idx) this.URIfier.strings[str] = {
          idx,
          count: 0
        };
        //          let count = txt.split(str);
        return `<uri-string idx="${idx}" string="${str}"></uri-string>`
      }).join ``;
  }
  update() {
    this.render();
  }
});
customElements.define('uri-source', class extends URITextarea {
  setText(txt) {
    this.textarea(txt);
  }
});
customElements.define('uri-compressed', class extends URITextarea {
  setText(txt) {
    let prefix = "let D=document.currentScript.src.split`-`;";
    //prefix += `let D="X-${this.dictionary().slice(1).join("-")}".split("-");`;
    this.textarea(prefix + txt);
  }
  update() {
    let txt = this.source;
    console.warn("C")
    Object.keys(this.URIfier.strings).map(str => {
      let data = this.URIfier.strings[str];
      str = "." + str;
      console.warn("URIfier", str);
      txt = txt.replaceAll(str, `[${URIdictionary_variable}[${data.idx}]]`)
    });
    this.setText(txt);
  }
});
