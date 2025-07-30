const name = document.getElementById('name');
const email = document.getElementById('email');
const form = document.getElementById('signup_form');
const error = document.getElementById('error');

form.addEventListener('submit', event => {
    const submission = checkSubmission();

    if (submission.error !== "") {
        event.preventDefault();
    }

    error.innerText = submission.error;
});

function checkSubmission() {
    const p = password.value.trim();

    if (name.value.trim() == p) {
        return {error: "Name and password cannot be the same"};
    }

    if (p.length < 7) {
        return {error: "Password must be greater than 7 characters"};
    }

    return {error: ""};
}