import { randomInt } from "crypto"

export const createAdditionQuestion = (minConstraints: number, maxConstraints: number) => {
    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const num1 = getRandomInt(minConstraints, maxConstraints);
    const num2 = getRandomInt(minConstraints, maxConstraints);
    const ans = num1 + num2;
    const question=`What is ${num1}+${num2}=...?`
    
    return { question, ans }
}


export const createSubtractionQuestion = (minConstraints: number, maxConstraints: number) => {
    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const num1 = getRandomInt(minConstraints, maxConstraints);
    let num2 = getRandomInt(minConstraints, maxConstraints);
    while(num2>num1){
        num2=getRandomInt(minConstraints, maxConstraints);
    }
    const ans = num1 - num2;
    const question=`What is ${num1}-${num2}=...?`
    
    return { question, ans }
}

export const createMultiplicationQuestion = (minConstraints: number, maxConstraints: number) => {
    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const num1 = getRandomInt(minConstraints, maxConstraints);
    let num2=0;
    if(minConstraints<=12)num2 = getRandomInt(1, 12);
    else num2=getRandomInt(10, 99);

    const ans = num1 * num2;
    const question=`What is ${num1} x ${num2}=...?`
    
    return { question, ans }
}

export const createDivisionQuestion = (minConstraints: number, maxConstraints: number) => {
    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const num1 = getRandomInt(minConstraints, maxConstraints);
    let ans=0;
    if(minConstraints<=12)ans = getRandomInt(1, 12);
    else ans=getRandomInt(10, 99);

    const num2 = num1 * ans;
    const question=`What is ${num2} / ${num1}=...?`
    
    return { question, ans }
}


export type EquationFunction = (minConstraints: number, maxConstraints: number) => { question: string; ans: number };

export const equationMap: { [key: string]: EquationFunction } = {
    "addition": createAdditionQuestion,
    "subtraction": createSubtractionQuestion,
    "multiplication": createMultiplicationQuestion,
    "division": createDivisionQuestion,
};