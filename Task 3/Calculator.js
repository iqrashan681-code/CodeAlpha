let display = document.getElementById("display");

// Add value to display
function append(value) {
    display.value += value;
}

// Clear display
function clearDisplay() {
    display.value = "";
}

// Delete last character
function backspace() {
    display.value = display.value.slice(0, -1);
}

// Calculate expression
function calculate() {
    try {
        display.value = eval(display.value);
    } catch {
        display.value = "Error";
    }
}

// BONUS: Keyboard Support
document.addEventListener("keydown", function(e) {
    let key = e.key;

    if (!isNaN(key) || "+-*/.".includes(key)) {
        append(key);
    }

    if (key === "Enter") calculate();
    if (key === "Backspace") backspace();
    if (key === "Escape") clearDisplay();
});
