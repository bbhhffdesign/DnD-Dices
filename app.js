document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".button");
  const skillButtons = document.querySelectorAll(".skill-button");
  const savingThrowButtons = document.querySelectorAll(".salvation .button-sm");
  const proficiencyBonus = 2;
  let resultShown = false;
  let lastRollExpression = "";

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.innerText === "C") {
        display.value = "";
        resultShown = false;
        lastRollExpression = ""; 
      } else if (button.innerText === "=") {
        if (lastRollExpression !== "") {
          display.value = lastRollExpression;
          calculateResult(lastRollExpression);
        } else {
          calculateResult(display.value);
        }
      } else if (
        ["FUE", "DES", "CON", "INT", "SAB", "CAR"].includes(button.innerText)
      ) {
        handleAttributeRoll(button.innerText);
      } else {
        if (resultShown) {
          display.value = "";
          resultShown = false;
        }
        display.value += button.innerText;
      }
    });
  });

  skillButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleSkillRoll(button.id, button.dataset.attribute);
    });
  });

  savingThrowButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const attribute = button.parentNode.classList[1].split("-")[1];
      handleSavingThrowRoll(attribute);
    });
  });
  function handleSkillRoll(skill, attribute) {
    const mod = parseInt(document.getElementById(`mod-${attribute}`).value) || 0;
    const useProficiency = document.getElementById(`${skill}-prof`).checked;
    const useDoubleProficiency = document.getElementById(`${skill}-dbl-prof`).checked;
    const useHalfProficiency = document.getElementById('half-prof').checked;

    let profBonus = 0;
    if (useDoubleProficiency) {
        profBonus = proficiencyBonus * 2;
    } else if (useProficiency) {
        profBonus = proficiencyBonus;
    } else if (useHalfProficiency) {
        profBonus = Math.floor(proficiencyBonus / 2); // Redondea hacia abajo
    }

    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + mod + profBonus;
    displayResult(roll, mod, profBonus, total);
}

