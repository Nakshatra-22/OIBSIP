const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, "users.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "login_authentication_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    })
);

app.use(express.static(path.join(__dirname, "public")));

function getUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, "[]");
    }

    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users, null, 2)
    );
}
// Register
app.post("/register", async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.json({
            success: false,
            message: "All fields are required."
        });
    }

    const passwordRegex = /^(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.json({
            success: false,
            message: "Password must be at least 8 characters and contain at least one number."
        });
    }

    const users = getUsers();

    const existingUser = users.find(
        user =>
            user.username === username ||
            user.email === email
    );

    if (existingUser) {
        return res.json({
            success: false,
            message: "Username or Email already exists."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        username,
        email,
        password: hashedPassword
    });

    saveUsers(users);

    res.json({
        success: true,
        message: "Registration successful!"
    });

});


// Login
app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            message: "Please enter all fields."
        });
    }

    const users = getUsers();

    const user = users.find(
        u =>
            u.username === username ||
            u.email === username
    );

    if (!user) {
        return res.json({
            success: false,
            message: "Invalid username/email or password."
        });
    }

    const match = await bcrypt.compare(
        password,
        user.password
    );

    if (!match) {
        return res.json({
            success: false,
            message: "Invalid username/email or password."
        });
    }

    req.session.user = {
        username: user.username,
        email: user.email
    };

    res.json({
        success: true
    });

});
// Check Session
app.get("/check-session", (req, res) => {

    if (req.session.user) {
        return res.json({
            loggedIn: true,
            user: req.session.user
        });
    }

    res.json({
        loggedIn: false
    });

});


// Logout
app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.json({
            success: true
        });
    });

});


// Protect Dashboard
app.get("/dashboard", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/index.html");
    }

    res.sendFile(
        path.join(__dirname, "public", "dashboard.html")
    );

});


// Start Server
app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});