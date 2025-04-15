import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, query, getDocs, where } from 'firebase/firestore';
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
        console.log('User logged in:', user.email); // Debugging log
        this.userAuthenticated$.next(true);
      } else {
        console.error('User is not authenticated. Firestore access may fail.');
        this.userAuthenticated$.next(false);
      }
    });
  }

  public isAuthenticated(): boolean {
    return this.userAuthenticated$.getValue();
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.userAuthenticated$.getValue()) {
      console.error('User is not authenticated. Please log in to access Firestore.'); // Debugging log
      throw new Error('User is not authenticated. Please log in to access Firestore.');
    }
    console.log('User is authenticated. Proceeding with Firestore access.'); // Debugging log
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
    console.log('Fetching all results from Firestore...');
    try {
      const resultsCollection = collection(this.firestore, 'quizResults');
      const resultsQuery = query(resultsCollection);
      const querySnapshot = await getDocs(resultsQuery);
      const results = querySnapshot.docs.map(doc => doc.data() as { totalQuestions: number; correctAnswers: number; timestamp: Date });
      console.log('Results fetched from Firestore:', results);
      return results;
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

  getRegisteredPlayers(): Promise<string[]> {
    const usersCollection = collection(this.firestore, 'users');
    return getDocs(usersCollection)
      .then((snapshot) => {
        const emails = snapshot.docs.map((doc) => doc.data()['email']);
        console.log('Fetched players from Firestore:', emails); // Debugging log
        return emails;
      })
      .catch((error) => {
        console.error('Error fetching players:', error);
        if (error.code === 'permission-denied') {
          alert('You do not have permission to access this data.');
        } else {
          alert('An error occurred while fetching players. Please try again later.');
        }
        throw error;
      });
  }

  getPlayerResults(email: string): Promise<any[]> {
    const resultsCollection = collection(this.firestore, 'results');
    const resultsQuery = query(resultsCollection, where('playerEmail', '==', email));
    return getDocs(resultsQuery).then((snapshot) =>
      snapshot.docs.map((doc) => doc.data())
    );
  }

  getCurrentUserEmail(): string | null {
    const auth = getAuth(this.app);
    const user = auth.currentUser;
    return user ? user.email : null;
  }
}
