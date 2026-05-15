import '@latty/web';

const form = document.getElementById('newsletter-form') as HTMLFormElement | null;
const emailField = document.querySelector('.email-field') as any;
const snackbar = document.getElementById('subscribe-snackbar') as any;

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!emailField?.value || !emailField.value.includes('@')) return;
  snackbar?.show();
  emailField.value = '';
});
