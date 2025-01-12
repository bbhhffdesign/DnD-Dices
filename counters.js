document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.counter__container').forEach(counterContainer => {
    const numElement = counterContainer.querySelector('.counter__num');
    const subsButton = counterContainer.querySelector('.counter__subs');
    const addButton = counterContainer.querySelector('.counter__add');
    
    function updateDisplay(value) {
      numElement.innerText = value < 10 ? `0${value}` : value; // Añade un "0" o espacio para un ancho fijo
    }

    subsButton.addEventListener('click', () => {
      let currentValue = parseInt(numElement.innerText, 10);
      if (currentValue > 0) {
        updateDisplay(currentValue - 1);
      }
    });

    addButton.addEventListener('click', () => {
      let currentValue = parseInt(numElement.innerText, 10);
      updateDisplay(currentValue + 1);
    });

    // Inicializa con formato correcto
    updateDisplay(parseInt(numElement.innerText, 10));
  });
});