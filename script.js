const container = document.querySelector('.container');
const textInput = document.querySelector('.text-input');
const textSubmitButton = document.querySelector('.text-input-submit');

let snadSnidTemplate;
let formattedSnadSnidTemplate;

const PUNCT = /[.,\/#!$%\^&\*;:=\-_`~()]/;
const createInputForForm = (snwordType, id) => {
  let ret = [];

  let label = document.createElement('label');
  label.innerText = `enter a ${snwordType}.`;
  label.className = 'snword-input-label';
  label.htmlFor = snwordType + id;

  let newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.className = 'snword-input';
  newInput.id = snwordType + id;

  ret.push(label, newInput);
  return ret;
};

textSubmitButton.addEventListener('click', () => {
  snadSnidTemplate = textInput.value.split(' ');
  formattedSnadSnidTemplate = snadSnidTemplate;
  console.log({ snadSnidTemplate });

  const generatedForm = document.createElement('form');
  const formSubmitButton = document.createElement('button');
  formSubmitButton.className = '.form-input-submit .submit-button';
  formSubmitButton.innerText = 'submit';

  let offset = 0;

  snadSnidTemplate.forEach((snword, i) => {
    if (snword[0] === '{') {
      let j = i;
      let end = false;
      let wordToSend = '';

      while (!end) {
        if (snadSnidTemplate[j].includes('}')) {
          wordToSend += (' ' + snadSnidTemplate[j]);
          end = true;
          if (j !== i) {
            let head = snadSnidTemplate.slice(0, j);
            let tail = snadSnidTemplate.slice(j + i);
            formattedSnadSnidTemplate = [...head, wordToSend, ...tail];
          }
        } else if (j === i) {
          wordToSend = snword;
          j++;
        } else {
          j++;
        }
      }

      let lastChar = wordToSend[wordToSend.length - 1];
      if (PUNCT.test(lastChar)) {
        let tail = formattedSnadSnidTemplate.slice(i + offset + 1);
        let head = formattedSnadSnidTemplate.slice(0, i + offset + 1);
        head.push(lastChar);
        formattedSnadSnidTemplate = [...head, ...tail];
        console.log({ formattedSnadSnidTemplate });
        wordToSend = wordToSend.replace(PUNCT, '');
        offset++;
      }

      let newInput = createInputForForm(wordToSend.replace(/[\{\}']+/g, ''), i);

      newInput.forEach((el) => { generatedForm.appendChild(el) });
    }
  });

  textInput.remove();
  textSubmitButton.remove();
  container.appendChild(generatedForm);
  container.appendChild(formSubmitButton);
  attachListenerToFormSubmit(formSubmitButton, generatedForm);
});

const attachListenerToFormSubmit = (formSubmitButton, generatedForm) => {
  formSubmitButton.addEventListener('click', () => {
    const formElements = generatedForm.elements;
    const retrievedInputVals = [];
    const completedSnadSnidArr = [];

    for (let i = 0; i < formElements.length; i++) {
      console.log(formElements[i].value);
      retrievedInputVals.push(formElements[i].value);
    }

    console.log({ formattedSnadSnidTemplate });
    formattedSnadSnidTemplate.forEach((snword, i) => {
	  //let next = formattedSnadSnidTemplate[i + 1];
      // if (snword[0] === "{") {
      //   completedSnadSnidArr[i] = snword + next;
      // } else if (snword[0] === "{") {
      //   completedSnadSnidArr[i] = retrievedInputVals.shift();
      // } else {
      //   completedSnadSnidArr[i] = snword;
      // }
      if (snword[0] === '{') {
        completedSnadSnidArr[i] = retrievedInputVals.shift();
      } else {
        console.log('hi');
        completedSnadSnidArr[i] = snword;
      }
    });

    const completedSnadSnid = completedSnadSnidArr.join(' ');
    const snadSnidContainer = document.createElement('div');

    snadSnidContainer.className = '.complete-snad-snid-container';
    snadSnidContainer.innerText = completedSnadSnid;

    generatedForm.remove();
    formSubmitButton.remove();
    container.appendChild(snadSnidContainer);
  });
};
