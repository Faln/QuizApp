const slider = document.getElementById("slider");
const output = document.getElementById("slider-value");

output.textContent = slider.value;

slider.addEventListener('input', () => {
    output.textContent = slider.value;
});