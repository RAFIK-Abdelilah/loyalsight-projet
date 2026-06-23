import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:8001/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ── Clients ───────────────────────────────
  getStats(): Observable<any> { return this.http.get(`${BASE}/clients/stats`); }
  getClients(): Observable<any> { return this.http.get(`${BASE}/clients/`); }
  getClient(id: number): Observable<any> { return this.http.get(`${BASE}/clients/${id}`); }
  creerClient(data: any): Observable<any> { return this.http.post(`${BASE}/clients/`, data); }
  modifierClient(id: number, data: any): Observable<any> { return this.http.put(`${BASE}/clients/${id}`, data); }

  // ── Points ────────────────────────────────
  getPoints(clientId: number): Observable<any> { return this.http.get(`${BASE}/points/${clientId}`); }
  ajouterPoints(clientId: number, data: any): Observable<any> { return this.http.post(`${BASE}/points/${clientId}/ajouter`, data); }
  utiliserPoints(clientId: number, data: any): Observable<any> { return this.http.post(`${BASE}/points/${clientId}/utiliser`, data); }
  getTransactions(clientId: number): Observable<any> { return this.http.get(`${BASE}/points/${clientId}/transactions`); }

  // ── RGPD ──────────────────────────────────
  anonymiserClient(clientId: number): Observable<any> { return this.http.post(`${BASE}/rgpd/anonymiser/${clientId}`, {}); }
  getDemandes(): Observable<any> { return this.http.get(`${BASE}/rgpd/demandes`); }
  getQualite(): Observable<any> { return this.http.get(`${BASE}/rgpd/qualite`); }

  // ── Agent IA ──────────────────────────────
  queryAgent(question: string): Observable<any> { return this.http.post(`${BASE}/agent/query`, { question }); }
}
