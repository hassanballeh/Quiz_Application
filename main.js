let count = document.querySelector(".count span");
let spans = document.querySelector(".spans");
let quizarea = document.querySelector(".quiz-area");
let answerarea = document.querySelector(".answer-area");
let submit = document.querySelector(".submit_button");
let bullets = document.querySelector(".bullets");
let results = document.querySelector(".results");
let countdowns = document.querySelector(".countdown");
let curruntques = 0;
let right = 0;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onload = function () {
    if (this.status === 200 && this.readyState === 4) {
      let questionObject = JSON.parse(this.responseText);
      let countquestionObject = questionObject.length;
      createBullets(countquestionObject);
      addQuestionData(questionObject[curruntques], countquestionObject);
      countdown(5, countquestionObject);
      submit.onclick = () => {
        rightAnswer = questionObject[curruntques]["right answer"];
        curruntques++;
        checkAnswer(rightAnswer, countquestionObject);
        quizarea.innerHTML = "";
        answerarea.innerHTML = "";
        addQuestionData(questionObject[curruntques], countquestionObject);
        addOnBullets();
        showResult(countquestionObject);
        clearInterval(cutdowninterval);
        countdown(5, countquestionObject);
      };
    }
  };
  myRequest.open("GET", "html_qusetion.json");
  myRequest.send();
}
getQuestions();
function createBullets(n) {
  count.innerHTML = n;
  for (let i = 0; i < n; i++) {
    let span = document.createElement("span");
    spans.appendChild(span);
    if (i === 0) {
      span.className = "on";
    }
  }
}
function addQuestionData(obj, count) {
  if (curruntques < count) {
    let h2 = document.createElement("h2");
    let h2Text = document.createTextNode(obj.title);
    h2.appendChild(h2Text);
    quizarea.appendChild(h2);
    for (let i = 0; i < 4; i++) {
      let answer = document.createElement("div");
      answer.className = "answer";
      let input = document.createElement("input");
      input.id = `answer_${i + 1}`;
      input.type = "radio";
      input.name = "questions";
      input.dataset.answer = obj[`answer${i + 1}`];
      if (i === 0) {
        input.checked = true;
      }
      let lable = document.createElement("lable");
      lable.htmlFor = `answer_${i + 1}`;
      let lableText = document.createTextNode(obj[`answer${i + 1}`]);
      lable.appendChild(lableText);
      answer.appendChild(input);
      answer.appendChild(lable);
      answerarea.appendChild(answer);
    }
  }
}
function checkAnswer(r, count) {
  let name = document.getElementsByName("questions");
  let chosenanswer;
  for (let i = 0; i < name.length; i++) {
    if (name[i].checked) {
      chosenanswer = name[i].dataset.answer;
    }
  }
  if (chosenanswer === r) {
    right++;
  }
}
function addOnBullets() {
  let bullets = document.querySelectorAll(".spans span");
  let arrayBullets = Array.from(bullets);
  arrayBullets.forEach((e, i) => {
    if (curruntques === i) e.classList.add("on");
    else e.classList.remove("on");
  });
}
function showResult(count) {
  if (curruntques === count) {
    submit.remove();
    bullets.remove();
    quizarea.remove();
    answerarea.remove();
    let theResult = document.createElement("span");
    let textResult = document.createTextNode(` ${right} From ${count}`);
    if (right === 0) {
      theResult.className = "bad";
      theResult.innerHTML = "Bad,";
    } else if (right < count && right != count) {
      theResult.className = "good";
      theResult.innerHTML = "Good,";
    } else if (right === count) {
      theResult.className = "perfect";
      theResult.innerHTML = "Perfect,";
    }

    results.appendChild(theResult);
    results.appendChild(textResult);
  }
}
function countdown(d, count) {
  if (curruntques < count) {
    cutdowninterval = setInterval(() => {
      m = parseInt(d / 60);
      s = parseInt(d % 60);
      m = m > 10 ? m : `0${m}`;
      s = s > 10 ? s : `0${s}`;
      countdowns.innerHTML = `${m}:${s}`;
      if (--d < 0) {
        clearInterval(cutdowninterval);
        submit.click();
      }
    }, 1000);
  }
}
