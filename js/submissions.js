// js/submissions.js - Form handling for Netlify forms

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('submission-form');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        form.reset();
        successMsg.style.display = 'block';
        submitBtn.textContent = 'Submitted!';

        // Hide success message after 5 seconds
        setTimeout(() => {
          successMsg.style.display = 'none';
          submitBtn.textContent = 'Submit Request';
          submitBtn.disabled = false;
        }, 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      alert('Something went wrong. Please try again or email us directly.');
      console.error('Form error:', error);
      submitBtn.textContent = 'Submit Request';
      submitBtn.disabled = false;
    }
  });

  // Validate traumacore checkbox shows warning
  const traumacoreCheckbox = form.querySelector('input[name="webring"][value="traumacore"]');

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
