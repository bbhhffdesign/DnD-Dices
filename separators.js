document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.separator').forEach(separator => {
      const tab = separator.querySelector('.tab');

      tab.addEventListener('click', (event) => {
          // Aseguramos que el evento se active solo si el clic no ocurrió en un input .lock
          if (event.target.closest('.lock')) return; 
          separator.classList.toggle('collapsed');
      });
  });

  document.getElementById('attr-lock').addEventListener('change', (event) => {
      const isChecked = event.target.checked;
      const attrInputs = document.querySelectorAll('.attr-input');
      const attrButtons = document.querySelectorAll('.button-attr');
      const attrBoxes = document.querySelectorAll(".attribute");
      
      attrBoxes.forEach((button) => {
        button.classList.toggle("filter-greyscale")
      })
      attrInputs.forEach(input => {
          input.disabled = isChecked;
      });
      attrButtons.forEach(button => {
        if (isChecked) {
          button.classList.toggle("attr-btn-shadow")
        } else {
          button.style.color = '';
          button.classList.toggle("attr-btn-shadow")
        }
      });
  });

  document.getElementById('count-lock').addEventListener('change', (event) => {
      const isChecked = event.target.checked;
      const counterInputs = document.querySelectorAll('.counter__input');

      counterInputs.forEach(input => {
          input.disabled = isChecked;
      });
  });
});