
(() => {
    const inputTextArea = document.getElementById('inputTextArea');
    const outputDiv = document.getElementById('outputDiv');
    const multiplyButton = document.getElementById('multiplyButton');
    const textMultiplyerAutoUpdate = document.getElementById('textMultiplyerAutoUpdate');
    const caseOptions = document.getElementById('caseOptions');
    const multiplyFactor = document.getElementById('multiplyFactor');
    const darkModeCheckbox = document.getElementById('darkModeCheckbox');

    // Additional JavaScript for font size controls
    const increaseButton = document.getElementById('increaseButton');
    const decreaseButton = document.getElementById('decreaseButton');
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');

    let timer = null;
    let fontSize = parseInt(localStorage.getItem('fontSize')) || 16; // Default font size

    const defaultConfig = {
        autoUpdate: true,
        case: 'asItIs',
        factor: 1,
        darkMode: false,
        fontSize: 16
    };

    // Load the saved setting from localStorage, default to defaultConfig
    let textMultyConfig = JSON.parse(localStorage.getItem('textMultyConfig')) || defaultConfig;

    textMultiplyerAutoUpdate.checked = textMultyConfig.autoUpdate;
    document.getElementById(`rtextMultiplyerCase${textMultyConfig.case === 'asItIs' ? 1 : (textMultyConfig.case === 'lowercase' ? 2 : 3)}`).checked = true;
    multiplyFactor.value = textMultyConfig.factor;
    darkModeCheckbox.checked = textMultyConfig.darkMode;

    if (textMultyConfig.darkMode) {
        document.body.classList.add('dark-mode');
    }

    const multiplyLetters = () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            let output = [...inputTextArea.value].map(char => char.repeat(textMultyConfig.factor)).join('');
            if (textMultyConfig.case === 'lowercase') output = output.toLowerCase();
            if (textMultyConfig.case === 'uppercase') output = output.toUpperCase();
            outputDiv.innerText = output;
        }, 500);
    };

    caseOptions.addEventListener('change', e => {
        if (e.target.name === 'case') {
            textMultyConfig.case = e.target.value;
            localStorage.setItem('textMultyConfig', JSON.stringify(textMultyConfig));
            multiplyLetters();
        }
    });

    multiplyFactor.addEventListener('change', e => {
        textMultyConfig.factor = parseInt(e.target.value, 10);
        localStorage.setItem('textMultyConfig', JSON.stringify(textMultyConfig));
        multiplyLetters();
    });

    textMultiplyerAutoUpdate.addEventListener('change', e => {
        textMultyConfig.autoUpdate = e.target.checked;
        localStorage.setItem('textMultyConfig', JSON.stringify(textMultyConfig));
        if (textMultyConfig.autoUpdate) {
            inputTextArea.addEventListener('input', multiplyLetters);
        } else {
            inputTextArea.removeEventListener('input', multiplyLetters);
        }
    });

    darkModeCheckbox.addEventListener('change', e => {
        textMultyConfig.darkMode = e.target.checked;
        localStorage.setItem('textMultyConfig', JSON.stringify(textMultyConfig));
        if (textMultyConfig.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });

    multiplyButton.addEventListener('click', multiplyLetters);

    // Initialize event listener for auto update
    if (textMultyConfig.autoUpdate) {
        inputTextArea.addEventListener('input', multiplyLetters);
        multiplyLetters();  // This will multiply the saved text immediately
    }


    // Function to update font size in the outputDiv
    const updateFontSize = () => {
        outputDiv.style.fontSize = `${fontSize}px`;
        fontSizeDisplay.textContent = fontSize;
        localStorage.setItem('fontSize', fontSize); // Save the current font size
    };

    // Event listeners for the buttons
    increaseButton.addEventListener('click', () => {
        fontSize++;
        updateFontSize();
    });

    decreaseButton.addEventListener('click', () => {
        if (fontSize > 1) { // Prevent font size from going below 1
            fontSize--;
            updateFontSize();
        }
    });

    // Set initial font size
    updateFontSize();
})();