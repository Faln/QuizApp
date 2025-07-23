const fs = require("fs");

let questions = [];

fs.readFile('questions.json', (error, data) => {
    if (error) throw error;
    questions = JSON.parse(data);
    console.log(`Loaded ${questions.length} Questions`);
});

const slider = document.getElementById("range-slider");

let value = slider.value;
    
slider.oninput = () => {
  output.innerHTML = this.value;
}