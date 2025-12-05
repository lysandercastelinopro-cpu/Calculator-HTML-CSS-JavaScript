const inputBox = document.getElementById("input");
const expressionDiv = document.getElementById("expression");
const resultDiv = document.getElementById("result");

let expression = "";
let result = "";

let lastExpression = "";

function buttonClick(event) {
  const target = event.target.closest("button");
  if (!target) return;

  target.classList.add("pressed");
  setTimeout(() => target.classList.remove("pressed"), 120);

  const action = target.dataset.actions;
  const value = target.dataset.value;

  switch (action) {
    case "number":
      addValue(value);
      break;

    case "clear":
      clear();
      break;

    case "backspace":
      backspace();
      break;

    case "addition":
    case "subtraction":
    case "multiplication":
    case "division":
      if (expression === "" && result !== "") {
        startFromResult(value);
      } else if (expression !== "" && !isLastCharOperator()) {
        addValue(value);
      }
      break;

    case "submit":
      submit();
      break;

    case "negate":
      negate();
      break;

    case "mod":
      percentage();
      break;

    case "decimal":
      decimal(value);
      break;
  }

  updateDisplay(expression, result);
}

inputBox.addEventListener("click", buttonClick);

function updateDisplay(expression, resultValue) {
  const displayExpression = expression.replace(/\*/g, "×").replace(/\//g, "÷");

  expressionDiv.textContent = displayExpression;
  resultDiv.textContent = resultValue;

  const isFirstNonEmpty = lastExpression === "" && expression !== "";

  if (isFirstNonEmpty) {
    expressionDiv.classList.remove("fade");
    void expressionDiv.offsetWidth;
    expressionDiv.classList.add("fade");
  }

  lastExpression = expression;
}

function animateResult() {
  resultDiv.classList.remove("fade");
  void resultDiv.offsetWidth;
  resultDiv.classList.add("fade");
}

function addValue(value) {
  expression += value;
}

function clear() {
  expression = "";
  result = "";
  lastExpression = "";
}

function backspace() {
  expression = expression.slice(0, -1);
}

function isLastCharOperator() {
  return ["+", "-", "*", "/"].includes(expression.slice(-1));
}

function startFromResult(value) {
  expression = result + value;
  lastExpression = "";
}

function submit() {
  if (expression === "") {
    animateResult();
    return;
  }

  result = evaluateExpression();
  expression = "";
  lastExpression = "";
  animateResult();
}

function evaluateExpression() {
  try {
    const evalResult = eval(expression);
    return isNaN(evalResult) || !isFinite(evalResult)
      ? ""
      : parseFloat(evalResult.toFixed(8));
  } catch {
    return "";
  }
}

function negate() {
  if (expression === "" && result !== "") {
    result = -result;
    animateResult();
  } else if (!expression.startsWith("-") && expression !== "") {
    expression = "-" + expression;
  } else if (expression.startsWith("-")) {
    expression = expression.slice(1);
  }
}

function percentage() {
  if (expression !== "") {
    result = evaluateExpression();
    expression = "";
    if (!isNaN(result) && isFinite(result)) {
      result /= 100;
    } else {
      result = "";
    }
    lastExpression = "";
    animateResult();
  } else if (result !== "") {
    result = parseFloat(result) / 100;
    animateResult();
  }
}

function decimal(value) {
  value = value || ".";
  if (!expression.endsWith(".") && !isLastCharOperator()) {
    addValue(value);
  }
}
