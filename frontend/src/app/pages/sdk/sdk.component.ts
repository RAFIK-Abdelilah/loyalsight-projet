import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sdk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1 class="page-title">SDK Widget — Intégration externe</h1>
      <p class="page-subtitle">
        Simule un module de fidélité embarqué dans une plateforme partenaire (ex : Maxxing).
        Entrez un ID client pour générer la configuration et prévisualiser le rendu.
      </p>

      <div class="sdk-layout">

        <!-- Panneau gauche : configuration -->
        <div class="sdk-panel">
          <div class="card">
            <h2>Configuration SDK</h2>

            <div class="form-group">
              <label>ID Client</label>
              <input
                type="number"
                [(ngModel)]="clientId"
                placeholder="Ex : 16"
                min="1"
                (keydown.enter)="charger()"
              />
            </div>
            <button
              class="btn btn-primary"
              (click)="charger()"
              [disabled]="chargement || !clientId"
            >
              @if (chargement) { Chargement... } @else { Charger le module SDK }
            </button>

            @if (erreur) {
              <div class="alert alert-error" style="margin-top:1rem;">{{ erreur }}</div>
            }

            @if (jsonDisplay) {
              <div style="margin-top:1.5rem;">
                <div class="section-label" style="margin-bottom:.5rem;">Réponse JSON</div>
                <pre class="json-block"><code>{{ jsonDisplay }}</code></pre>
              </div>
            }
          </div>
        </div>

        <!-- Panneau droit : rendu du widget -->
        <div class="sdk-preview">
          @if (config) {
            <div class="sdk-widget">

              <!-- Header coloré dynamiquement -->
              <div
                class="widget-header"
                [style.background]="'linear-gradient(135deg, ' + config.config.couleur_principale + ', ' + config.config.couleur_secondaire + ')'"
              >
                <div class="widget-welcome">{{ config.config.texte_bienvenue }}</div>
                <span
                  class="widget-badge"
                  [style.color]="config.config.couleur_principale"
                >{{ config.client.segment }}</span>
              </div>

              <!-- Points -->
              <div class="widget-points">
                <div
                  class="points-number"
                  [style.color]="config.config.couleur_principale"
                >{{ config.client.points_disponibles | number }}</div>
                <div class="points-sub">{{ config.config.texte_points }}</div>
                <div class="points-cum">{{ config.client.points_cumules | number }} pts cumulés au total</div>
              </div>

              <!-- Barre de progression -->
              @if (config.config.prochaine_recompense) {
                <div class="widget-progress">
                  <div class="progress-labels">
                    <span class="progress-next">{{ config.config.prochaine_recompense.label }}</span>
                    <span class="progress-rest">{{ config.config.prochaine_recompense.points_restants | number }} pts restants</span>
                  </div>
                  <div class="progress-track">
                    <div
                      class="progress-fill"
                      [style.width.%]="progressPct"
                      [style.background]="'linear-gradient(90deg, ' + config.config.couleur_principale + ', ' + config.config.couleur_secondaire + ')'"
                    ></div>
                  </div>
                  <div class="progress-pct" [style.color]="config.config.couleur_principale">{{ progressPct }}%</div>
                </div>
              } @else {
                <div class="widget-top" [style.color]="config.config.couleur_principale">
                  Niveau maximum atteint
                </div>
              }

              <!-- Avantages -->
              <div class="widget-avantages">
                <div class="avantages-title">Vos avantages</div>
                @for (a of config.config.avantages; track a) {
                  <div class="avantage-row">
                    <span class="avantage-check" [style.color]="config.config.couleur_principale">✓</span>
                    <span>{{ a }}</span>
                  </div>
                }
              </div>

              <!-- Footer -->
              <div class="widget-footer">Module SDK v1.0 — Picard Surgelés</div>

            </div>
          } @else {
            <div class="widget-placeholder">
              <div class="placeholder-icon">⚡</div>
              <div class="placeholder-text">Entrez un ID client pour prévisualiser le module SDK</div>
              <div class="placeholder-hint">Essayez les IDs 1 à 110</div>
            </div>
          }
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-subtitle {
      color: #868e96;
      font-size: .9rem;
      margin-top: -.5rem;
      margin-bottom: 1.5rem;
    }
    .sdk-layout {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 960px) {
      .sdk-layout { grid-template-columns: 1fr; }
    }
    .sdk-panel { display: flex; flex-direction: column; }
    .json-block {
      background: #1e1e2e;
      color: #cdd6f4;
      border-radius: 8px;
      padding: .9rem 1rem;
      font-family: 'Consolas', monospace;
      font-size: .78rem;
      line-height: 1.5;
      overflow-x: auto;
      white-space: pre;
      max-height: 380px;
      overflow-y: auto;
      margin: 0;
    }
    .section-label {
      font-size: .75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: #868e96;
    }
    .btn:disabled { opacity: .55; cursor: not-allowed; }

    /* ── Widget SDK ── */
    .sdk-preview {
      display: flex;
      justify-content: center;
    }
    .sdk-widget {
      width: 100%;
      max-width: 380px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,.12);
      overflow: hidden;
      background: #fff;
      border: 1px solid #e9ecef;
    }
    .widget-header {
      padding: 1.5rem;
      color: white;
    }
    .widget-welcome {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: .5rem;
    }
    .widget-badge {
      display: inline-block;
      background: white;
      font-size: .72rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      letter-spacing: .06em;
    }
    .widget-points {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f3f5;
      text-align: center;
    }
    .points-number {
      font-size: 2.4rem;
      font-weight: 800;
      line-height: 1;
    }
    .points-sub {
      font-size: .85rem;
      color: #495057;
      margin-top: .25rem;
    }
    .points-cum {
      font-size: .75rem;
      color: #adb5bd;
      margin-top: .2rem;
    }
    .widget-progress {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f3f5;
    }
    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: .78rem;
      margin-bottom: .4rem;
    }
    .progress-next { font-weight: 600; color: #343a40; }
    .progress-rest { color: #868e96; }
    .progress-track {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width .5s ease;
    }
    .progress-pct {
      font-size: .75rem;
      font-weight: 700;
      text-align: right;
      margin-top: .25rem;
    }
    .widget-top {
      padding: .8rem 1.5rem;
      font-size: .85rem;
      font-weight: 700;
      text-align: center;
      border-bottom: 1px solid #f1f3f5;
    }
    .widget-avantages {
      padding: 1rem 1.5rem;
    }
    .avantages-title {
      font-size: .75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: #868e96;
      margin-bottom: .65rem;
    }
    .avantage-row {
      display: flex;
      align-items: flex-start;
      gap: .5rem;
      font-size: .85rem;
      color: #343a40;
      margin-bottom: .4rem;
    }
    .avantage-check {
      font-weight: 700;
      font-size: .9rem;
      flex-shrink: 0;
    }
    .widget-footer {
      padding: .75rem 1.5rem;
      background: #f8f9fa;
      font-size: .72rem;
      color: #adb5bd;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }

    /* ── Placeholder ── */
    .widget-placeholder {
      width: 100%;
      max-width: 380px;
      border: 2px dashed #dee2e6;
      border-radius: 16px;
      padding: 3rem 2rem;
      text-align: center;
      color: #868e96;
    }
    .placeholder-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .placeholder-text { font-size: .9rem; font-weight: 500; margin-bottom: .4rem; }
    .placeholder-hint { font-size: .8rem; color: #adb5bd; }
  `],
})
export class SdkComponent {
  clientId: number | null = null;
  config: any = null;
  jsonDisplay = '';
  chargement = false;
  erreur = '';

  get progressPct(): number {
    const pr = this.config?.config?.prochaine_recompense;
    if (!pr) return 100;
    const earned = pr.points_requis - pr.points_restants;
    return Math.min(100, Math.round((earned / pr.points_requis) * 100));
  }

  constructor(private api: ApiService) {}

  charger(): void {
    if (!this.clientId || this.chargement) return;
    this.chargement = true;
    this.erreur = '';
    this.config = null;
    this.jsonDisplay = '';

    this.api.getSdkConfig(this.clientId).subscribe({
      next: (res: any) => {
        this.config = res.data;
        this.jsonDisplay = JSON.stringify(res.data, null, 2);
        this.chargement = false;
      },
      error: (err) => {
        this.erreur = err.error?.message || 'Client introuvable.';
        this.chargement = false;
      },
    });
  }
}
