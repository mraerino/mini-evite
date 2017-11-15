import { firebase, firebaseNS } from "./firebase";

export function requireAuth(): Promise<firebaseNS.User> {
    if(firebase.auth().currentUser) {
        return Promise.resolve(firebase.auth().currentUser);
    }

    return new Promise(resolve => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe();
            if(user) {
                return resolve(user);
            }
            resolve(firebase.auth().signInAnonymously());
        });
    });
}
