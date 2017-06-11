const fs = require('fs');
const filePath = (__dirname + '/beslisboom_nodes.txt');
var rl, readline;
var nodeArray;

readline = require('readline');
rl = readline.createInterface(process.stdin, process.stdout);

fs.readFile(filePath, function read(err, data) {
    if (err) {
        throw err;
    }
    let content = data;
    nodeArray = content.toString().split("\n");
    askFirstQuestion();
});

function askFirstQuestion() {
    let firstLine = nodeArray[0];
    let firstLineArray = firstLine.split(", ");
    console.log(firstLineArray[1]);
    displayPossibleAnswers(firstLine);
    rl.question("> ", input => answerQuestion(firstLine, input));
}

function answerQuestion(prevLine, input) {
    let previousNode = prevLine.split(", ")[0];
    let count = 1;
    let nextQuestionLine;
    for (let line of nodeArray) {
        if (line.startsWith(previousNode) && line !== prevLine) {
            if (count.toString() === input.toString()) {
                nextQuestionLine = line;
                break;
            }
            count++;
        }
    }

    if (nextQuestionLine === undefined) {
        displayPossibleAnswers(prevLine);
        rl.question("> ", input => answerQuestion(prevLine, input));
        return;
    }

    askNextQuestionOrDisplayResult(nextQuestionLine);
}

function displayPossibleAnswers(questionLine) {
    questionLine = questionLine.split(", ");
    let count = 1;
    for (let line of nodeArray) {
        if (line.startsWith(questionLine[0]) && !line.endsWith("?\r")) {
            line = line.split(", ");
            console.log(count + ". " + line[line.length - 1]);
            count++;
        }
    }
}

function askNextQuestionOrDisplayResult(prevLine) {
    let prevLineArray = prevLine.split(", ");
    let nextQuestion;
    for (let line of nodeArray) {
        if (line.startsWith(prevLineArray[1]) && line.endsWith("?\r")) {
            nextQuestion = line.split(", ");
            console.log(nextQuestion[nextQuestion.length - 1]);
            displayPossibleAnswers(line);
            return rl.question("> ", input => answerQuestion(line, input));
        }
    }
    for (let line of nodeArray) {
        if (line.startsWith(prevLineArray[1])) {
            let result = line.split(", ");
            return console.log(result[1]);
        }
    }
}
