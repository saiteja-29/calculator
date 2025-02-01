const display = document.getElementById("display");
const body = document.body;
let currentInput = "";
let operator = "";
let previousValue = "";
let result = 0;

function clearCalculator() {
  currentInput = "";
  previousValue = "";
  operator = "";
  updateDisplay("0");
}

function clearLastDigit() {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || "0");
  }
}

function square(a) {
  return a * a;
}

function updateDisplay(value) {
  display.innerText = value || "0";
}

function handleMultiplicationDivision(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "*" || tokens[i] === "/" || tokens[i] === "%") {
      let left = parseFloat(tokens[i - 1]);
      let right = parseFloat(tokens[i + 1]);
      let result;

      if (tokens[i] === "*") {
        result = left * right;
      } else if (tokens[i] === "/") {
        if (right === 0) return "Error"; // Handle division by zero
        result = left / right;
      } else if (tokens[i] === "%") {
        result = left % right;
      }

      tokens[i - 1] = result.toString();
      tokens.splice(i, 2);
      i--; // Adjust index due to token removal
    }
  }
  return tokens;
}

function handleAdditionSubtraction(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "+" || tokens[i] === "-") {
      let left = parseFloat(tokens[i - 1]);
      let right = parseFloat(tokens[i + 1]);
      let result;

      if (tokens[i] === "+") {
        result = left + right;
      } else if (tokens[i] === "-") {
        result = left - right;
      }

      tokens[i - 1] = result.toString();
      tokens.splice(i, 2);
      i--;
    }
  }
  return tokens;
}

function toggleOperator(lastOperator, newOperator) {
  if ((lastOperator === "+" && newOperator === "-") || (lastOperator === "-" && newOperator === "+")) {
    return newOperator;
  } else if ((lastOperator === "*" && newOperator === "/") || (lastOperator === "/" && newOperator === "*")) {
    return newOperator;
  } else if ((lastOperator === "%" && newOperator === "/") || (lastOperator === "/" && newOperator === "%")) {
    return newOperator;
  }
  return newOperator;
}

function evaluateExpression(expression) {
  let tokens = expression.split(/(\+|\-|\*|\/|\%|\^2|\(|\))/).filter(token => token.trim() !== "");
  
  tokens = handleMultiplicationDivision(tokens); // Handle *, /, %
  tokens = handleAdditionSubtraction(tokens); // Handle +, -

  return tokens[0]; // The result should be the first token now
}

function calculate() {
  try {
    if (currentInput) {
      result = evaluateExpression(currentInput);
      updateDisplay(result);
      currentInput = result.toString();
      previousValue = "";
      operator = "";
    }
  } catch (error) {
    updateDisplay("Error");
  }
}

function toggleDarkMode() {
  body.classList.toggle("dark-mode");
}

document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.innerText;

    if (!isNaN(value) || value === ".") {
      currentInput += value;
      updateDisplay(currentInput);
    } else if (["+", "-", "*", "/", "%"].includes(value)) {
      if (currentInput.length > 0 && ["+", "-", "*", "/", "%"].includes(currentInput[currentInput.length - 1])) {
        // If the last character was an operator, toggle the operator
        currentInput = currentInput.slice(0, -1); // Remove the last operator
        currentInput += toggleOperator(currentInput[currentInput.length - 1], value); // Add the toggled operator
      } else {
        currentInput += value;
      }
      updateDisplay(currentInput);
    } else if (value === "^2") {
      // Apply power to the last number only
      if (currentInput) {
        let lastNumber = currentInput.match(/(\d+(\.\d+)?)(?=\D*$)/); // Extract the last number in the string
        if (lastNumber) {
          let squared = square(parseFloat(lastNumber[0]));
          currentInput = currentInput.replace(lastNumber[0], squared.toString()); // Replace the last number with its square
          updateDisplay(currentInput);
        }
      }
    } else if (value === "AC") {
      clearCalculator();
    } else if (value === "CL") {
      clearLastDigit();
    } else if (value === "=") {
      if (currentInput) {
        calculate();
      }
    }
  });
});
