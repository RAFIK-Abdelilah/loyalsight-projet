import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-rgpd',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1 class="page-title">Module RGPD</h1>

      <div class="rgpd-layout">

        <!-- Colonne gauche : formulaires -->
        <div class="rgpd-forms">

          <!-- Formulaire demande RGPD -->
          <div class="card">
            <h2>Soumettre une demande RGPD</h2>
            @if (msgDemande) {
              <div class="alert" [class]="okDemande ? 'alert-success' : 'alert-error'">
                {{ msgDemande }}
              </div>
            }
            <div class="form-group">
              <label>ID Client</label>
              <input type="number" [(ngModel)]="demandeForm.client_id" placeholder="Ex : 3" min="1" />
            </div>
            <div class="form-group">
              <label>Type de demande</label>
              <select [(ngModel)]="demandeForm.type_demande">
                <option value="SUPPRESSION">Suppression (droit à l'oubli)</option>
                <option value="EXPORT">Export des données</option>
                <option value="RECTIFICATION">Rectification</option>
              </select>
            </div>
            <button class="btn btn-primary" (click)="soumettreDemande()">
              Soumettre la demande
            </button>
          </div>

          <!-- Anonymisation -->
          <div class="card">
            <h2>Anonymiser un client</h2>
            <p style="font-size:.85rem; color:#868e96; margin-bottom:1rem;">
              Cette action est irréversible : nom, prénom, email et données personnelles seront effacés.
            </p>
            @if (msgAnon) {
              <div class="alert" [class]="okAnon ? 'alert-success' : 'alert-error'">
                {{ msgAnon }}
              </div>
            }
            <div class="form-row">
              <div class="form-group" style="margin-bottom:0">
                <label>ID Client</label>
                <input type="number" [(ngModel)]="anonClientId" placeholder="Ex : 5" min="1" />
              </div>
              <div style="display:flex; align-items:flex-end;">
                <button class="btn btn-danger" (click)="anonymiser()">
                  Anonymiser
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Colonne droite : tableau des demandes -->
        <div class="rgpd-demandes">
          <div class="card" style="padding:0; overflow:hidden;">
            <div style="padding:1.5rem 1.5rem .5rem;">
              <h2 style="margin-bottom:0;">Demandes en cours ({{ demandes.length }})</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client ID</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Date demande</th>
                  <th>Date traitement</th>
                </tr>
              </thead>
              <tbody>
                @for (d of demandes; track d.id) {
                  <tr>
                    <td style="color:#868e96;">{{ d.id }}</td>
                    <td><strong>{{ d.client_id }}</strong></td>
                    <td style="font-size:.82rem;">{{ d.type_demande }}</td>
                    <td>
                      <span class="statut statut-{{ d.statut.toLowerCase() }}">
                        {{ d.statut }}
                      </span>
                    </td>
                    <td style="font-size:.78rem; color:#868e96;">{{ d.date_demande }}</td>
                    <td style="font-size:.78rem; color:#868e96;">{{ d.date_traitement || '—' }}</td>
                  </tr>
                }
                @empty {
                  <tr><td colspan="6" class="empty">Aucune demande RGPD</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .rgpd-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 900px) {
      .rgpd-layout { grid-template-columns: 1fr; }
    }
    .rgpd-forms { display: flex; flex-direction: column; }
  `],
})
export class RgpdComponent implements OnInit {
  demandes: any[] = [];

  demandeForm = { client_id: null as number | null, type_demande: 'SUPPRESSION' };
  anonClientId: number | null = null;

  msgDemande = '';
  okDemande  = false;
  msgAnon    = '';
  okAnon     = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.chargerDemandes();
  }

  chargerDemandes(): void {
    this.api.getDemandes().subscribe((res: any) => {
      this.demandes = res.data;
    });
  }

  soumettreDemande(): void {
    if (!this.demandeForm.client_id) {
      this.msgDemande = 'Veuillez saisir un ID client.';
      this.okDemande = false;
      return;
    }
    this.msgDemande = '';
    this.api.anonymiserClient(this.demandeForm.client_id).subscribe({
      next: (res: any) => {
        this.okDemande = true;
        this.msgDemande = res.message;
        this.chargerDemandes();
      },
      error: (err) => {
        this.okDemande = false;
        this.msgDemande = err.error?.message || 'Erreur lors de la demande.';
      },
    });
  }

  anonymiser(): void {
    if (!this.anonClientId) {
      this.msgAnon = 'Veuillez saisir un ID client.';
      this.okAnon = false;
      return;
    }
    if (!confirm(`Confirmer l'anonymisation du client #${this.anonClientId} ?`)) return;

    this.msgAnon = '';
    this.api.anonymiserClient(this.anonClientId).subscribe({
      next: (res: any) => {
        this.okAnon = true;
        this.msgAnon = res.message;
        this.anonClientId = null;
        this.chargerDemandes();
      },
      error: (err) => {
        this.okAnon = false;
        this.msgAnon = err.error?.message || "Erreur lors de l'anonymisation.";
      },
    });
  }
}
