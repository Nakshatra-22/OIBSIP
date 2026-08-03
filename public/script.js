async function register() {

    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    const message = document.getElementById("registerMessage");

    if (!username || !email || !password) {
        message.style.color = "red";
        message.innerText = "Please fill all fields.";
        return;
    }

    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    const data = await response.json();

    message.style.color = data.success ? "green" : "red";
    message.innerText = data.message;

    if (data.success) {
        setTimeout(() => {
            window.location = "index.html";
        }, 1500);
    }
}



async function login() {

    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPassword").value;

    const message = document.getElementById("loginMessage");

    if (!username || !password) {
        message.style.color = "red";
        message.innerText = "Please enter all fields.";
        return;
    }

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await response.json();

    if (data.success) {
        window.location = "/dashboard";
    } else {
        message.style.color = "red";
        message.innerText = data.message;
    }

}



async function checkSession() {

    const response = await fetch("/check-session");
    const data = await response.json();

    if (!data.loggedIn) {

        if (window.location.pathname.includes("dashboard")) {
            window.location = "index.html";
        }

        return;
    }

    const welcome = document.getElementById("welcomeUser");

    if (welcome) {
        welcome.innerText = "Hello, " + data.user.username + "!";
    }

}



async function logout() {

    await fetch("/logout");

    window.location = "index.html";

}



window.onload = function () {

    if (window.location.pathname.includes("dashboard")) {
        checkSession();
    }

};