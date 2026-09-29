// Keep only this part temporarily
document.addEventListener('DOMContentLoaded', () => {
  const traumacoreCheckbox = document.querySelector('input[name="webring"][value="traumacore"]');
  if (traumacoreCheckbox) {
    traumacoreCheckbox.addEventListener('change', () => {
      if (traumacoreCheckbox.checked) {
        const confirm = window.confirm('Traumacore has specific community guidelines...');
        if (!confirm) {
          traumacoreCheckbox.checked = false;
        }
      }
    });
  }
});
