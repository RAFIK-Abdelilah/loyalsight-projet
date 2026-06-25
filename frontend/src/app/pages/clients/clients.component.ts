import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">

      <!-- Page Header -->
      <div class="clients-header">
        <div>
          <h1 class="page-title">Clients</h1>
          <p class="page-subtitle">{{ clientsFiltres.length }} client(s) affiché(s)</p>
        </div>

        <!-- Pill Filters -->
        <div class="pill-filters">
          <button
            class="pill"
            [class.pill--active]="filtreSegment === ''"
            (click)="setFiltre('')"
          >Tous</button>
          <button
            class="pill pill--standard"
            [class.pill--active]="filtreSegment === 'STANDARD'"
            (click)="setFiltre('STANDARD')"
          >Standard</button>
          <button
            class="pill pill--silver"
            [class.pill--active]="filtreSegment === 'SILVER'"
            (click)="setFiltre('SILVER')"
          >Silver</button>
          <button
            class="pill pill--gold"
            [class.pill--active]="filtreSegment === 'GOLD'"
            (click)="setFiltre('GOLD')"
          >Gold</button>
          <button
            class="pill pill--platinum"
            [class.pill--active]="filtreSegment === 'PLATINUM'"
            (click)="setFiltre('PLATINUM')"
          >Platinum</button>
        </div>
      </div>

      <!-- Table -->
      <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 0;">
        <table>
          <thead>
            <tr>
              <th>Nom complet</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Segment</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            @for (c of clientsFiltres; track c.id) {
              <tr class="clickable" (click)="voirDetail(c.id)">
                <td>
                  <div class="client-name">
                    <div class="client-avatar" [style.background]="getAvatarColor(c.segment)">
                      {{ c.prenom.charAt(0) }}{{ c.nom.charAt(0) }}
                    </div>
                    <div>
                      <div class="client-fullname">{{ c.prenom }} {{ c.nom }}</div>
                      <div class="client-id">ID #{{ c.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="td-email">{{ c.email }}</td>
                <td class="td-muted">{{ c.telephone || '—' }}</td>
                <td>
                  <span class="badge badge-{{ c.segment.toLowerCase() }}">{{ c.segment }}</span>
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
    .clients-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.75rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    /* ── Pill Filters ── */
    .pill-filters {
      display: flex;
      gap: .5rem;
      flex-wrap: wrap;
      align-items: center;
    }
    .pill {
      padding: .4rem .9rem;
      border-radius: 20px;
      font-size: .78rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid #2A2D3E;
      background: transparent;
      color: #8B8FA8;
      font-family: 'Inter', sans-serif;
      transition: all .15s;
      text-transform: uppercase;
      letter-spacing: .05em;
    }
    .pill:hover { border-color: #6C63FF; color: #fff; }

    .pill--active          { background: rgba(108,99,255,.15); border-color: #6C63FF; color: #6C63FF; }
    .pill--standard.pill--active { background: rgba(74,85,104,.2); border-color: #4A5568; color: #9BA3B5; }
    .pill--silver.pill--active   { background: rgba(139,143,168,.15); border-color: #8B8FA8; color: #B0B4C8; }
    .pill--gold.pill--active     { background: rgba(245,166,35,.15); border-color: #F5A623; color: #F5A623; }
    .pill--platinum.pill--active { background: rgba(167,139,250,.15); border-color: #A78BFA; color: #A78BFA; }

    /* ── Client Name Cell ── */
    .client-name {
      display: flex;
      align-items: center;
      gap: .75rem;
    }
    .client-avatar {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .7rem;
      font-weight: 700;
      color: rgba(255,255,255,.9);
      flex-shrink: 0;
    }
    .client-fullname {
      font-weight: 600;
      color: #fff;
      font-size: .875rem;
    }
    .client-id {
      font-size: .72rem;
      color: #8B8FA8;
      margin-top: .1rem;
    }
    .td-email { color: #6C63FF; font-size: .85rem; }
    .td-muted { color: #8B8FA8; font-size: .85rem; }
  `],
})
export class ClientsComponent implements OnInit {
  clients: any[]        = [];
  clientsFiltres: any[] = [];
  filtreSegment         = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getClients().subscribe((res: any) => {
      this.clients = res.data;
      this.filtrer();
    });
  }

  setFiltre(seg: string): void {
    this.filtreSegment = seg;
    this.filtrer();
  }

  filtrer(): void {
    this.clientsFiltres = this.filtreSegment
      ? this.clients.filter((c) => c.segment === this.filtreSegment)
      : [...this.clients];
  }

  voirDetail(id: number): void {
    this.router.navigate(['/clients', id]);
  }

  getAvatarColor(segment: string): string {
    const map: Record<string, string> = {
      STANDARD: '#4A5568',
      SILVER:   '#6B7280',
      GOLD:     '#92400E',
      PLATINUM: '#5B21B6',
    };
    return map[segment] || '#4A5568';
  }
}
