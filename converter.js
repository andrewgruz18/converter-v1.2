const units = {
  distance: { m: 1, km: 1000, mi: 1609.34, ft: 0.3048, in: 0.0254, yd: 0.9144, cm: 0.01, mm: 0.001, nmi: 1852, au: 1.496e+11 },
  temperature: {
    C: { to: val => val, from: val => val },
    F: { to: val => val * 9/5 + 32, from: val => (val - 32) * 5/9 },
    K: { to: val => val + 273.15, from: val => val - 273.15 }
  },
  weight: { g: 1, kg: 1000, mg: 0.001, lb: 453.592, oz: 28.3495, t: 1e6, ct: 0.2, st: 6350, gr: 0.0648, slug: 14593.9 },
  speed: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704, "kn": 0.514444 }
};

const els = {
  category: document.getElementById('category'),
  fromUnit: document.getElementById('fromUnit'),
  toUnit: document.getElementById('toUnit'),
  input: document.getElementById('inputValue'),
  result: document.getElementById('result')
};

function updateUnits() {
  const { category, fromUnit, toUnit, input } = els;
  fromUnit.innerHTML = toUnit.innerHTML = '';
  const currentUnits = units[category.value];

  Object.keys(currentUnits).forEach(unit => {
    fromUnit.add(new Option(unit, unit));
    toUnit.add(new Option(unit, unit));
  });

  fromUnit.selectedIndex = 0;
  toUnit.selectedIndex = 1;

  if (category.value === 'temperature') {
    input.removeAttribute('min');
  } else {
    input.setAttribute('min', '0');
    if (parseFloat(input.value) < 0) {
      input.value = '';
      els.result.textContent = 'Nav atļauta negatīva vērtība';
      return;
    }
  }

  convert();
}

function convert() {
  const { category, fromUnit, toUnit, input, result } = els;
  const val = parseFloat(input.value);

  if (isNaN(val)) {
    result.textContent = 'Ievadiet derīgu skaitli';
    return;
  }

  if (val < 0 && category.value !== 'temperature') {
    result.textContent = 'Nav atļauta negatīva vērtība';
    return;
  }

  const cat = category.value;

  let converted;
  if (cat === 'temperature') {
    const toFunc = units.temperature[toUnit.value].to;
    const fromFunc = units.temperature[fromUnit.value].from;
    converted = toFunc(fromFunc(val));
  } else {
    const ratio = units[cat][fromUnit.value] / units[cat][toUnit.value];
    converted = val * ratio;
  }

  result.textContent = converted.toFixed(4);
}

els.category.addEventListener('change', updateUnits);
els.input.addEventListener('input', convert);
els.fromUnit.addEventListener('change', convert);
els.toUnit.addEventListener('change', convert);

updateUnits();
