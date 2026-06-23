import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface HistoriqueItem {
  question: string;
  sql: string;
  resultat: any[];
}

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1 class="page-title">Agent IA — SQL en langage naturel</h1>

      <div class="agent-layout">

        <!-- Zone principale -->
        <div class="agent-main">

          <!-- Formulaire -->
          <div class="card">
            <textarea
              [(ngModel)]="question"
              (keydown.enter)="demander()"
              placeholder="Ex : Combien de clients GOLD ?
Liste les 3 clients avec le plus de points
Quelles demandes RGPD sont en attente ?"
              class="question-input"
              rows="3"
            ></textarea>
            <div class="form-actions">
              <button
                class="btn btn-primary"
                (click)="demander()"
                [disabled]="chargement || !question.trim()"
              >
                @if (chargement) { Analyse en cours... } @else { Demander à l'agent }
              </button>
            </div>
          </div>

          @if (erreur) {
            <div class="alert alert-error">{{ erreur }}</div>
          }

          <!-- SQL généré -->
          @if (sql) {
            <div class="card">
              <div class="section-header">
                <span class="section-label">SQL généré</span>
                <span class="badge-groq">Groq · llama-3.3-70b</span>
              </div>
              <pre class="sql-block"><code>{{ sql }}</code></pre>
            </div>
          }

          <!-- Résultat -->
          @if (resultat.length > 0) {
            <div class="card" style="padding:0; overflow:hidden;">
              <div style="padding:1.2rem 1.5rem .6rem; display:flex; align-items:center; justify-content:space-between;">
                <span class="section-label">Résultat</span>
                <span style="font-size:.8rem; color:#868e96;">{{ resultat.length }} ligne(s)</span>
              </div>
              <table>
                <thead>
                  <tr>
                    @for (col of colonnes; track col) {
                      <th>{{ col }}</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (ligne of resultat; track $index) {
                    <tr>
                      @for (col of colonnes; track col) {
                        <td>{{ ligne[col] ?? '—' }}</td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (sql && resultat.length === 0 && !chargement) {
            <div class="card empty-result">Aucun résultat pour cette requête.</div>
          }

        </div>

        <!-- Historique -->
        <div class="agent-sidebar">
          <div class="card">
            <h2>Historique</h2>
            @if (historique.length === 0) {
              <p class="empty-hint">Aucune question posée.</p>
            }
            @for (item of historique; track $index) {
              <div class="historique-item" (click)="chargerHistorique(item)">
                <div class="historique-question">{{ item.question }}</div>
                <div class="historique-meta">{{ item.resultat.length }} résultat(s)</div>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .agent-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 900px) {
      .agent-layout { grid-template-columns: 1fr; }
      .agent-sidebar { order: -1; }
    }
    .agent-main { display: flex; flex-direction: column; gap: 1.25rem; }
    .question-input {
      width: 100%;
      box-sizing: border-box;
      padding: .75rem 1rem;
      font-size: .95rem;
      font-family: inherit;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      resize: vertical;
      color: #212529;
      line-height: 1.6;
    }
    .question-input:focus {
      outline: none;
      border-color: #4a90d9;
      box-shadow: 0 0 0 3px rgba(74,144,217,.12);
    }
    .form-actions {
      margin-top: .75rem;
      display: flex;
      justify-content: flex-end;
    }
    .btn:disabled { opacity: .55; cursor: not-allowed; }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: .75rem;
    }
    .section-label {
      font-size: .78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: #868e96;
    }
    .badge-groq {
      font-size: .72rem;
      background: #f0f4ff;
      color: #4a90d9;
      border: 1px solid #c8d8f5;
      border-radius: 20px;
      padding: 2px 10px;
      font-weight: 600;
    }
    .sql-block {
      background: #1e1e2e;
      color: #cdd6f4;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: .88rem;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
    }
    .empty-result {
      text-align: center;
      color: #868e96;
      padding: 2rem;
      font-size: .9rem;
    }
    .empty-hint { color: #868e96; font-size: .85rem; }
    .historique-item {
      padding: .65rem .75rem;
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: .35rem;
      border: 1px solid #f1f3f5;
      transition: background .15s, border-color .15s;
    }
    .historique-item:hover {
      background: #f8f9fa;
      border-color: #dee2e6;
    }
    .historique-question {
      font-size: .85rem;
      color: #343a40;
      font-weight: 500;
    }
    .historique-meta {
      font-size: .74rem;
      color: #868e96;
      margin-top: 2px;
    }
  `],
})
export class AgentComponent {
  question = '';
  sql = '';
  resultat: any[] = [];
  historique: HistoriqueItem[] = [];
  chargement = false;
  erreur = '';

  get colonnes(): string[] {
    if (!this.resultat || this.resultat.length === 0) return [];
    return Object.keys(this.resultat[0]);
  }

  constructor(private api: ApiService) {}

  demander(): void {
    if (!this.question.trim() || this.chargement) return;
    this.chargement = true;
    this.erreur = '';
    this.sql = '';
    this.resultat = [];

    this.api.queryAgent(this.question.trim()).subscribe({
      next: (res: any) => {
        this.sql = res.sql;
        this.resultat = res.resultat;
        this.historique.unshift({ question: res.question, sql: res.sql, resultat: res.resultat });
        this.chargement = false;
      },
      error: (err) => {
        this.erreur = err.error?.message || 'Erreur lors de la requête.';
        this.chargement = false;
      },
    });
  }

  chargerHistorique(item: HistoriqueItem): void {
    this.question = item.question;
    this.sql = item.sql;
    this.resultat = item.resultat;
    this.erreur = '';
  }
}
