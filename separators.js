document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.separator').forEach(separator => {
      const tab = separator.querySelector('.tab');
      tab.addEventListener('click', () => {
        separator.classList.toggle('collapsed');
      });
    });
  });