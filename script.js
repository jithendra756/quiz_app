// declarations and initializations
const tracking = document.querySelector(".tracking");
const optionRows = document.querySelectorAll(".o1");
const qno = document.querySelector(".qno");
const ques = document.querySelector(".ques");
const option = document.querySelectorAll(".option");
const prevbtn = document.querySelector(".prev");
const nextbtn = document.querySelector(".next");
const subbtn = document.querySelector(".submit");
const optionNumber = document.querySelectorAll(".on");
const progressBar = document.querySelector(".progress-bar");

const numberOfQuestions = 25;
let selectedAnswers = new Array(numberOfQuestions).fill(null);
localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));

// set up of tracking division
for (let i = 1; i <= numberOfQuestions; i++) {
  const p = document.createElement("p");
  p.textContent = i;
  tracking.appendChild(p);
}

// effect functions
const mef = (par1, par2) => {
  par1.style.transform = "scale(1.1)";
  par1.style.transition = "transform 0.2s ease";
  par1.style.backgroundColor = "#f98092";
  par2.style.transform = "scale(1.04)";
  par2.style.border = "2px solid rgb(51, 2, 100)";
  par2.style.transition = "transform 0.2s ease";
};

const mlf = (par1, par2) => {
  par1.style.transition = "none";
  par2.style.transition = "none";
  par1.style.transform = "scale(1)";
  par1.style.backgroundColor = "#fca0ae";
  par2.style.transform = "scale(1)";
  par2.style.border = "1px solid rgb(51, 2, 100)";
};

// load questions
async function loadQuestions() {
  const res = await fetch("questions.json");
  const data = await res.json();
  return data;
}

// main
async function startQuiz() {
  let quesnumber = 1;
  prevbtn.style.opacity = 0.2;
  const questions = await loadQuestions();
  let selectedRow = null;

  // setup question number
  const questionNumber = document.createElement("h3");
  questionNumber.textContent = quesnumber;
  qno.appendChild(questionNumber);

  // setup question
  const question = document.createElement("p");
  question.textContent = questions[quesnumber - 1].question;
  ques.appendChild(question);

  // setup options for current question
  for (let i = 0; i < 4; i++) {
    const p = document.createElement("p");
    p.textContent = questions[quesnumber - 1].options[i];
    option[i].appendChild(p);
  }

  // tracking highlight
  const makePActive = () => {
    const p = tracking.querySelectorAll("p")[quesnumber - 1];
    document.querySelectorAll(".tracking p").forEach((el) => el.classList.remove("active"));
    p.classList.add("active");
  };
  makePActive();

  // reset visuals
  function resetOptions() {
    optionRows.forEach((row) => {
      row.classList.remove("selected");
      const optionIdentifier = row.querySelector(".on");
      const optionContent = row.querySelector(".option");
      mlf(optionIdentifier, optionContent);
    });
    selectedRow = null;
  }

  // render question + restore previous selection
  const setQuestion = () => {
    questionNumber.textContent = quesnumber;
    question.textContent = questions[quesnumber - 1].question;

    for (let i = 0; i < 4; i++) {
      const optionContent = option[i].querySelector("p");
      optionContent.textContent = questions[quesnumber - 1].options[i];
    }

    // restore selected style if already answered
    resetOptions();
    const selectedIndex = selectedAnswers[quesnumber - 1];
    if (selectedIndex !== null) {
      const row = optionRows[selectedIndex];
      row.classList.add("selected");
      const on = row.querySelector(".on");
      const op = row.querySelector(".option");
      mef(on, op);
      selectedRow = row;
    }

    // update navigation button state
    prevbtn.style.opacity = quesnumber === 1 ? 0.2 : 1;
    nextbtn.style.opacity = quesnumber === numberOfQuestions ? 0.2 : 1;
  };

  // option click logic
  optionRows.forEach((row, i) => {
    const optionIdentifier = row.querySelector(".on");
    const optionContent = row.querySelector(".option");

    const handleClick = () => {

      const calculateProgress = ()=>{
        let answeredCount = selectedAnswers.filter(a => a!==null).length;
        let percentage = (answeredCount/numberOfQuestions)*100;

        progressBar.style.width = `${percentage}%`;
      }

      // deselect previous
      if (selectedRow && selectedRow !== row) {
        const prevId = selectedRow.querySelector(".on");
        const prevOpt = selectedRow.querySelector(".option");
        mlf(prevId, prevOpt);
        selectedRow.classList.remove("selected");
      }

      // toggle current selection
      const isSelected = row.classList.contains("selected");
      resetOptions();

      if (!isSelected) {
        row.classList.add("selected");
        mef(optionIdentifier, optionContent);
        selectedRow = row;
        selectedAnswers[quesnumber - 1] = i;
        localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
      } else {
        selectedRow = null;
        selectedAnswers[quesnumber - 1] = null;
        mlf(optionIdentifier, optionContent);
        localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
      }

      //progress bar calculation
      calculateProgress();

    };

    optionContent.addEventListener("click", handleClick);
    optionIdentifier.addEventListener("click", handleClick);

    // hover effects (only if not selected)
    optionContent.addEventListener("mouseenter", () => {
      if (row !== selectedRow) mef(optionIdentifier, optionContent);
    });
    optionContent.addEventListener("mouseleave", () => {
      if (row !== selectedRow) mlf(optionIdentifier, optionContent);
    });
    optionIdentifier.addEventListener("mouseenter", () => {
      if (row !== selectedRow) mef(optionIdentifier, optionContent);
    });
    optionIdentifier.addEventListener("mouseleave", () => {
      if (row !== selectedRow) mlf(optionIdentifier, optionContent);
    });
  });

  // navigation buttons
  nextbtn.addEventListener("click", () => {
    if (quesnumber < numberOfQuestions) {
      quesnumber++;
      setQuestion();
      makePActive();
    }
  });

  prevbtn.addEventListener("click", () => {
    if (quesnumber > 1) {
      quesnumber--;
      setQuestion();
      makePActive();
    }
  });

  subbtn.addEventListener("click",()=>{
    window.location.href="submitPage.html";
  });

  // jump by clicking question numbers
  tracking.querySelectorAll("p").forEach((p, i) => {
    p.addEventListener("click", () => {
      quesnumber = i + 1;
      setQuestion();
      makePActive();
    });
  });

  setQuestion();
}

startQuiz();
