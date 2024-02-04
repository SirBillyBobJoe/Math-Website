'use client'

import { useEffect, useRef, useState } from "react";
import { onAuthStateChangedHelper, signOut } from "../firebase/firebase";
import { getCollectionData, updateUser } from "../firebase/functions";
import styles from "./page.module.css";
import { equationMap, EquationFunction } from "../formulas/basicFacts"
import { UserInfo } from "../schema/userInfo"
import { Formula } from "../schema/formula"
import { Topic } from "../schema/topic"
import { Module } from "../schema/module"
import { Question } from "../schema/question";
import { useRouter } from 'next/navigation';
import { formatTime } from "../generalFunctions/timerFunction";

export default function Landing() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [correct, setCorrect] = useState(0);
    const [answerInput, setAnswerInput] = useState("");
    const [user, setUser] = useState<UserInfo>();
    const [module, setModule] = useState<Module>();
    const [topic, setTopic] = useState<Topic>();
    const [formula, setFormula] = useState<Formula>();
    const [infoArray, setInfoArray] = useState<string[]>([]);
    const [equation, setEquation] = useState<EquationFunction>();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | number | null>(null);
    const router = useRouter();
    const inputRef = useRef<any>(null)


    useEffect(() => {
        if (questionIndex == 10) {
            stopTimer();
            router.push(`/results?correct=${correct}&uid=${user?.uid}&maxTopicLevel=${topic?.maxLevel}&time=${elapsedTime}`);
            setQuestionIndex(0)
            setCorrect(0)
        }
    }, [questionIndex]);



    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper(async (uid) => {
            if (uid != null) {
                const tempUser = await getCollectionData("users", uid) as UserInfo
                setUser(tempUser)
                console.log(tempUser)
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            if (user) {
                const tempModule = await getCollectionData("modules", `${user?.currentModule}`) as Module
                setModule(tempModule)
                console.log(tempModule)

                if (tempModule) {
                    const tempTopic = await getCollectionData("topics", `${tempModule?.topicSequence[user?.currentTopic]}`) as Topic
                    setTopic(tempTopic)
                    console.log(tempTopic)

                    if (tempTopic) {
                        const tempFormula = await getCollectionData("formulas", `${tempTopic?.formulaID}`) as Formula
                        setFormula(tempFormula)
                        console.log(tempFormula)

                        if (tempFormula) {
                            const variables = tempFormula?.variables;
                            const start = user.currentLevel * (variables * 2 + 1)
                            const end = start + (variables * 2 + 1);
                            console.log(tempFormula?.numbers)
                            const tempInfoArray = tempFormula?.numbers.slice(start, end)
                            setInfoArray(tempInfoArray)
                            const tempEquation = equationMap[tempFormula.formulaName]

                            setEquation(tempEquation)

                            if (tempEquation && tempInfoArray && tempInfoArray.length != 0) {
                                const { questions } = tempEquation(tempInfoArray);
                                setQuestions(questions)
                                if (questions.length != 0) {
                                    setIsLoading(false)
                                    startTimer()
                                }
                            }
                        }
                    }
                }
            }
        }
        fetchData()

    }, [user]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLoading])

    const onSignOut = () => {
        window.location.href = "/";
        signOut()
    }

    const startTimer = () => {
        if (timer === null) {
            const startTime = Date.now() - elapsedTime;
            const newTimer = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 1000);
            setTimer(newTimer);
        }
    };

    const stopTimer = () => {
        if (timer !== null) {
            clearInterval(timer as NodeJS.Timeout);
            setTimer(null);
        }
    };



    const onSubmitAnswer = (event: any) => {
        event.preventDefault()
        const isCorrect = answerInput == questions[questionIndex].ans

        if (isCorrect) {
            const temp = correct;
            setCorrect(temp + 1);
            const tempQuestionIndex = questionIndex + 1;
            setQuestionIndex(tempQuestionIndex)
        } else {
            const tempQuestionIndex = questionIndex + 1;
            setQuestionIndex(tempQuestionIndex)
        }
        setAnswerInput("")
        console.log(user)
    }

    const onChangeAnswerInput = (event: any) => {
        setAnswerInput(event.target.value)
    }



    return (
        <>
            {isLoading ?
                (
                    <div className={styles.container}>
                        <img src="loading.gif" alt="loading" />
                        <div>Loading...</div>
                    </div>
                ) : (
                    <div className={styles.container}>
                        <p className={styles.signOut} onClick={onSignOut}>SignOut</p>

                        <div className={styles.question}>
                            <span>Elapsed Time: {formatTime(elapsedTime)}</span>
                            <span>{`Score: ${correct}/10`}</span>
                            {questions[questionIndex] && questions[questionIndex].question}
                        </div>

                        <form onSubmit={onSubmitAnswer}>
                            <input ref={inputRef} type="text" value={answerInput} onChange={onChangeAnswerInput} />
                            <button type="submit" >submit</button>
                        </form>
                    </div>
                )
            }
        </>
    )
}