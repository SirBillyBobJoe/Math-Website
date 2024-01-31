'use client'

import { useEffect, useState } from "react";
import { onAuthStateChangedHelper, signOut } from "../firebase/firebase";
import { getCollectionData, updateUser } from "../firebase/functions";
import styles from "./page.module.css";
import { equationMap,EquationFunction } from "../formulas/basicFacts"
import { UserInfo } from "../schema/userInfo"
import { Formula } from "../schema/formula"
import { Topic } from "../schema/topic"
import { Module } from "../schema/module"

export default function Landing() {
    const [question, setQuestion] = useState({ question: "", ans: 0 });
    const [correct, setCorrect] = useState(0);
    const [answerInput, setAnswerInput] = useState("");
    const [user, setUser] = useState<UserInfo>();
    const [module, setModule] = useState<Module>();
    const [topic, setTopic] = useState<Topic>();
    const [formula, setFormula] = useState<Formula>();
    const [equation, setEquation] = useState<EquationFunction>();
    const [minConstraints, setMinConstraints] = useState(0);
    const [maxConstraints, setMaxConstraints] = useState(0);

    useEffect(() => {
        const updateLevelQuestion = async () => {
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

        }

        const updateTopicQuestion = async () => {
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
        }
        if (formula) {
            const tempEquation = equationMap[formula.formulaName]
            setEquation(tempEquation)
            if (tempEquation) {
                const newQuestion = tempEquation(minConstraints, maxConstraints);
                setQuestion(newQuestion)
            }
        }
        if (correct == 2) {
            if (user && topic && user.currentLevel >= topic.maxLevel) {
                updateTopicQuestion()

            }else{
                updateLevelQuestion()
            }

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
                            const tempMaxConstraints = tempFormula?.maxConstraints[user?.currentLevel]
                            const tempMinConstraints = tempFormula?.minConstraints[user?.currentLevel]
                            setMaxConstraints(tempMaxConstraints)
                            setMinConstraints(tempMinConstraints)

                            const tempEquation = equationMap[tempFormula.formulaName]
                            setEquation(tempEquation)
                            if (tempEquation) {
                                const newQuestion = tempEquation(tempMinConstraints, tempMaxConstraints);
                                setQuestion(newQuestion)
                            }
                        }
                    }
                }
            }

        }
        fetchData()
    }, [user]);


    const onSignOut = () => {
        window.location.href = "/";
        signOut()
    }



    /*
    const handleButton = async () => {
        console.log(await updateUser(
            {
                currentModule: 1,
                currentTopic: 101,
            },
            "RvmKszcueBf7YpW8Xtb8vDNC9Rf2"
        ))
    }
    */

    const onSubmitAnswer = (event: any) => {
        event.preventDefault()
        const isCorrect = answerInput == `${question.ans}`

        if (isCorrect) {
            const temp = correct;
            setCorrect(temp + 1);
        } else {

        }
        setAnswerInput("")
        console.log(user)
    }

    const onChangeAnswerInput = (event: any) => {
        setAnswerInput(event.target.value)
    }

    return (
        <div className={styles.container}>
            <p className={styles.signOut} onClick={onSignOut}>SignOut</p>

            <div className={styles.question}>
                <span>{`${correct}/10`}</span>
                {question.question}
            </div>

            <form onSubmit={onSubmitAnswer}>
                <input type="text" value={answerInput} onChange={onChangeAnswerInput} />
                <button type="submit" >submit</button>
            </form>
        </div>
    )
}