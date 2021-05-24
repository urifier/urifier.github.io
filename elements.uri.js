let D = document.currentScript.src.split`-`;
let e =
  "-customElements-define-HTMLElement-attachShadow-innerHTML-nodeName-querySelector-input-split-render";
e = "-customElements-define-HTMLElement-attachShadow";
class t extends window[D[3]] {
  constructor() {
    super()[D[4]]({ mode: "open" })[D[5]] = "";
  }
  title(e = this[D[6]]) {
    return `<h4 style="margin:5px 0">${e}</h4>`;
  }
  get URI() {
    return document[D[7]]("uri-input#URI").query("input").value;
  }
  get DictVar() {
    return document[D[7]]("uri-input#VAR").query("input").value;
  }
  get source() {
    let e = document[D[7]]("uri-source");
    return e && e.query ? e.query("textarea")[D[5]] : "";
  }
  dictionary() {
    return this.URI[D[9]]("-");
  }
  connectedCallback() {
    this[D[10]]();
    this.connected && this.connected();
    this.URIfier.addEventListener("update", (e) => {
      this.update && this.update();
    });
  }
  log(...e) {
    document.body.append(...e, document.createElement("br"));
  }
  query(e, t = this.shadowRoot || this) {
    return t[D[7]](e);
  }
  get URIfier() {
    return document[D[7]]("URIfier");
  }
  dispatch({
    name: e = this[D[6]],
    detail: t = {},
    options: i = { detail: t, bubbles: !0, composed: !0, cancelable: !1 },
    root: s = this,
  }) {
    s.dispatchEvent(new CustomEvent(e, i));
  }
  dispatchUpdate(e = {}) {
    this.dispatch({ name: "update", detail: e });
  }
  set HTML(e) {
    this.shadowRoot[D[5]] = e;
  }
}
class i extends t {
  render() {
    fetch(this.URI)
      .then((e) => e.text())
      .then((e) => {
        this.setText(e);
        this.dispatchUpdate();
      });
  }
  textarea(e, t = e.length) {
    e = e.replace(/</g, "<");
    this.HTML = `<style>textarea{width:100%;height:10em}</style>${this.title(
      this[D[6]] + ` ${t} Bytes`
    )}<textarea>${e}</textarea>`;
  }
}
window[D[1]][D[2]](
  "uri-input",
  class extends t {
    render() {
      let e = "D";
      "URI" == this.id &&
        (e =
          localStorage.getItem("URIinput") ||
          "https://raw.githubusercontent.com/urifier/urifier.github.io/main/elements.min.js?-customElements-define-HTMLElement-attachShadow");
      this.HTML = this.title() + `<input style="width:100%" value="${e}">`;
    }
    connected() {
      this.query("input").onkeyup = (e) => {
        this.dispatchUpdate(e.target.value);
      };
    }
  }
);
window[D[1]][D[2]](
  "uri-string",
  class extends t {
    render() {
      let e = "." + this.getAttribute("string"),
        t = this.source[D[9]](new RegExp(e)).length;
      this.HTML = `<div>${this.getAttribute("idx")}. <b>${t}</b> ${e}</div>`;
    }
    update() {
      this[D[10]]();
    }
  }
);
window[D[1]][D[2]](
  "uri-dictionary",
  class extends t {
    render() {
      this.URIfier.strings = {};
      let e = this.dictionary();
      this.HTML =
        this.title() +
        e.map((e, t) => {
          t && (this.URIfier.strings[e] = { idx: t, count: 0 });
          return `<uri-string idx="${t}" string="${e}"></uri-string>`;
        }).join``;
    }
    update() {
      this[D[10]]();
    }
  }
);
window[D[1]][D[2]](
  "uri-source",
  class extends i {
    setText(e) {
      this.textarea(e);
    }
  }
);
window[D[1]][D[2]](
  "uri-compressed",
  class extends i {
    setText(e) {
      let t = "let " + this.DictVar + "=document.currentScript.src[D[9]]`-`;";
      this.textarea(t + e);
    }
    update() {
      let e = this.source;
      Object.keys(this.URIfier.strings).map((t) => {
        let i = this.URIfier.strings[t];
        t = "." + t;
        e = e.replaceAll(t, `[${this.DictVar}[${i.idx}]]`);
      });
      this.setText(e);
    }
  }
);
