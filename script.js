// STATE — these 3 variables are the "memory" of the calculator
let current = "";       // number user is currently typing
let expression = "";    // the full expression like "12 + 5 *"
let justEvaled = false; // true right after hitting =

// DISPLAY — update both lines on screen
function updateDisplay() {
  document.getElementById('expression').textContent = expression;
  document.getElementById('current').textContent = current || "0";
}

// RESET — C button
function reset() {
  current = "";
  expression = "";
  justEvaled = false;
  updateDisplay();
}

// NUMBER INPUT — digits, dot, %, +/-
function handleNumber(val) {
  // Don't allow two decimal points
  if (val === '.' && current.includes('.')) return;

  // If just hit =, start fresh
  if (justEvaled) {
    current = "";
    expression = "";
    justEvaled = false;
  }

  if (val === '%') {
    if (current) current = String(parseFloat(current) / 100);
  } else if (val === '+/-') {
    if (current) {
      current = current.startsWith('-') ? current.slice(1) : '-' + current;
    }
  } else {
    // Replace leading zero, otherwise just append
    current = (current === '0') ? val : current + val;
  }

  updateDisplay();
}

// OPERATOR — +, -, *, /
function handleOperator(op) {
  if (!current && !expression) return; // nothing typed yet

  if (current !== '') {
    expression += current + ' ' + op + ' ';
    current = '';
  } else {
    // Replace last operator if user hits another one
    expression = expression.trimEnd().slice(0, -1) + op + ' ';
  }

  updateDisplay();
}

// EVALUATE — the = button
function evaluate() {
  const full = expression + current;
  if (!full.trim()) return;

  try {
    // Function() evaluates the math string safely
    const result = Function('"use strict"; return (' + full + ')')();
    const rounded = parseFloat(result.toFixed(10)); // fix floating point

    document.getElementById('expression').textContent = full + ' =';
    document.getElementById('current').textContent = rounded;

    expression = '';
    current = String(rounded);
    justEvaled = true;
  } catch (e) {
    document.getElementById('current').textContent = 'Error';
    expression = '';
    current = '';
  }
}

// EVENT LISTENER — one listener handles ALL buttons
// This is called "event delegation"
document.querySelector('.buttons').addEventListener('click', function(e) {
  const btn = e.target.closest('button');
  if (!btn) return; // clicked outside a button

  const val = btn.dataset.val; // read data-val from HTML

  if (val === 'C')              { reset(); return; }
  if (val === '=')              { evaluate(); return; }
  if (['+','-','*','/'].includes(val)) { handleOperator(val); return; }
  handleNumber(val);
});

// KEYBOARD SUPPORT — bonus
document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
  if (e.key === '.')                 handleNumber('.');
  if (e.key === '%')                 handleNumber('%');
  if (['+','-','*','/'].includes(e.key)) handleOperator(e.key);
  if (e.key === 'Enter' || e.key === '=') evaluate();
  if (e.key === 'Escape' || e.key === 'c') reset();
  if (e.key === 'Backspace') {
    current = current.slice(0, -1);
    updateDisplay();
  }
});