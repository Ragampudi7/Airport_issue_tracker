import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Incident {
  _id: string;
  title: string;
  description: string;
  location: string;
  sector: string;
  subCategory: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'sos';
  status: 'red' | 'yellow' | 'green';
  reporterName: string;
  reporterContact: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedDepartment?: string;
  resolutionNotes?: string;
  isEmergency: boolean;
  estimatedResolutionTime?: Date;
  actualResolutionTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIncidentRequest {
  title: string;
  description: string;
  location: string;
  sector: string;
  subCategory: string;
  priority?: string;
}

export interface IncidentCategories {
  [key: string]: string[];
}

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createIncident(incident: CreateIncidentRequest): Observable<Incident> {
    return this.http.post<Incident>(`${this.API_URL}/incidents`, incident, {
      headers: this.getHeaders()
    });
  }

  getIncidents(filters?: any): Observable<Incident[]> {
    let params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
    }
    
    const queryString = params.toString();
    const url = queryString ? `${this.API_URL}/incidents?${queryString}` : `${this.API_URL}/incidents`;
    
    return this.http.get<Incident[]>(url, {
      headers: this.getHeaders()
    });
  }

  getIncidentById(id: string): Observable<Incident> {
    return this.http.get<Incident>(`${this.API_URL}/incidents/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateIncident(id: string, updates: Partial<Incident>): Observable<Incident> {
    return this.http.put<Incident>(`${this.API_URL}/incidents/${id}`, updates, {
      headers: this.getHeaders()
    });
  }

  claimIncident(id: string): Observable<Incident> {
    return this.http.post<Incident>(`${this.API_URL}/incidents/${id}/claim`, {}, {
      headers: this.getHeaders()
    });
  }

  resolveIncident(id: string, resolutionNotes: string): Observable<Incident> {
    return this.http.post<Incident>(`${this.API_URL}/incidents/${id}/resolve`, {
      resolutionNotes
    }, {
      headers: this.getHeaders()
    });
  }

  deleteIncident(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/incidents/${id}`, {
      headers: this.getHeaders()
    });
  }

  getCategories(): Observable<IncidentCategories> {
    return this.http.get<IncidentCategories>(`${this.API_URL}/incidents/meta/categories`, {
      headers: this.getHeaders()
    });
  }
}
