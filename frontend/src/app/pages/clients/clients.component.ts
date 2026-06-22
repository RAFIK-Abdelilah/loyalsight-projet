import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Clients</h1>
        <div class="filters">
          <select [(ngModel)]="filtreSegment" (ngModelChange)="filtrer()">
            <option value="">Tous les segments</option>
            <option value="STANDARD">STANDARD</option>
            <option value="SILVER">SILVER</option>
            <option value="GOLD">GOLD</option>
            <option value="PLATINUM">PLATINUM</option>
          </select>
        </div>
        <span class="count-info">{{ clientsFiltres.length }} client(s)</span>
      </div>

      <div class="card" style="padding: 0; overflow: hidden;">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Segment</th>
              <th>Actif</th>
            </tr>
          </thead>
          <tbody>
            @for (c of clientsFiltres; track c.id) {
              <tr class="clickable" (click)="voirDetail(c.id)">
                <td><strong>{{ c.nom }}</strong></td>
                <td>{{ c.prenom }}</td>
                <td style="color: #4a90d9;">{{ c.email }}</td>
                <td>
                  <span class="badge badge-{{ c.segment.toLowerCase() }}">
                    {{ c.segment }}
                  </span>
                </td>
                <td>
                  <span [class]="c.actif ? 'actif-oui' : 'actif-non'">
                    {{ c.actif ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="5" class="empty">Aucun client trouvé</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .count-info { margin-left: auto; color: #868e96; font-size: .85rem; }
  `],
})
export class ClientsComponent implements OnInit {
  clients: any[]       = [];
  clientsFiltres: any[] = [];
  filtreSegment        = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getClients().subscribe((res: any) => {
      this.clients = res.data;
      this.filtrer();
    });
  }

  filtrer(): void {
    this.clientsFiltres = this.filtreSegment
      ? this.clients.filter((c) => c.segment === this.filtreSegment)
      : [...this.clients];
  }

  voirDetail(id: number): void {
    this.router.navigate(['/clients', id]);
  }
}
