document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".button");
  const skillButtons = document.querySelectorAll(".skill-button");
  const savingThrowButtons = document.querySelectorAll(".salvation .button-sm");
  const proficiencyBonus = 2;
  let resultShown = false;
  let lastRollExpression = ""; // Variable para guardar la última expresión de la tirada.

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.innerText === "C") {
        display.value = "";
        resultShown = false;
        lastRollExpression = ""; // Limpiamos la última expresión.
      } else if (button.innerText === "=") {
        if (lastRollExpression !== "") {
          // Si hay una expresión guardada, repetirla.
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
      display.value = `${detailedExpression} = ${result}`;
      lastRollExpression = expression; // Guardamos la expresión para repetirla más tarde.
      resultShown = true;
    } catch {
      display.value = "Error";
      resultShown = false;
    }
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
        display.style.color = "black";
        break;
    }
    resultShown = true;
  }
});
