import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onCall } from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();

export const createUser = functions.auth.user().onCreate((user) => {
    const userInfo = {
        uid: user.uid,
        email: user.email,
        currentLevel: 0,
        currentModule: 1,
        currentTopic: 0,
        Achievements: [],
    };

    firestore.collection("users").doc(user.uid).set(userInfo, { merge: true });
    logger.info(`User Created: ${JSON.stringify(userInfo)}`);
    return;
});



export const setUserName = onCall({ maxInstances: 1 }, async (request) => {
    const { username, uid } = request.data;
    firestore.collection("users").doc(uid).set({ username }, { merge: true }).then(() => {
        console.log(`Username set successfully for user: ${uid}`);
    })
        .catch((error) => {
            console.error(`Error setting username for user: ${uid}`, error);
        })
    return { message: "Username saved successfully." };
});


export const getCollectionData = onCall({ maxInstances: 1 }, async (request) => {
    const { id, collection } = request.data

    const documentSnapshot = await firestore
        .collection(collection)
        .doc(id).get();

    if (!documentSnapshot.exists) {
        throw new Error("Document not found");
    }
    const info = documentSnapshot.data();
    if (!info) {
        throw new Error("No Info found");
    }

    return info;
});

export const updateUser = onCall({ maxInstances: 1 }, async (request) => {
    const { uid, updates } = request.data;

    if (!uid || typeof updates !== 'object') {
        throw new Error("Invalid request: UID and updates object are required.");
    }

    try {
        await firestore.collection("users").doc(uid).update(updates);
        logger.info(`User Updated: UID=${uid}, Updates=${JSON.stringify(updates)}`);
        return { message: "User updated successfully." };
    } catch (error) {
        logger.error(`Error updating user: UID=${uid}`, error);
        throw new Error(`Error updating user: ${error}`);
    }
});

export const setFormula = onCall({ maxInstances: 1 }, async (request) => {
    const { id, numbers } = request.data;


    firestore.collection("formulas").doc(id).set({numbers}, { merge: true }).then(() => {
        console.log(`Formula set successfully for formula: ${id}`);
    })
        .catch((error) => {
            console.error(`Error setting formula for: ${id}`, error);
        })
    return { message: "Formulas saved successfully." };
});


