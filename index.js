import { Templator } from "./templator/index.js";

function init(tmpl) {
  const templator = new Templator();

  const compiler = templator.compile(tmpl);

  const compiled = compiler({
    testArray: [
      {
        title: "Title1",
        content: "Content1",
        options: {
          isActive: false
        }
      },
      {
        title: "Title2",
        content: "Content2",
        options: {
          isActive: true
        }
      },
      {
        title: "Title3",
        content: "Content3",
        options: {
          isActive: false
        }
      },
    ],
    test: {
      msg: "Some message",
    },
    asd: "ASD",
    qwerty: "QWERTY",
  });
  
  document.body.innerHTML = compiled
}

const xhr = new XMLHttpRequest();
xhr.open("GET", "./templator/test.tmpl", true);
xhr.onreadystatechange = function () {
  if (this.readyState !== 4) return;
  if (this.status !== 200) return;

  init(this.responseText);
};
xhr.send();