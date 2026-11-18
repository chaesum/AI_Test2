import { doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from '../types';

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return { uid, ...(snap.data() as Omit<UserProfile, 'uid'>) };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
