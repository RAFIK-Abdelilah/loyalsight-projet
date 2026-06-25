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

      <!-- Page Header -->
      <div style="margin-bottom: 2rem;">
        <h1 class="page-title">SDK Widget</h1>
        <p class="page-subtitle">
          Prévisualisez le module de fidélité embarquable dans une plateforme partenaire.
        </p>
      </div>

      <div class="sdk-layout">

        <!-- Panneau gauche : configuration + JSON -->
        <div class="sdk-left">

          <!-- Input -->
          <div class="card">
            <h2 class="card-title">Configuration SDK</h2>
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
              style="width:100%;"
            >
              @if (chargement) {
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Chargement...
              } @else {
                Charger le module SDK
              }
            </button>
            @if (erreur) {
              <div class="alert alert-error" style="margin-top:1rem;">{{ erreur }}</div>
            }
          </div>

          <!-- JSON block -->
          @if (jsonDisplay) {
            <div class="json-panel">
              <div class="json-panel-header">
                <div class="json-dot json-dot--red"></div>
                <div class="json-dot json-dot--yellow"></div>
                <div class="json-dot json-dot--green"></div>
                <span class="json-label">sdk-config.json</span>
              </div>
              <pre class="json-block"><code>{{ jsonDisplay }}</code></pre>
            </div>
          }

        </div>

        <!-- Panneau droit : widget -->
        <div class="sdk-right">
          <div class="widget-frame-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Rendu du module embarqué
          </div>

          <div class="widget-host" [class.widget-host--active]="!!config">
            @if (config) {
              <div class="sdk-widget">

                <!-- Header -->
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

                <!-- Progress bar -->
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
                    ✦ Niveau maximum atteint
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
                <div class="widget-footer">Module SDK v1.0 — Powered by LoyalSight</div>
              </div>

            } @else {
              <div class="widget-placeholder">
                <div class="placeholder-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".5">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <div class="placeholder-text">Prévisualisation du module</div>
                <div class="placeholder-hint">Entrez un ID client (1–110) pour générer le widget</div>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .sdk-layout {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 1000px) {
      .sdk-layout { grid-template-columns: 1fr; }
    }
    .sdk-left { display: flex; flex-direction: column; gap: 0; }

    /* ── JSON Panel ── */
    .json-panel {
      background: #0D0F1A;
      border: 1px solid #2A2D3E;
      border-radius: 12px;
      overflow: hidden;
    }
    .json-panel-header {
      display: flex;
      align-items: center;
      gap: .4rem;
      padding: .65rem 1rem;
      background: #0A0C14;
      border-bottom: 1px solid #2A2D3E;
    }
    .json-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .json-dot--red    { background: #FF5F56; }
    .json-dot--yellow { background: #FFBD2E; }
    .json-dot--green  { background: #27C93F; }
    .json-label {
      margin-left: .5rem;
      font-size: .72rem;
      color: #4A5568;
      font-family: 'Consolas', monospace;
    }
    .json-block {
      background: transparent;
      color: #A78BFA;
      padding: 1rem 1.25rem;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: .76rem;
      line-height: 1.6;
      overflow-x: auto;
      overflow-y: auto;
      max-height: 400px;
      white-space: pre;
      margin: 0;
    }

    .spin-icon { animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Widget Frame ── */
    .sdk-right { display: flex; flex-direction: column; gap: .75rem; }
    .widget-frame-label {
      display: flex;
      align-items: center;
      gap: .5rem;
      font-size: .72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: #8B8FA8;
    }

    .widget-host {
      background: #0A0C14;
      border: 1px solid #2A2D3E;
      border-radius: 12px;
      padding: 2rem;
      display: flex;
      justify-content: center;
      min-height: 300px;
      align-items: center;
      transition: border-color .3s;
    }
    .widget-host--active {
      border-color: #6C63FF;
      box-shadow: 0 0 0 1px rgba(108,99,255,.15), inset 0 0 40px rgba(108,99,255,.04);
    }

    /* ── SDK Widget ── */
    .sdk-widget {
      width: 100%;
      max-width: 360px;
      border-radius: 14px;
      overflow: hidden;
      background: #fff;
      border: 1px solid rgba(255,255,255,.1);
    }
    .widget-header {
      padding: 1.4rem 1.5rem;
      color: white;
    }
    .widget-welcome {
      font-size: .95rem;
      font-weight: 600;
      margin-bottom: .5rem;
      font-family: 'Inter', sans-serif;
    }
    .widget-badge {
      display: inline-block;
      background: white;
      font-size: .68rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      letter-spacing: .06em;
      font-family: 'Inter', sans-serif;
    }
    .widget-points {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f3f5;
      text-align: center;
      background: #fff;
    }
    .points-number {
      font-size: 2.4rem;
      font-weight: 800;
      line-height: 1;
      font-family: 'Inter', sans-serif;
    }
    .points-sub { font-size: .85rem; color: #495057; margin-top: .25rem; font-family: 'Inter', sans-serif; }
    .points-cum { font-size: .72rem; color: #adb5bd; margin-top: .2rem; font-family: 'Inter', sans-serif; }
    .widget-progress {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f3f5;
      background: #fff;
    }
    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: .75rem;
      margin-bottom: .4rem;
      font-family: 'Inter', sans-serif;
    }
    .progress-next { font-weight: 600; color: #343a40; }
    .progress-rest { color: #868e96; }
    .progress-track {
      height: 7px;
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
      font-size: .72rem;
      font-weight: 700;
      text-align: right;
      margin-top: .3rem;
      font-family: 'Inter', sans-serif;
    }
    .widget-top {
      padding: .8rem 1.5rem;
      font-size: .85rem;
      font-weight: 700;
      text-align: center;
      border-bottom: 1px solid #f1f3f5;
      background: #fff;
      font-family: 'Inter', sans-serif;
    }
    .widget-avantages {
      padding: 1rem 1.5rem;
      background: #fff;
    }
    .avantages-title {
      font-size: .7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: #868e96;
      margin-bottom: .65rem;
      font-family: 'Inter', sans-serif;
    }
    .avantage-row {
      display: flex;
      align-items: flex-start;
      gap: .5rem;
      font-size: .82rem;
      color: #343a40;
      margin-bottom: .4rem;
      font-family: 'Inter', sans-serif;
    }
    .avantage-check { font-weight: 700; font-size: .9rem; flex-shrink: 0; }
    .widget-footer {
      padding: .7rem 1.5rem;
      background: #f8f9fa;
      font-size: .68rem;
      color: #adb5bd;
      text-align: center;
      border-top: 1px solid #e9ecef;
      font-family: 'Inter', sans-serif;
    }

    /* ── Placeholder ── */
    .widget-placeholder {
      text-align: center;
      padding: 2rem;
    }
    .placeholder-icon { margin-bottom: 1rem; }
    .placeholder-text { font-size: .9rem; font-weight: 600; color: #8B8FA8; margin-bottom: .4rem; }
    .placeholder-hint { font-size: .78rem; color: #4A5568; }
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
