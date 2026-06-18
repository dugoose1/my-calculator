// ===== STATE =====
let currentValue = '';
let previousValue = '';
let operator = null;
let justCalculated = false;
let isPoweredOff = false;

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');
const calculator = document.getElementById('calculator');

// ===== UPDATE DISPLAY =====
function updateDisplay(value) {
  resultEl.textContent = value || '0';
}

// ===== BUTTON CLICKS =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (isPoweredOff && btn.dataset.action !== 'power') return;

    const val = btn.dataset.value;
    const action = btn.dataset.action;

    if (val !== undefined) handleDigit(val);
    if (action) handleAction(action);
  });
});

// ===== DIGIT INPUT =====
function handleDigit(val) {
  if (justCalculated) { currentValue = ''; justCalculated = false; }
  if (val === '.' && currentValue.includes('.')) return;
  if (currentValue.length >= 12) return;

  currentValue += val;
  updateDisplay(currentValue);
}

// ===== ACTIONS =====
function handleAction(action) {
  switch (action) {

    case 'power':
      isPoweredOff = !isPoweredOff;
      calculator.classList.toggle('powered-off', isPoweredOff);
      if (!isPoweredOff) {
        currentValue = ''; previousValue = ''; operator = null;
        updateDisplay('0');
        expressionEl.textContent = '';
      }
      break;

    case 'clear':
      currentValue = ''; previousValue = ''; operator = null;
      expressionEl.textContent = '';
      updateDisplay('0');
      break;

    case 'negate':
      if (!currentValue) return;
      currentValue = (parseFloat(currentValue) * -1).toString();
      updateDisplay(currentValue);
      break;

    case 'sqrt':
      if (!currentValue) return;
      const sqVal = parseFloat(currentValue);
      if (sqVal < 0) { updateDisplay('Error'); currentValue = ''; return; }
      expressionEl.textContent = `√(${sqVal})`;
      currentValue = Math.sqrt(sqVal).toString();
      updateDisplay(currentValue);
      justCalculated = true;
      break;

    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      if (currentValue === '' && previousValue === '') return;
      if (currentValue !== '' && previousValue !== '') calculate();
      operator = action;
      previousValue = currentValue || previousValue;
      expressionEl.textContent = `${previousValue} ${opSymbol(action)}`;
      currentValue = '';
      break;

    case 'equals':
      if (!operator || currentValue === '') return;
      calculate();
      operator = null;
      break;
  }
}

function calculate() {
  const a = parseFloat(previousValue);
  const b = parseFloat(currentValue);
  let result;

  expressionEl.textContent = `${a} ${opSymbol(operator)} ${b} =`;

  switch (operator) {
    case 'add':      result = a + b; break;
    case 'subtract': result = a - b; break;
    case 'multiply': result = a * b; break;
    case 'divide':
      if (b === 0) { updateDisplay('Error'); currentValue = ''; return; }
      result = a / b; break;
  }

  currentValue = parseFloat(result.toFixed(10)).toString();
  previousValue = '';
  justCalculated = true;
  updateDisplay(currentValue);
}

function opSymbol(op) {
  return { add:'+', subtract:'−', multiply:'×', divide:'÷' }[op] || '';
}

// ===========================
// 🎨 CUSTOMIZATION CONTROLS
// ===========================

// Upload background image
document.getElementById('bgUpload').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  document.body.style.backgroundImage = `url('${url}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
});

// Upload button texture
document.getElementById('btnUpload').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  // Apply texture to all digit buttons
  document.querySelectorAll('.btn.digit').forEach(btn => {
    btn.style.backgroundImage = `url('${url}')`;
    btn.style.backgroundSize = 'cover';
  });
});

// Change accent color
document.getElementById('accentColor').addEventListener('input', function () {
  document.documentElement.style.setProperty('--accent', this.value);
  document.documentElement.style.setProperty('--btn-special', this.value + '26');
});
