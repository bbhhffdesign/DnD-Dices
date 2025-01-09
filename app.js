document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    const proficiencyBonus = 2; // El bono de competencia
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
            } else if (['Sal Fue', 'Sal Des', 'Sal Con', 'Sal Int', 'Sal Sab', 'Sal Car'].includes(button.innerText)) {
                handleSavingThrow(button.innerText);
            } else if (button.classList.contains('skill-button')) {
                handleSkillRoll(button);
            } else {
                if (resultShown) {
                    display.value = ''; // Clear the display if result was shown
                    resultShown = false;
                }
                display.value += button.innerText;
            }
        });
    });

    // Función para las tiradas de habilidad
    function handleSkillRoll(button) {
        // Obtener el atributo correspondiente para la habilidad
        const attribute = button.dataset.attribute;  // 'fue', 'des', 'int', etc.
        
        // Obtener el bonificador del atributo
        const mod = parseInt(document.getElementById(`mod-${attribute}`).value) || 0;
        
        // Verificar si el checkbox está marcado para añadir el bono de competencia
        const skillProfCheckbox = document.getElementById(`${button.id}-prof`);
        const useProficiency = skillProfCheckbox && skillProfCheckbox.checked;
        const profBonus = useProficiency ? proficiencyBonus : 0;

        // Realizamos la tirada de dado de 20 caras
        const roll = Math.floor(Math.random() * 20) + 1;
        
        // Calculamos el total de la tirada
        const total = roll + mod + profBonus;
        
        // Generamos el texto del resultado
        let resultText = `(${roll}) + ${mod} + ${profBonus} = ${total}`;
        
        // Si el dado es 1 o 20, es una crítica
        if (roll === 1 || roll === 20) {
            resultText += " crit";
        }

        // Mostramos el resultado
        display.value = resultText;
        resultShown = true;
    }

    // Función para las tiradas de salvación
    function handleSavingThrow(savingThrow) {
        const attribute = savingThrow.split(' ')[1].toLowerCase();  // 'Fue', 'Des', etc.
        
        // Obtenemos el bonificador del atributo
        const mod = parseInt(document.getElementById(`mod-${attribute}`).value) || 0;
        
        // Verificamos si el checkbox está marcado para añadir el bono de competencia
        const useProficiency = document.getElementById(`sal-${attribute}-prof`).checked;
        const profBonus = useProficiency ? proficiencyBonus : 0;

        // Realizamos la tirada de dado de 20 caras
        const roll = Math.floor(Math.random() * 20) + 1;
        
        // Calculamos el total de la tirada
        const total = roll + mod + profBonus;
        
        // Generamos el texto del resultado
        let resultText = `(${roll}) + ${mod} + ${profBonus} = ${total}`;
        
        // Si el dado es 1 o 20, es una crítica
        if (roll === 1 || roll === 20) {
            resultText += " crit";
        }

        // Mostramos el resultado
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