function handleSavingThrowRoll(attribute) {
    const mod = parseInt(document.getElementById(`mod-${attribute}`).value) || 0;
    const useProficiency = document.getElementById(`sal-${attribute}-prof`).checked;
    const useDoubleProficiency = document.getElementById(`sal-${attribute}-dbl-prof`)?.checked || false;
    const profBonus = useProficiency ? proficiencyBonus : 0;
    const doubleProfBonus = useDoubleProficiency ? proficiencyBonus : 0;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + mod + profBonus + doubleProfBonus;
    displayResult(roll, mod, profBonus + doubleProfBonus, total);
}

  function handleAttributeRoll(attribute) {
    const attrProf = document.getElementById("attr-prof").checked;
        
    const mod =
      parseInt(
        document.getElementById(`mod-${attribute.toLowerCase()}`).value
      ) || 0;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + mod;
    displayResult(roll, mod,  attrProf ? 0 : 2, total);
    
  }

  function calculateResult(expression) {
    let dicePattern = /(\d*)d(\d+)/g;
    let match;
    let detailedExpression = expression;
    let isD20 = false; 
    let d20Rolls = []; 
  
    while ((match = dicePattern.exec(expression)) !== null) {
      let numDice = match[1] === "" ? 1 : parseInt(match[1]);
      let diceType = parseInt(match[2]);
      let rolls = [];
      for (let i = 0; i < numDice; i++) {
        rolls.push(Math.floor(Math.random() * diceType) + 1);
      }
  
      if (diceType === 20) {
        isD20 = true;
        d20Rolls = rolls; 
      }
  
      let rollSum = rolls.reduce((acc, curr) => acc + curr, 0);
      detailedExpression = detailedExpression.replace(
        match[0],
        `(${rolls.join(" + ")})`
      );
    }
  
    try {
      let result = eval(
        detailedExpression.replace(/\(([^)]+)\)/g, (_, group) => eval(group))
      );
      display.value = `${detailedExpression} = ${result}`;
      lastRollExpression = expression;
      resultShown = true;
  
      if (isD20) {
        if (d20Rolls.includes(1)) {
          display.style.color = "#ff0000";
        } else if (d20Rolls.includes(20)) {
          display.style.color = "#46d665";
          
        } else {
          display.style.color = "white"; 
        }
      } else {
        display.style.color = "white";
      }
  
    } catch {
      display.value = "Error";
      resultShown = false;
      display.style.color = "black";
    }
  }




  const customRollButton = document.getElementById("custom-roll-btn");
  customRollButton.addEventListener("click", handleCustomRoll);

  function handleCustomRoll() {
    const attribute = document.getElementById("attribute-select").value;
    const addProficiency = document.getElementById("add-proficiency-bonus").checked;

    const mod = getAttributeModifier(attribute);
    const profBonus = addProficiency ? proficiencyBonus : 0;

    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + mod + profBonus;

    displayResult(roll, mod, profBonus, total);
  }

  function getAttributeModifier(attribute) {
    if (attribute === 'none') {
      return 0;
    }
    
    const inputElement = document.getElementById(`mod-${attribute.toLowerCase()}`);
    const mod = parseInt(inputElement.value) || 0; 
    return mod;
  }

  function displayResult(roll, mod, profBonus, total) {
    display.value = `(${roll}) + ${mod} + ${profBonus} = ${total}`;
    switch (roll) {
      case 1:
        display.style.color = "#ff0000"; //rojo
        display.style.fontWeight = "600";
        break;
      case 20:
        display.style.color = "#46d665"; //verde
        display.style.fontWeight = "600";
        break;
      default:
        display.style.color = "white";
        display.style.fontWeight = "400";
        break;
    }
    resultShown = true;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Paladín
  // const attackRolls = {
  //   'attack1': '2d6 + 3',
  //   'attack2': '1d8 + 3',
  //   'attack3': '2d20 + 1d6 + 3',
  //   'attack4': '2d20'
  // };

  // document.querySelectorAll(".attack").forEach((attackDiv, index) => {
  //   const attackId = `attack${index + 1}`;
    
  //   attackDiv.innerText = attackRolls[attackId];
    
  //   const checkbox = document.createElement('input');
  //   checkbox.type = 'checkbox';
  //   checkbox.classList.add('attack__crit');
  //   attackDiv.appendChild(checkbox);
    
  //   attackDiv.addEventListener("click", (event) => {
  //     if (event.target.classList.contains('attack__crit')) {
  //       return;
  //     }
  //     handleAttackRoll(attackDiv, attackId);
  //   });
  // });
  document.querySelectorAll(".attack").forEach((attackDiv) => {
    const input = attackDiv.querySelector(".attack__input");
    const checkbox = attackDiv.querySelector(".attack__crit");
  
    // Evitar que el input intercepte clics
    input.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  
    attackDiv.addEventListener("click", () => {
      const rollExpression = input.value.trim(); // Obtiene la tirada escrita en el input
      if (!rollExpression) {
        alert("Escribe una tirada en el input antes de lanzar los dados.");
        return;
      }
  
      const isCrit = checkbox.checked; // Verifica si el crítico está activado
      const finalExpression = adjustRollForCrit(rollExpression, isCrit); // Ajusta los dados si es crítico
  
      calculateResult(finalExpression); // Calcula y muestra el resultado
    });
  });
  
  function adjustRollForCrit(expression, isCrit) {
    if (!isCrit) return expression;
  
    // Duplica los dados en la tirada (p. ej., "2d8+1d4" -> "4d8+2d4")
    return expression.replace(/(\d*)d(\d+)/g, (_, numDice, diceType) => {
      const doubledDice = numDice === "" ? 2 : parseInt(numDice) * 2;
      return `${doubledDice}d${diceType}`;
    });
  }

  function handleAttackRoll(attackDiv, attackId) {
    let rollExpression = attackRolls[attackId];
    const checkbox = attackDiv.querySelector(".attack__crit");
    

    if (checkbox) {
      const isCrit = checkbox.checked;
      rollExpression = adjustRollForCrit(rollExpression, isCrit);
    }

    calculateResult(rollExpression);
  }

  function adjustRollForCrit(expression, isCrit) {
    if (!isCrit) return expression;
    
    return expression.replace(/(\d*)d(\d+)/g, (_, numDice, diceType) => {
      const doubledDice = numDice === '' ? 2 : parseInt(numDice) * 2;
      return `${doubledDice}d${diceType}`;
    });
  }

  function calculateResult(expression) {
    let dicePattern = /(\d*)d(\d+)/g;
    let match;
    let detailedExpression = expression;
    while ((match = dicePattern.exec(expression)) !== null) {
      let numDice = match[1] === "" ? 1 : parseInt(match[1]);
      let diceType = parseInt(match[2]);
      let rolls = [];
      for (let i = 0; i < numDice; i++) {
        rolls.push(Math.floor(Math.random() * diceType) + 1);
      }
      let rollSum = rolls.reduce((acc, curr) => acc + curr, 0);
      detailedExpression = detailedExpression.replace(
        match[0],
        `(${rolls.join(" + ")})`
      );
    }

    try {
      let result = eval(
        detailedExpression.replace(/\(([^)]+)\)/g, (_, group) => eval(group))
      );
      document.getElementById("display").value = `${detailedExpression} = ${result}`;
    } catch {
      document.getElementById("display").value = "Error";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const attributeSelect = document.getElementById("attribute-select");

  attributeSelect.addEventListener("change", () => {
    attributeSelect.classList.remove('clr-fue', 'clr-des', 'clr-int', 'clr-sab', 'clr-car');

    const selectedOption = attributeSelect.options[attributeSelect.selectedIndex];
    const classToAdd = selectedOption.classList[0];

    if (classToAdd) {
      attributeSelect.classList.add(classToAdd);
    }
  });
});