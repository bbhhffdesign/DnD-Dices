document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    const skillButtons = document.querySelectorAll('.skill-button');
    const proficiencyBonus = 2;
    let resultShown = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.innerText === 'C') {
                display.value = '';
                resultShown = false;
            } else if (button.innerText === '=') {
                calculateResult();
            } else if (['FUE', 'DES', 'CON', 'INT', 'SAB', 'CAR'].includes(button.innerText)) {
                handleAttributeRoll(button.innerText);
            } else {
                if (resultShown) {
                    display.value = ''; // Clear the display if result was shown
                    resultShown = false;
                }
                display.value += button.innerText;
            }
        });
    });

    skillButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleSkillRoll(button.id, button.dataset.attribute);
        });
    });

    function handleSkillRoll(skill, attribute) {
        const mod = parseInt(document.getElementById(`mod-${attribute}`).value) || 0;
        const useProficiency = document.getElementById(`${skill}-prof`).checked;
        const profBonus = useProficiency ? proficiencyBonus : 0;
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + mod + profBonus;
        let resultText = `(${roll}) + ${mod} + ${profBonus} = ${total}`;
        
        if (roll === 1 || roll === 20) {
            resultText += " crit";
        }

        display.value = resultText;
        resultShown = true;
    }

    function handleAttributeRoll(attribute) {
        const mod = parseInt(document.getElementById(`mod-${attribute.toLowerCase()}`).value) || 0;
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + mod;
        let resultText = `(${roll}) + ${mod} = ${total}`;
        
        if (roll === 1 || roll === 20) {
            resultText += " crit";
        }

        display.value = resultText;
        resultShown = true;
    }

    function calculateResult() {
        let expression = display.value;
        let dicePattern = /(\d*)d(\d+)/g;
        let match;
        let detailedExpression = expression;

        while ((match = dicePattern.exec(expression)) !== null) {
            let numDice = match[1] === '' ? 1 : parseInt(match[1]);
            let diceType = parseInt(match[2]);
            let rolls = [];
            for (let i = 0; i < numDice; i++) {
                rolls.push(Math.floor(Math.random() * diceType) + 1);
            }
            let rollSum = rolls.reduce((acc, curr) => acc + curr, 0);
            detailedExpression = detailedExpression.replace(match[0], `(${rolls.join(' + ')})`);
        }

        try {
            let result = eval(detailedExpression.replace(/\(([^)]+)\)/g, (_, group) => eval(group)));
            display.value = `${detailedExpression} = ${result}`;
            resultShown = true; // Set the flag that result is shown
        } catch {
            display.value = 'Error';
            resultShown = false;
        }
    }
});
