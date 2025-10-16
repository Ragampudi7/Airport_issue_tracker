import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/auth.service';
import { IncidentsService, Incident } from '../../core/incidents.service';

@Component({
  selector: 'app-passenger-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './passenger-dashboard.component.html',
  styleUrl: './passenger-dashboard.component.scss'
})
export class PassengerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  redIncidents: Incident[] = [];
  greenIncidents: Incident[] = [];
  categories: any = {};
  
  isReportingMode = true;
  isLoading = false;
  showReportForm = false;
  
  reportForm: FormGroup;

  constructor(
    private authService: AuthService,
    private incidentsService: IncidentsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.reportForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      subCategory: ['', [Validators.required]],
      priority: ['medium', [Validators.required]]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadIncidents();
    this.loadCategories();
  }

  loadIncidents() {
    this.isLoading = true;
    this.incidentsService.getIncidents().subscribe({
      next: (incidents) => {
        this.redIncidents = incidents.filter(incident => incident.status === 'red');
        this.greenIncidents = incidents.filter(incident => incident.status === 'green');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading incidents:', error);
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.incidentsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  toggleMode() {
    this.isReportingMode = !this.isReportingMode;
    this.showReportForm = false;
  }

  toggleReportForm() {
    this.showReportForm = !this.showReportForm;
    if (!this.showReportForm) {
      this.reportForm.reset();
      this.reportForm.patchValue({ priority: 'medium' });
    }
  }

  onSubmitReport() {
    if (this.reportForm.valid) {
      this.isLoading = true;
      const formData = this.reportForm.value;
      
      this.incidentsService.createIncident(formData).subscribe({
        next: () => {
          this.loadIncidents();
          this.showReportForm = false;
          this.reportForm.reset();
          this.reportForm.patchValue({ priority: 'medium' });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating incident:', error);
          this.isLoading = false;
        }
      });
    }
  }

  goToSosPortal() {
    this.router.navigate(['/sos-portal']);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  getPriorityLabel(priority: string): string {
    return priority.toUpperCase();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getSubCategories(sector: string): string[] {
    return this.categories[sector] || [];
  }

  onSectorChange() {
    this.reportForm.patchValue({ subCategory: '' });
  }
}
