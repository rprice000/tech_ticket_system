
async function login(event) {
    event.preventDefault();

    const username = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    if(!username || !password) {
        document.querySelector('#form-notification').textContent = `You must include your email address and password to log in.`;
        return;
    }

    const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type":"application/json" }
    });

    if(response.ok) {
        window.location.replace('/dashboard');
    } else {
        document.querySelector('#form-notification').textContent = `${response.statusText}`;
    }
}

document.querySelector('.login-form').addEventListener('submit', login);
