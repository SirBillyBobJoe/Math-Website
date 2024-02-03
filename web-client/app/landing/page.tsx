'use client'

import { useEffect, useState } from "react";
import { onAuthStateChangedHelper, signOut } from "../firebase/firebase";
import { getCollectionData, updateUser } from "../firebase/functions";
import styles from "./page.module.css";
import { equationMap, EquationFunction } from "../formulas/basicFacts"
import { UserInfo } from "../schema/userInfo"
import { Formula } from "../schema/formula"
import { Topic } from "../schema/topic"
import { Module } from "../schema/module"
import { Question } from "../schema/question";

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
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        const updateLevelQuestion = async () => {

            setIsLoading(true)
            if (user) {
                await updateUser(
                    {
                        currentLevel: user.currentLevel + 1,
                    },
                    `${user?.uid}`
                )
                const tempUser = await getCollectionData("users", user.uid) as UserInfo
                setUser(tempUser)

            }
            setIsLoading(false)

        }

        const updateTopicQuestion = async () => {
            setIsLoading(true)

            if (user) {
                await updateUser(
                    {
                        currentLevel: 0,
                        currentTopic: user.currentTopic + 1
                    },
                    `${user?.uid}`
                )
                const tempUser = await getCollectionData("users", user.uid) as UserInfo
                setUser(tempUser)

            }
            setIsLoading(false)
        }

        if (correct == 10) {
            if (user && topic && user.currentLevel >= topic.maxLevel) {
                updateTopicQuestion()
            } else {
                updateLevelQuestion()
            }
            setQuestionIndex(0)
            setCorrect(0)


        }
    }, [correct]);



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
        const fetchData = async () => {
            setIsLoading(true)
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
                            const start = user.currentLevel * (variables * 2+1)
                            const end = start + (variables * 2+1);
                            console.log(tempFormula?.numbers)
                            const tempInfoArray = tempFormula?.numbers.slice(start, end)
                            setInfoArray(tempInfoArray)
                            const tempEquation = equationMap[tempFormula.formulaName]

                            setEquation(tempEquation)

                            if (tempEquation && tempInfoArray&&tempInfoArray.length!=0) {
                                const { questions } = tempEquation(tempInfoArray);
                                setQuestions(questions)
                            }
                        }
                    }
                }
            }
            setIsLoading(false)
        }
        fetchData()
    }, [user]);


    const onSignOut = () => {
        window.location.href = "/";
        signOut()
    }




    const onSubmitAnswer = (event: any) => {
        event.preventDefault()
        const isCorrect = answerInput == questions[questionIndex].ans

        if (isCorrect) {
            const temp = correct;
            setCorrect(temp + 1);
            const tempQuestionIndex = questionIndex + 1;
            setQuestionIndex(tempQuestionIndex)
        } else {

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
                            <span>{`${correct}/10`}</span>
                            {questions[questionIndex] && questions[questionIndex].question}
                        </div>

                        <form onSubmit={onSubmitAnswer}>
                            <input type="text" value={answerInput} onChange={onChangeAnswerInput} />
                            <button type="submit" >submit</button>
                        </form>
                    </div>
                )
            }
        </>
    )
}