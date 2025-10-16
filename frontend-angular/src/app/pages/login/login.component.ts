import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['passenger', [Validators.required]],
      department: [''],
      phone: ['']
    });
  }

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.login();
    } else {
      this.register();
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: () => {
          this.redirectToDashboard();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login failed';
          this.isLoading = false;
        }
      });
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formData = this.registerForm.value;
      
      // Clean up form data
      if (formData.role === 'passenger') {
        delete formData.department;
      }
      
      this.authService.register(formData).subscribe({
        next: () => {
          this.redirectToDashboard();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Registration failed';
          this.isLoading = false;
        }
      });
    }
  }

  private redirectToDashboard() {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'staff') {
      this.router.navigate(['/staff-dashboard']);
    } else if (user?.role === 'passenger') {
      this.router.navigate(['/passenger-dashboard']);
    }
  }

  onRoleChange() {
    const role = this.registerForm.get('role')?.value;
    const departmentControl = this.registerForm.get('department');
    
    if (role === 'staff') {
      departmentControl?.setValidators([Validators.required]);
    } else {
      departmentControl?.clearValidators();
    }
    departmentControl?.updateValueAndValidity();
  }
}
