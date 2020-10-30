const container = document.querySelector('.container');
const textInput = document.querySelector('.text-input');
const textSubmitButton = document.querySelector('.text-input-submit');

// Define regex patterns
const BLANK = /{[^{]+}/g;
const BLANK_NON_GLOBAL = /{[^{]+}/;
const CURLIES = /[{}]/g;

const createInputForForm = (wordType, id) => {
  let ret = [];

  let label = document.createElement('label');
  label.innerText = `enter a ${wordType}:`;
  label.className = 'word-input-label';
  label.htmlFor = wordType + id;

  let newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.className = 'word-input';
  newInput.id = wordType + id;

  ret.push(label, newInput);
  return ret;
};

textSubmitButton.addEventListener('click', () => {
  let template = textInput.value;
  const allBlanks = [...template.matchAll(BLANK)];

  const generatedForm = document.createElement('form');
  generatedForm.className = 'blank-input-form';
  const formSubmitButton = document.createElement('button');
  formSubmitButton.className = '.form-input-submit .submit-button';
  formSubmitButton.innerText = 'submit';
 
  for (let blank of allBlanks) {
  	let inputForForm = createInputForForm(blank[0].replace(CURLIES, ''), blank['index']);
  	inputForForm.forEach((el) => {generatedForm.appendChild(el)});
  }
  
  textInput.remove();
  textSubmitButton.remove();
  container.appendChild(generatedForm);
  container.appendChild(formSubmitButton);
  attachListenerToFormSubmit(formSubmitButton, generatedForm, template);
});

const attachListenerToFormSubmit = (formSubmitButton, generatedForm, template) => {
  formSubmitButton.addEventListener('click', () => {
    const formElements = generatedForm.elements;

    for (let i = 0; i < formElements.length; i++) {
      let cur = formElements[i].value;
      template = template.replace(BLANK_NON_GLOBAL, cur);
    }

    const completedTemplateContainer = document.createElement('div');
    completedTemplateContainer.className = 'completed-template-container';
    completedTemplateContainer.innerText = template;

    generatedForm.remove();
    formSubmitButton.remove();
    container.appendChild(completedTemplateContainer);
  });
};
