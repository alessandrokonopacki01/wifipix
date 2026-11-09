
// =====================================
// WIFI PIX - CONFIGURAÇÃO DOS PLANOS
// =====================================

// Por enquanto, o pagamento não é
// verificado automaticamente.
//
// Quando houver códigos Pix reais,
// eles poderão ser inseridos no
// campo "pix" de cada plano.

const PLANS = [
  {
    minutes: 15,
    label: "15 minutos",
    description: "Acesso rápido",
    price: "R$ 1,00",
    pix: ""
  },
  {
    minutes: 60,
    label: "1 hora",
    description: "Para navegar à vontade",
    price: "R$ 2,00",
    pix: ""
  },
  {
    minutes: 1440,
    label: "24 horas",
    description: "Um dia inteiro de acesso",
    price: "R$ 5,00",
    pix: ""
  }
];

const $ = id => document.getElementById(id);

let selected = 1;
let previousFocus = null;

// =====================================
// EXIBIR OS PLANOS
// =====================================

function renderPlans() {
  const container = $("plans");
  container.replaceChildren();

  PLANS.forEach((plan, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      "plan" + (index === selected ? " selected" : "");

    button.setAttribute(
      "aria-pressed",
      index === selected ? "true" : "false"
    );

    button.innerHTML = `
      <span class="plan-left">
        <span class="radio" aria-hidden="true"></span>
        <span>
          <span class="plan-title"></span><br>
          <span class="plan-sub"></span>
        </span>
      </span>
      <span class="price"></span>
    `;

    button.querySelector(".plan-title").textContent =
      plan.label;

    button.querySelector(".plan-sub").textContent =
      plan.description;

    button.querySelector(".price").textContent =
      plan.price;

    button.addEventListener("click", () => {
      selected = index;
      renderPlans();
    });

    container.appendChild(button);
  });
}

// =====================================
// ABRIR TELA DE PAGAMENTO
// =====================================

function openPayment() {
  const plan = PLANS[selected];

  previousFocus = document.activeElement;

  $("chosen-duration").textContent = plan.label;
  $("chosen-price").textContent = plan.price;

  $("pix-code").value = plan.pix;

  $("copy").disabled = !plan.pix.trim();
  $("copy").textContent = "Copiar código Pix";

  if (plan.pix.trim()) {
    $("pix-message").textContent =
      "Copie o código e pague pelo aplicativo do banco. " +
      "A liberação automática ainda não está disponível.";
  } else {
    $("pix-message").textContent =
      "Demonstração: código Pix ainda não configurado.";
  }

  $("backdrop").classList.add("show");
  $("close").focus();
}

// =====================================
// FECHAR TELA DE PAGAMENTO
// =====================================

function closePayment() {
  $("backdrop").classList.remove("show");

  if (previousFocus) {
    previousFocus.focus();
  }
}

// =====================================
// COPIAR CÓDIGO PIX
// =====================================

async function copyPix() {
  const pix = PLANS[selected].pix.trim();

  if (!pix) return;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(pix);
    } else {
      $("pix-code").focus();
      $("pix-code").select();

      const copied = document.execCommand("copy");

      if (!copied) {
        throw new Error("Falha ao copiar");
      }
    }

    $("copy").textContent = "✓ Código copiado!";

  } catch (error) {
    $("pix-code").focus();
    $("pix-code").select();

    $("pix-message").textContent =
      "Selecione o código acima e copie manualmente.";
  }
}

// =====================================
// EVENTOS DOS BOTÕES
// =====================================

$("continue").addEventListener("click", openPayment);

$("close").addEventListener("click", closePayment);

$("back").addEventListener("click", closePayment);

$("copy").addEventListener("click", copyPix);

$("backdrop").addEventListener("click", event => {
  if (event.target === $("backdrop")) {
    closePayment();
  }
});

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    $("backdrop").classList.contains("show")
  ) {
    closePayment();
  }
});

// =====================================
// INICIAR SITE
// =====================================

renderPlans();
