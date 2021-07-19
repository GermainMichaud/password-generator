const passwordForm = document.querySelector('#passwordForm');

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    numeric: getRandomNumber,
    special: getRandomSymbol
}

String.prototype.shuffle = function () {
    let a = this.split(''),
      n = a.length;
  
    for (let i = n - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join('');
  };

function generatePassword(passLength, {lower, upper, numeric, special}) {
    let generatedPassword = ''
    const typesCount = lower + upper + numeric + special
    const typesArr = [{lower},{upper},{numeric},{special}].filter(item => Object.values(item)[0])

    if (typesCount === 0) return ''

    for (let i = 0; i < passLength; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0]
            generatedPassword += randomFunc[funcName]()
        })
    }
    return generatedPassword.shuffle().slice(0, passLength)
}

passwordForm.addEventListener('submit', e => {
  e.preventDefault();
  const { target } = e;
  const passLength = parseInt(target.querySelector('#passLength').value, 10) || 20
  const checkboxes = ['lower', 'upper', 'numeric', 'special']
  const inputs = checkboxes.reduce((obj, key) => {
      return {
          ...obj,
          [key]: target.querySelector(`#${key}`).checked
      }
  }, {})
  document.querySelector('#generatedPassword').value = generatePassword(passLength, inputs)

});

document.querySelector('#generatedPassword').addEventListener('click', function() {
    this.select()
    this.setSelectionRange(0, 99999)
    document.execCommand('copy')
    alert('Mot de passe copié dans le presse papié')
})

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}
function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}
function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
}
function getRandomSymbol() {
    const symbols = '!@#$€£%^&*(){}[]=<>/,.-'
    return symbols[Math.floor(Math.random() * symbols.length)]
}


const nodeArray = (selector, parent = document) =>
  [].slice.call(parent.querySelectorAll(selector));

const allCheckboxes = nodeArray('input[type="checkbox"]');

addEventListener('change', e => {
  let check = e.target;

  if (allCheckboxes.indexOf(check) === -1) return;

  const children = nodeArray('input[type="checkbox"]', check.parentNode);
  children.forEach(child => (child.checked = check.checked));

  while (check) {
    const parent = check
      .closest(['ul'])
      .parentNode.querySelector('input[type="checkbox"]');
    const siblings = nodeArray(
      'input[type="checkbox"]',
      parent.closest('li').querySelector(['ul'])
    );

    const checkStatus = siblings.map(check => check.checked);
    const every = checkStatus.every(Boolean);
    const some = checkStatus.some(Boolean);

    parent.checked = every;
    parent.indeterminate = !every && every !== some;

    check = check != parent ? parent : 0;
  }
});
