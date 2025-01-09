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
    const mod =
      parseInt(document.getElementById(`mod-${attribute}`).value) || 0;
    const useProficiency = document.getElementById(`${skill}-prof`).checked;
    const profBonus = useProficiency ? proficiencyBonus : 0;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + mod + profBonus;
    displayResult(roll, mod, profBonus, total);
  }

  function handleSavingThrowRoll(attribute) {
    const mod =
      parseInt(document.getElementById(`mod-${attribute}`).value) || 0;
    const useProficiency = document.getElementById(
      `sal-${attribute}-prof`
    ).checked;
    const profBonus = useProficiency ? proficiencyBonus : 0;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + mod + profBonus;
    displayResult(roll, mod, profBonus, total);
  }

  function handleAttributeRoll(attribute) {
    const mod =
      parseInt(
        document.getElementById(`mod-${attribute.toLowerCase()}`).value
      ) || 0;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + mod;
    displayResult(roll, mod, 0, total);
  }

  // function calculateResult(expression) {
  //   let dicePattern = /(\d*)d(\d+)/g;
  //   let match;
  //   let detailedExpression = expression;
  //   while ((match = dicePattern.exec(expression)) !== null) {
  //     let numDice = match[1] === "" ? 1 : parseInt(match[1]);
  //     let diceType = parseInt(match[2]);
  //     let rolls = [];
  //     for (let i = 0; i < numDice; i++) {        
  //       rolls.push(Math.floor(Math.random() * diceType) + 1);
  //     }
  //     let rollSum = rolls.reduce((acc, curr) => acc + curr, 0);
  //     detailedExpression = detailedExpression.replace(
  //       match[0],
  //       `(${rolls.join(" + ")})`
  //     );
  //   }
  //   try {
  //     let result = eval(
  //       detailedExpression.replace(/\(([^)]+)\)/g, (_, group) => eval(group))
  //     );
  //     display.value = `${detailedExpression} = ${result}`;
  //     lastRollExpression = expression;
  //     resultShown = true;
  //   } catch {
  //     display.value = "Error";
  //     resultShown = false;
  //   }
  // }
  function calculateResult(expression) {
    let dicePattern = /(\d*)d(\d+)/g;
    let match;
    let detailedExpression = expression;
    let isD20 = false; // Bandera para verificar si hay un d20.
    let d20Rolls = []; // Para almacenar las tiradas de d20.
  
    while ((match = dicePattern.exec(expression)) !== null) {
      let numDice = match[1] === "" ? 1 : parseInt(match[1]);
      let diceType = parseInt(match[2]);
      let rolls = [];
      for (let i = 0; i < numDice; i++) {
        rolls.push(Math.floor(Math.random() * diceType) + 1);
      }
  
      if (diceType === 20) {
        isD20 = true;
        d20Rolls = rolls; // Guardamos las tiradas de d20 para evaluar después.
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
          display.style.color = "red";
        } else if (d20Rolls.includes(20)) {
          display.style.color = "green";
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
    
    // Obtiene el valor del input asociado al atributo seleccionado
    const inputElement = document.getElementById(`mod-${attribute.toLowerCase()}`);
    const mod = parseInt(inputElement.value) || 0; // Asegura que siempre se obtiene un número
    return mod;
  }



  function displayResult(roll, mod, profBonus, total) {
    display.value = `(${roll}) + ${mod} + ${profBonus} = ${total}`;
    switch (roll) {
      case 1:
        display.style.color = "red";
        break;
      case 20:
        display.style.color = "green";
        break;
      default:
        display.style.color = "white";
        break;
    }
    resultShown = true;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Paladín
  const attackRolls = {
    'attack1': '2d6 + 2d8 + 3',
    'attack2': '1d12 + 5',
    'attack3': '1d12 + 5',
    'attack4': '1d12 + 5'
  };

  document.querySelectorAll(".attack").forEach((attackDiv, index) => {
    const attackId = `attack${index + 1}`;
    
    // Establecer el texto interno del div con la tirada de dados correspondiente
    attackDiv.innerText = attackRolls[attackId];
    
    // Agregar el checkbox al div después de establecer el texto
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('attack__crit');
    attackDiv.appendChild(checkbox);
    
    attackDiv.addEventListener("click", (event) => {
      // Evitar que el clic en el checkbox dispare la tirada
      if (event.target.classList.contains('attack__crit')) {
        return;
      }
      handleAttackRoll(attackDiv, attackId);
    });
  });

  function handleAttackRoll(attackDiv, attackId) {
    let rollExpression = attackRolls[attackId];
    const checkbox = attackDiv.querySelector(".attack__crit");
    
    // Verificar si el checkbox existe
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

