import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase';

const setUserNameFunction = httpsCallable(functions, 'setUserName');

export async function setUserName(username: String, uid: string) {
    setUserNameFunction({ username, uid });
}