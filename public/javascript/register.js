async function registerFormHandler(event) {
    event.preventDefault();

    const first_name = document.querySelector('#first_name').value.trim();
    const last_name = document.querySelector('#last_name').value.trim();
    const account_username = document.querySelector('#account_username').value.trim();
    const account_password = document.querySelector('#account_password').value.trim();

if( first_name && last_name && account_username && account_password) {
    const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
            first_name,
            last_name,
            account_username,
            account_password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
          console('success');
      } else {
          alert(response.statusText);
      }
    }
  }

document.querySelector('.account-form').addEventListener('submit', registerFormHandler);