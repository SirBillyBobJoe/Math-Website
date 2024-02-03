import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase';

const setUserNameFunction = httpsCallable(functions, 'setUserName');
const getCollectionDataFunction = httpsCallable(functions, 'getCollectionData');
const updateUserFunction = httpsCallable(functions, 'updateUser');
const setFormulaFunction = httpsCallable(functions, 'setFormula ');


export async function setUserName(username: String, uid: string) {
    await setUserNameFunction({ username, uid });
}

export async function getCollectionData(collection: string, id: string) {
    const response = await getCollectionDataFunction({ id, collection })
    return response.data
}

export async function updateUser(updates: Record<string, any>, uid: string) {
    await updateUserFunction({ uid, updates });
}

export async function setFormulas(id: string, numbers: string[]) {
    await setFormulaFunction({ id, numbers });
}


