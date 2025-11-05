const score = document.querySelector(".score");
const grade = document.querySelector(".grade").querySelector("p");
const selectedAnswers = JSON.parse(localStorage.getItem("selectedAnswers")) || [];
let calculatedScore = 0;
const grades = ["Outstanding","Excellent","Good","Satisfactory","Marginal","Unsatisfactory"];

async function loadQuestions(){
    const res = await fetch("questions.json");
    const data = await res.json();
    return data;
}

async function calculateScore() {

    const questions = await loadQuestions();
    
    for(let i=0;i<25;i++){
        if(selectedAnswers[i] === questions[i].answer)
            calculatedScore+=1;
    }

    score.textContent = calculatedScore;
    if(calculatedScore>=23){
        grade.textContent = grades[0]+"!";
    }else if(calculatedScore>=19){
        grade.textContent = grades[1]+"!";
    }else if(calculatedScore>=15){
        grade.textContent = grades[2]+"!";
    }else if(calculatedScore>=11){
        grade.textContent = grades[3]+"!";
    }else if(calculatedScore>=6){
        grade.textContent = grades[4]+"!";
    }else{
        grade.textContent = grades[5]+"!";
    }
}

calculateScore();

