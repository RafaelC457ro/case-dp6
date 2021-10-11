describe("Analytics", () => {
  beforeEach(() => {
    cy.log("**stub all GA calls**");
    // Do not let collect network calls get to Google Analytics. Instead intercept them
    // returning the status code 200. Since different events use different endpoints
    // let's define two intercepts to be precise
    cy.intercept("POST", "https://www.google-analytics.com/j/collect*", {
      statusCode: 200,
    }).as("collect");
    cy.intercept("GET", "https://www.google-analytics.com/collect*", {
      statusCode: 200,
    }).as("getCollect");
  });

  context("Page load", () => {
    it("should load home page", () => {
      cy.visit("/");
      cy.get(".secao-titulo").first().should("have.text", "Case Técnico");

      cy.wait("@collect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            type: url.get("t"),
            page: url.get("dt"),
          };
        })
        .should("deep.equal", {
          type: "pageview",
          page: "DP6 Case - Prova Técnica",
        });
    });

    it("should load Sobre page", () => {
      cy.visit("/analise.html");
      cy.get(".secao-titulo").first().should("have.text", "Análise");

      cy.wait("@collect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            type: url.get("t"),
            page: url.get("dt"),
          };
        })
        .should("deep.equal", {
          type: "pageview",
          page: "DP6 Case - Prova Técnica",
        });
    });

    it("should laod Contato page", () => {
      cy.visit("/sobre.html");
      cy.get(".secao-titulo").first().should("have.text", "Sobre");

      cy.wait("@collect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            type: url.get("t"),
            page: url.get("dt"),
          };
        })
        .should("deep.equal", {
          type: "pageview",
          page: "DP6 Case - Prova Técnica",
        });
    });
  });

  context("Link click", () => {
    it("should send a click menu contact", () => {
      cy.visit("/");
      cy.get(".secao-titulo").first().should("have.text", "Case Técnico");

      // avoid redirect
      cy.get('a[href="http://www.dp6.com.br/contato/"]').invoke(
        "removeAttr",
        "href"
      );

      cy.get("a").contains("Entre em Contato").click();

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "menu",
          ea: "entre_em_contato",
          el: "link_externo",
        });
    });

    it("should send a click Download PDF", () => {
      cy.visit("/");
      cy.get(".secao-titulo").first().should("have.text", "Case Técnico");

      // avoid redirect
      cy.get(
        'a[href="http://autos.dp6.com.br/autos_revista_vfinal.pdf"]'
      ).invoke("removeAttr", "href");

      cy.get("a").contains("Download PDF").click();

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "menu",
          ea: "download_pdf",
          el: "download_pdf",
        });
    });
  });

  context("See more click", () => {
    it("should send data when click Lorem", () => {
      cy.visit("/analise.html");
      cy.get(".secao-titulo").first().should("have.text", "Análise");

      cy.get('div[data-name="Lorem"]').contains("Lorem").click();

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "analise",
          ea: "ver_mais",
          el: "Lorem",
        });
    });

    it("should send data when click Ipsum", () => {
      cy.visit("/analise.html");
      cy.get(".secao-titulo").first().should("have.text", "Análise");

      cy.get('div[data-name="Ipsum"]').contains("Ipsum").click();

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "analise",
          ea: "ver_mais",
          el: "Ipsum",
        });
    });

    it("should send data when click Dolor", () => {
      cy.visit("/analise.html");
      cy.get(".secao-titulo").first().should("have.text", "Análise");

      cy.get('div[data-name="Dolor"]').contains("Dolor").click();

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "analise",
          ea: "ver_mais",
          el: "Dolor",
        });
    });
  });

  context("Form input fill", () => {
    it("should send data when input change", () => {
      cy.visit("/sobre.html");

      cy.get("input#nome").type("João da Silva");

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "contato",
          ea: "nome",
          el: "preencheu",
        });

      cy.get("input#email").type("joao@email.com");

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "contato",
          ea: "email",
          el: "preencheu",
        });

      cy.get("input#telefone").type("1199999999");

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "contato",
          ea: "telefone",
          el: "preencheu",
        });

      cy.get("input#aceito").click();

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "contato",
          ea: "aceito",
          el: "preencheu",
        });
    });

    it("should send data when submit form", () => {
      cy.visit("/sobre.html");

      cy.get("button[type=submit]").contains("Enviar").click();

      cy.get("body").should("have.class", "lightbox-open");

      cy.wait("@getCollect")
        .its("request.url")
        // extract the information from the URL search params step by step
        .then((s) => new URL(s))
        .its("searchParams")
        .then((url) => {
          return {
            ec: url.get("ec"),
            ea: url.get("ea"),
            el: url.get("el"),
          };
        })
        .should("deep.equal", {
          ec: "contato",
          ea: "enviado",
          el: "enviado",
        });
    });
  });
});
