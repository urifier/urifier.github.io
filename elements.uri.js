//let URI = "";
let URI = "https://raw.githubusercontent.com/urifier/urifier.github.io/main/elements.min.js";
let URIStrings = "-customElements-define-HTMLElement-attachShadow-innerHTML-nodeName-querySelector-input-split-render";
//URIStrings = "-customElements-define-HTMLElement-attachShadow";

function minify(js='Textual content') {
  (async () => {
    const rawResponse = await fetch('https://javascript-minifier.com/raw', {
      method: 'POST',
       mode: 'no-cors', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: js
      })
    });
    const content = await rawResponse.json();
    console.log(666,content);
  })();
}
//minify("let aap=21;");
class URIElement extends window.HTMLElement {
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
  get DictVar() {
    return document.querySelector("uri-input#VAR").query("input").value;
  }
  get source() {
    let sourceElement = document.querySelector("uri-source");
    if (sourceElement && sourceElement.query){
      return sourceElement.query("textarea").innerHTML;
    }else
      return "";
  }
  dictionary() {
    return this.URI.split("-");
  }
  connectedCallback() {
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
  set HTML(html) {
    this.shadowRoot.innerHTML = html;
  }
}
class URITextarea extends URIElement {
  render() {
    fetch(this.URI)
      .then(res => res.text())
      .then(txt => {
        console.warn("%c fetched ", "background:gold", txt.length, "Bytes", this.URI);
        this.setText(txt)
        this.dispatchUpdate();
      });
  }
  textarea(txt, size = txt.length) {
    txt = txt.replace(/</g, "&lt;");
    this.HTML = `<style>textarea{width:100%;height:10em}</style>${this.title(this.nodeName+` ${size} Bytes`)}<textarea>${txt}</textarea>`;
  }
}
window.customElements.define('uri-input', class extends URIElement {
  render() {
    let value = "D";
    if (this.id == "URI") value = localStorage.getItem("URIinput") || URI + "?" + URIStrings;
    this.HTML = this.title(this.getAttribute("title")) + `<input style="width:100%" value="${value}">`;
  }
  connected() {
    this.query("input").onkeyup = (evt) => {
      this.dispatchUpdate(evt.target.value);
    };
  }
});
window.customElements.define('uri-string', class extends URIElement {
  render() {
    let str = "." + this.getAttribute("string");
    let count = this.source.split(new RegExp(str)).length;
    this.HTML = `<div>${this.getAttribute("idx")}. <b>${count}</b> ${str}</div>`;
  }
  update() {
    this.render();
  }
});
window.customElements.define('uri-dictionary', class extends URIElement {
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
window.customElements.define('uri-source', class extends URITextarea {
  setText(txt) {
    this.textarea(txt);
  }
});
window.customElements.define('uri-compressed', class extends URITextarea {
  setText(txt) {
    let prefix = "let " + this.DictVar + "=document.currentScript.src.split`-`;";
    //prefix += `let D="X-${this.dictionary().slice(1).join("-")}".split("-");`;
    this.textarea(prefix + txt);
  }
  update() {
    let txt = this.source;
    Object.keys(this.URIfier.strings).map(str => {
      let data = this.URIfier.strings[str];
      str = "." + str;
      txt = txt.replaceAll(str, `[${this.DictVar}[${data.idx}]]`)
    });
    this.setText(txt);
  }
});
