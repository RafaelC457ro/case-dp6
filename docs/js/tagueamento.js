// load google analytics
// prettier-ignore
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

// tools
function observerOnBodyClassChange(callback) {
  const e = document.querySelector("body");
  const observer = new MutationObserver(callback);

  observer.observe(e, {
    attributes: true,
    attributeFilter: ["class"],
    childList: false,
    characterData: false,
  });
}

function debounce(callback, wait) {
  let timeoutId = null;
  return function (...args) {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(function () {
      callback.apply(null, args);
    }, wait);
  };
}

// register trackers
function registerLinkEvent(selector, params) {
  const a = document.querySelector(selector);

  a.addEventListener("click", function (event) {
    event.preventDefault();
    const href = a.getAttribute("href");

    ga("send", "event", params[0], params[1], params[2], {
      hitCallback: function () {
        if (href) {
          window.location.href = href;
        }
      },
    });
  });
}

function registerAnalitcsInfo() {
  Array.from(document.querySelectorAll(".card.card-montadoras")).forEach(
    function (el) {
      const name = el.getAttribute("data-name");
      el.addEventListener("click", function () {
        ga("send", "event", "analise", "ver_mais", name);
      });
    }
  );
}

function registerFillField() {
  var form = document.querySelector("form.contato");

  if (!form) return false;

  Array.from(["nome", "email", "telefone", "aceito"]).forEach(function (field) {
    const input = document.querySelector(`#${field}`);

    if (input.getAttribute("type") === "checkbox") {
      input.addEventListener("change", function () {
        ga("send", "event", "contato", field, "preencheu");
      });
    }

    input.addEventListener(
      "keyup",
      debounce(function () {
        ga("send", "event", "contato", field, "preencheu");
      }, 800)
    );
  });
}

function registerSubmitForm() {
  observerOnBodyClassChange(function (event) {
    if (event.length && event[0].target.classList.contains("lightbox-open")) {
      ga("send", "event", "contato", "enviado", "enviado");
    }
  });
}

// init all

ga("create", "UA-12345-6", "auto");
ga("send", "pageview");

window.onhashchange = function () {
  // an example of calling into GA whenever there is a
  // hashchange. this is used for demonstration purposes
  ga("send", "pageview", location.pathname + location.search + location.hash);
};

registerLinkEvent('a[href="http://www.dp6.com.br/contato/"]', [
  "menu",
  "entre_em_contato",
  "link_externo",
]);

registerLinkEvent(
  'a[href="http://autos.dp6.com.br/autos_revista_vfinal.pdf"]',
  ["menu", "download_pdf", "download_pdf"]
);

registerAnalitcsInfo();
registerFillField();
registerSubmitForm();
