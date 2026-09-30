// js/submissions.js - Netlify-compatible form handling

document.addEventListener('DOMContentLoaded', () => {
  // Validate traumacore checkbox shows warning
  const traumacoreCheckbox = document.querySelector('input[name="webring"][value="traumacore"]');

  if (traumacoreCheckbox) {
    traumacoreCheckbox.addEventListener('change', () => {
      if (traumacoreCheckbox.checked) {
        const confirm = window.confirm(
          'Traumacore has specific community guidelines regarding survivor-only participation. ' +
          'Please ensure you\'ve reviewed the guidelines page before submitting.'
        );
        if (!confirm) {
          traumacoreCheckbox.checked = false;
        }
      }
    });
  }
});
