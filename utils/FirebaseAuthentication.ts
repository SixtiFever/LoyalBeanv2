import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, Unsubscribe, updateProfile, UserCredential } from "firebase/auth";

export const customerSignup = async (auth: Auth, username: string, email: string, password: string): Promise<UserCredential | void> => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile( result.user , {
            displayName: username,
        })
        console.log('User created - ', result.user)
        return result;
    } catch (err) {
        console.log(err);
    }
}


export const customerSignin = async (auth: Auth, email: string, password: string): Promise<UserCredential | void> => {
    console.log('in signin function')
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log(result)
        return result;
    } catch (err) {
        console.log(err);
    }
    
}

export const getUid = async (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        const unsubscribe: Unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Unsubscribe after getting the user
            if (user) {
                resolve(user.uid);
            } else {
                resolve(null); // No user is signed in
            }
        }, (error) => {
            unsubscribe(); // Unsubscribe in case of an error
            reject(error);
        });
    });
};