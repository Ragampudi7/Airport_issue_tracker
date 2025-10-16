import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IncidentsService } from '../../core/incidents.service';

@Component({
  selector: 'app-sos-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sos-portal.component.html',
  styleUrl: './sos-portal.component.scss'
})
export class SosPortalComponent implements OnInit {
  sosForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  constructor(
    private incidentsService: IncidentsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.sosForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      sector: ['sos_portal', [Validators.required]],
      subCategory: ['', [Validators.required]],
      priority: ['sos', [Validators.required]],
      reporterName: ['', [Validators.required]],
      reporterContact: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]]
    });
  }

  ngOnInit() {
    // Auto-focus on the first input for quick access
    setTimeout(() => {
      const firstInput = document.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  onSubmit() {
    if (this.sosForm.valid) {
      this.isLoading = true;
      const formData = this.sosForm.value;
      
      this.incidentsService.createIncident(formData).subscribe({
        next: () => {
          this.isSubmitted = true;
          this.isLoading = false;
          // Auto-redirect after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          console.error('Error submitting SOS:', error);
          this.isLoading = false;
          alert('Error submitting emergency request. Please try again or contact security directly.');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
