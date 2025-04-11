import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, query, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

const firebaseConfig = {
  apiKey: "AIzaSyDxpvu50nC7XJZu03B2HIZaKTyHIQrwpmc",
  authDomain: "quiz-app-advanced.firebaseapp.com",
  projectId: "quiz-app-advanced",
  storageBucket: "quiz-app-advanced.firebasestorage.app",
  messagingSenderId: "805199264379",
  appId: "1:805199264379:web:1879a2d2f3e71136a040de",
  measurementId: "G-13YHR87MQ6"
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp;
  private firestore: Firestore;
  private userAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.app);

    const auth = getAuth(this.app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userAuthenticated$.next(true);
      } else {
        console.error('User is not authenticated. Firestore access may fail.');
        this.userAuthenticated$.next(false);
      }
    });
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.userAuthenticated$.getValue()) {
      throw new Error('User is not authenticated. Please log in to access Firestore.');
    }
  }

  async saveQuizAnswers(answers: any): Promise<void> {
    await this.ensureAuthenticated();
    try {
      const answersCollection = collection(this.firestore, 'quizAnswers');
      await addDoc(answersCollection, answers);
    } catch (error) {
      console.error("Error saving quiz answers: ", error);
      throw error;
    }
  }

  async saveResult(result: { totalQuestions: number; correctAnswers: number; timestamp: Date }): Promise<void> {
    await this.ensureAuthenticated();
    try {
      const resultsCollection = collection(this.firestore, 'quizResults');
      await addDoc(resultsCollection, result);
    } catch (error) {
      console.error("Error saving result: ", error);
      throw error;
    }
  }

  async getAllResults(): Promise<{ totalQuestions: number; correctAnswers: number; timestamp: Date }[]> {
    await this.ensureAuthenticated();
    try {
      const resultsCollection = collection(this.firestore, 'quizResults');
      const resultsQuery = query(resultsCollection);
      const querySnapshot = await getDocs(resultsQuery);
      return querySnapshot.docs.map(doc => doc.data() as { totalQuestions: number; correctAnswers: number; timestamp: Date });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error retrieving results: ", error.message);
      } else {
        console.error("Error retrieving results: ", error);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    const auth = getAuth(this.app);
    try {
      await signOut(auth);
      console.log('User logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
