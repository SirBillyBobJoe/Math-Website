import { Question } from "../schema/question";
const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createAdditionQuestion = (infoArray: string[]) => {
    let questions: Question[] = [];
    if (!infoArray) return { questions }
    console.log(infoArray)
    console.log(infoArray[1])
    const isOrdered = infoArray[0] == ("O")
    const start1 = parseInt(infoArray[1], 10);
    const end1 = parseInt(infoArray[2], 10);
    const start2 = parseInt(infoArray[3], 10);
    const end2 = parseInt(infoArray[4], 10);

    if (isOrdered) {
        for (let i = start2; i <= end2; i++) {
            const num1 = start1;
            const num2 = i;
            const ans = (num1 + num2).toString();
            const question = `What is ${num1}+${num2}=...?`
            questions.push({ question, ans })
        }
    } else {
        let prev=-1;
        for (let i = 0; i < 10; i++) {
            const num1 = getRandomInt(start1, end1)
            let num2 = getRandomInt(start2, end2)
            while(num2==prev){
                num2 = getRandomInt(start2, end2)
            }
            const ans = (num1 + num2).toString();
            const question = `What is ${num1}+${num2}=...?`
            questions.push({ question, ans })
            prev=num2;
        }
    }
    console.log(questions)
    return { questions }
}

export const createSubtractionQuestion = (infoArray: string[]) => {
    let questions: Question[] = [];
    if (!infoArray) return { questions }
    console.log(infoArray)
    console.log(infoArray[1])
    const isOrdered = infoArray[0] == ("O")
    const start1 = parseInt(infoArray[1], 10);
    const end1 = parseInt(infoArray[2], 10);
    const start2 = parseInt(infoArray[3], 10);
    const end2 = parseInt(infoArray[4], 10);

    if (isOrdered) {
        for (let i = start2; i <= end2; i++) {
            const num1 = start1;
            const num2 = i;
            const ans = (num2 - num1).toString();
            const question = `What is ${num2}-${num1}=...?`
            questions.push({ question, ans })
        }
    } else {
        let prev=-1;
        for (let i = 0; i < 10; i++) {
            const num1 = getRandomInt(start1, end1)
            let num2 = getRandomInt(start2, end2)
            while (num2 < num1||prev==num2){
                num2 = getRandomInt(start2, end2)
            }
            const ans = (num2 - num1).toString();
            const question = `What is ${num2}-${num1}=...?`
            questions.push({ question, ans })
            prev=num2;
        }
    }
    console.log(questions)
    return { questions }
}

export const createMultiplicationQuestion = (infoArray: string[]) => {
    let questions: Question[] = [];
    if (!infoArray) return { questions }
    console.log(infoArray)
    console.log(infoArray[1])
    const isOrdered = infoArray[0] == ("O")
    const start1 = parseInt(infoArray[1], 10);
    const end1 = parseInt(infoArray[2], 10);
    const start2 = parseInt(infoArray[3], 10);
    const end2 = parseInt(infoArray[4], 10);

    if (isOrdered) {
        for (let i = start2; i <= end2; i++) {
            const num1 = start1;
            const num2 = i;
            const ans = (num1 * num2).toString();
            const question = `What is ${num1}x${num2}=...?`
            questions.push({ question, ans })
        }
    } else {
        let prev=-1;
        for (let i = 1; i <= 10; i++) {
            const num1 = getRandomInt(start1, end1)
            let num2 = getRandomInt(start2, end2)
            while(prev==num2){
                num2 = getRandomInt(start2, end2)
            }
            const ans = (num1 * num2).toString();
            const question = `What is ${num1}x${num2}=...?`
            questions.push({ question, ans })
            prev=num2;
        }
    }
    console.log(questions)
    return { questions }
}

export const createDivisionQuestion = (infoArray: string[]) => {
    let questions: Question[] = [];
    if (!infoArray) return { questions }
    console.log(infoArray)
    console.log(infoArray[1])
    const isOrdered = infoArray[0] == ("O")
    const start1 = parseInt(infoArray[1], 10);
    const end1 = parseInt(infoArray[2], 10);
    const start2 = parseInt(infoArray[3], 10);
    const end2 = parseInt(infoArray[4], 10);

    if (isOrdered) {
        for (let i = start2; i <= end2; i++) {
            const num2 = start1;
            const ans = i.toString()
            const num1 = num2*i;
            const question = `What is ${num1}/${num2}=...?`
            questions.push({ question, ans })
        }
    } else {
        let prev=-1;
        for (let i = 1; i <=10; i++) {
            const num2 =  getRandomInt(start1, end1)
            let temp = getRandomInt(start2, end2)
            while(prev==temp){
                temp = getRandomInt(start2, end2)
            }
            const num1 = num2*temp
            const ans=temp.toString()
            const question = `What is ${num1}/${num2}=...?`
            questions.push({ question, ans })
            prev=temp;
        }
        
    }
    console.log(questions)
    return { questions }
}


export type EquationFunction = (infoArray: string[]) => { questions: Question[] };


export const equationMap: { [key: string]: EquationFunction } = {
    "addition": createAdditionQuestion,
    "subtraction": createSubtractionQuestion,
    "multiplication": createMultiplicationQuestion,
    "division": createDivisionQuestion,
};