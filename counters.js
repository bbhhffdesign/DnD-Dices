document.addEventListener("DOMContentLoaded", () => {
  const attributes = ["fue", "des", "con", "int", "sab", "car"];

  attributes.forEach(attr => {
    const input = document.getElementById(`mod-${attr}`);
    const savedValue = localStorage.getItem(`mod-${attr}`);
    if (savedValue !== null) {
      input.value = savedValue;
    }
    input.addEventListener("input", () => {
      localStorage.setItem(`mod-${attr}`, input.value);
    });
  });

  document.querySelectorAll('.counter__container').forEach((counterContainer, index) => {
    const numElement = counterContainer.querySelector('.counter__num');
    const subsButton = counterContainer.querySelector('.counter__subs');
    const addButton = counterContainer.querySelector('.counter__add');
    const inputName = counterContainer.querySelector('.counter__input');

    const counterKey = `counter-${index}`;
    const nameKey = `counter-name-${index}`;

    const savedValue = localStorage.getItem(counterKey);
    if (savedValue !== null) {
      numElement.innerText = savedValue.padStart(2, "0");
    }

    const savedName = localStorage.getItem(nameKey);
    if (savedName !== null) {
      inputName.value = savedName;
    }

    function updateDisplay(value) {
      numElement.innerText = value.toString().padStart(2, "0");
      localStorage.setItem(counterKey, value);
    }

    subsButton.addEventListener("click", () => {
      let currentValue = parseInt(numElement.innerText, 10);
      if (currentValue > 0) {
        updateDisplay(currentValue - 1);
      }
    });

    addButton.addEventListener("click", () => {
      let currentValue = parseInt(numElement.innerText, 10);
      updateDisplay(currentValue + 1);
    });

    inputName.addEventListener("input", () => {
      localStorage.setItem(nameKey, inputName.value);
    });
  });
});
