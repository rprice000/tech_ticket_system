
async function handleSignIn(event) {
    event.preventDefault();

    const username = document.querySelector("#username1").value.trim();
    const password = document.querySelector("#password1").value.trim();

    if(!username || !password) {
        alert(`Please enter your email address and password to log in.`);
        return;
    }

    console.log(`Request received!`)

    const response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({
            username,
            password
        }),
        headers: { "Content-Type":"application/json" }
    });

    if(response.ok) {
        document.location.replace("/dashboard");
    } else {
        alert(response.statusText);
    }
}

document.querySelector("#sign-in").addEventListener("submit", handleSignIn);

async function handleRegister(event) {
    event.preventDefault();

    const username = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password2").value.trim();
    const firstName = document.querySelector("#firstName").value.trim();
    const lastName = document.querySelector("#lastName").value.trim();

    if(!username || !password || !firstName || !lastName) {
        alert(`Please enter your first and last names, email address, and password to sign up.`);
        return;
    }

    const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
            username,
            password,
            firstName,
            lastName
        }),
        headers: { "Content-Type":"application/json" }
    });

    if(response.ok) {
        document.location.replace("/login");
    } else {
        alert(response.statusText);
    }
}

document.querySelector("#register").addEventListener("submit", handleRegister);