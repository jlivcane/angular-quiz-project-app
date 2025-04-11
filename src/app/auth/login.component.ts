import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp, getApps } from 'firebase/app'; // Import initializeApp and getApps
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs'; // Import MatTabsModule

const firebaseConfig = {
  apiKey: "AIzaSyDxpvu50nC7XJZu03B2HIZaKTyHIQrwpmc",
  authDomain: "quiz-app-advanced.firebaseapp.com",
  projectId: "quiz-app-advanced",
  storageBucket: "quiz-app-advanced.firebasestorage.app",
  messagingSenderId: "805199264379",
  appId: "1:805199264379:web:1879a2d2f3e71136a040de",
  measurementId: "G-13YHR87MQ6"
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule, // Ensure MatIconModule is imported here
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule, // Add MatTabsModule here
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  hidePassword = true;
  hideRegisterPassword = true;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize Firebase app if not already initialized
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleRegisterPassword(): void {
    this.hideRegisterPassword = !this.hideRegisterPassword;
  }

  login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Logging in with', { email, password });
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(() => this.router.navigate(['/home']))
        .catch((error) => (this.errorMessage = error.message));
    } else {
      this.errorMessage = 'Please fill out the login form correctly.';
    }
  }

  register(): void {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      console.log('Registering with', { email, password });
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => this.router.navigate(['/home']))
        .catch((error) => {
          console.error('Registration error:', error); // Log the error for debugging
          this.errorMessage = error.message; // Display the error message to the user
        });
    } else {
      this.errorMessage = 'Please fill out the registration form correctly.';
    }
  }

  forgotPassword(): void {
    // Logic for password recovery
    console.log('Redirect to forgot password page');
  }
}
