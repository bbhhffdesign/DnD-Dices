document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.counter__container').forEach(counterContainer => {
      const numElement = counterContainer.querySelector('.counter__num');
      const subsButton = counterContainer.querySelector('.counter__subs');
      const addButton = counterContainer.querySelector('.counter__add');
      
      subsButton.addEventListener('click', () => {
        let currentValue = parseInt(numElement.innerText);
        if (currentValue > 0) {
          numElement.innerText = currentValue - 1;
        }
      });
  
      addButton.addEventListener('click', () => {
        let currentValue = parseInt(numElement.innerText);
        numElement.innerText = currentValue + 1;
      });
    });
  });