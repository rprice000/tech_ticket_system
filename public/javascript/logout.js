
async function logout(event) {
    event.preventDefault();

    const result = await fetch("/api/users/logout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (result.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}

document.querySelector("#logout").addEventListener("click", logout);