'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from "./page.module.css";
import { UserInfo } from '../schema/userInfo';
import { Suspense, useEffect, useState } from 'react';
import { getCollectionData, updateUser } from '../firebase/functions';
import { formatTime } from '../generalFunctions/timerFunction';
function Search() {
    const router = useRouter();
    const correct = useSearchParams().get('correct');
    const uid = useSearchParams().get('uid');
    const maxTopicLevelString = useSearchParams().get('maxTopicLevel');
    const timeString = useSearchParams().get('time');

    let time = 1;
    if (timeString) {
        time = parseInt(timeString, 10);
    }

    let maxTopicLevel = 1;
    if (maxTopicLevelString) {
        maxTopicLevel = parseInt(maxTopicLevelString, 10);
    }
    const [user, setUser] = useState<UserInfo>();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        setIsLoading(true)
        const getUsers = async () => {
            if (uid != null) {
                const tempUser = await getCollectionData("users", uid) as UserInfo
                setUser(tempUser)
            }
        }
        getUsers();

        setIsLoading(false)

    }, [])

    const onClickRetry = () => {
        router.push("/landing")
    }

    const onClickNext = async () => {
        setIsLoading(true)
        if (user) {
            if (user && user.currentLevel >= maxTopicLevel) {
                await updateUser(
                    {
                        currentLevel: 0,
                        currentTopic: user.currentTopic + 1
                    },
                    `${user?.uid}`
                )
            } else {
                await updateUser(
                    {
                        currentLevel: user.currentLevel + 1,
                    },
                    `${user?.uid}`
                )
            }
            router.push("/landing")
        }
        setIsLoading(false)
    }
    return (<>{
        isLoading ?
            (
                <div className={styles.container}>
                    <img src="loading.gif" alt="loading" />
                    <div>Loading...</div>
                </div>
            ) : (
                <div className={styles.container}>
                    {`You Got ${correct}/10 Correct!`}
                    <br />
                    {`And Finished in ${formatTime(time)}!`}
                    <div>
                        <button onClick={onClickRetry} className={styles.button}>Retry</button>
                        <button onClick={onClickNext} className={styles.button}>Next Level</button>
                    </div>
                </div>
            )
    }
    </>)
}
export default function results() {


    return (
        <Suspense>
            <Search />
        </Suspense>
    )
}