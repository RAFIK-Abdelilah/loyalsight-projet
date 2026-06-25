import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
    <div class="page agent-page">

      <!-- Page Header -->
      <div style="margin-bottom: 1.5rem;">
        <h1 class="page-title">Agent IA</h1>
        <p class="page-subtitle">Interrogez la base de données en langage naturel — propulsé par Groq · Llama 3.3 70B</p>
      </div>

      <div class="agent-layout">

        <!-- Sidebar historique -->
        <aside class="agent-sidebar">
          <div class="sidebar-section-title">Historique</div>
          @if (historique.length === 0) {
            <div class="sidebar-empty">Aucune question posée</div>
          }
          @for (item of historique; track $index) {
            <button class="history-item" (click)="chargerHistorique(item)">
              <div class="history-question">{{ item.question }}</div>
              <div class="history-meta">{{ item.resultat.length }} résultat(s)</div>
            </button>
          }
        </aside>

        <!-- Chat zone -->
        <div class="chat-container">

          <!-- Messages -->
          <div class="chat-messages" #chatMessages>

            @if (historique.length === 0 && !chargement) {
              <div class="chat-empty">
                <div class="chat-empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".5">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                    <circle cx="9" cy="10" r="1.5" fill="#6C63FF" stroke="none"/>
                    <circle cx="15" cy="10" r="1.5" fill="#6C63FF" stroke="none"/>
                    <path d="M9 13s1 1.5 3 1.5 3-1.5 3-1.5"/>
                  </svg>
                </div>
                <p class="chat-empty-title">Posez votre première question</p>
                <p class="chat-empty-sub">Exemples : "Combien de clients GOLD ?" · "Liste les 5 plus fidèles" · "Demandes RGPD en attente"</p>
              </div>
            }

            @for (item of historique.slice().reverse(); track $index) {
              <div class="chat-turn">
                <!-- User bubble -->
                <div class="msg-row msg-row--user">
                  <div class="bubble bubble--user">{{ item.question }}</div>
                </div>
                <!-- Agent response -->
                <div class="msg-row msg-row--agent">
                  <div class="agent-avatar">IA</div>
                  <div class="agent-content">
                    <!-- SQL block -->
                    <div class="sql-wrapper">
                      <div class="sql-header">
                        <span class="sql-label">SQL généré</span>
                        <span class="badge-groq">Groq · llama-3.3-70b</span>
                      </div>
                      <pre class="sql-block"><code>{{ item.sql }}</code></pre>
                    </div>
                    <!-- Result -->
                    @if (item.resultat.length > 0) {
                      <div class="result-wrapper">
                        <div class="result-header">
                          <span class="sql-label">Résultat</span>
                          <span class="result-count">{{ item.resultat.length }} ligne(s)</span>
                        </div>
                        <div class="result-table-scroll">
                          <table>
                            <thead>
                              <tr>
                                @for (col of getColonnes(item.resultat); track col) {
                                  <th>{{ col }}</th>
                                }
                              </tr>
                            </thead>
                            <tbody>
                              @for (ligne of item.resultat; track $index) {
                                <tr>
                                  @for (col of getColonnes(item.resultat); track col) {
                                    <td>{{ ligne[col] ?? '—' }}</td>
                                  }
                                </tr>
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    } @else {
                      <p class="no-result">Aucun résultat pour cette requête.</p>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- Loading state -->
            @if (chargement) {
              <div class="chat-turn">
                <div class="msg-row msg-row--user">
                  <div class="bubble bubble--user">{{ pendingQuestion }}</div>
                </div>
                <div class="msg-row msg-row--agent">
                  <div class="agent-avatar">IA</div>
                  <div class="agent-content">
                    <div class="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>
            }

            <div #messagesEnd></div>
          </div>

          <!-- Error -->
          @if (erreur) {
            <div class="chat-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ erreur }}
            </div>
          }

          <!-- Input -->
          <div class="chat-input-area">
            <textarea
              [(ngModel)]="question"
              (keydown)="onKeyDown($event)"
              placeholder="Posez votre question en français... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
              class="chat-textarea"
              rows="1"
            ></textarea>
            <button
              class="chat-send-btn"
              (click)="demander()"
              [disabled]="chargement || !question.trim()"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .agent-page {
      display: flex;
      flex-direction: column;
    }

    .agent-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 1.5rem;
      height: calc(100vh - 180px);
      min-height: 500px;
    }
    @media (max-width: 900px) {
      .agent-layout { grid-template-columns: 1fr; height: auto; }
    }

    /* ── Sidebar ── */
    .agent-sidebar {
      background: #1A1D27;
      border: 1px solid #2A2D3E;
      border-radius: 12px;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: .25rem;
    }
    .sidebar-section-title {
      font-size: .7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: #8B8FA8;
      padding: 0 .25rem;
      margin-bottom: .5rem;
    }
    .sidebar-empty {
      font-size: .82rem;
      color: #4A5568;
      text-align: center;
      padding: 1.5rem .5rem;
      font-style: italic;
    }
    .history-item {
      width: 100%;
      text-align: left;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 8px;
      padding: .6rem .75rem;
      cursor: pointer;
      transition: background .15s, border-color .15s;
      display: flex;
      flex-direction: column;
      gap: .2rem;
      font-family: 'Inter', sans-serif;
    }
    .history-item:hover {
      background: rgba(108,99,255,.08);
      border-color: rgba(108,99,255,.2);
    }
    .history-question {
      font-size: .82rem;
      color: #C4C6D4;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .history-meta {
      font-size: .72rem;
      color: #4A5568;
    }

    /* ── Chat Container ── */
    .chat-container {
      background: #1A1D27;
      border: 1px solid #2A2D3E;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* ── Empty State ── */
    .chat-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      text-align: center;
      padding: 3rem 2rem;
      gap: .75rem;
    }
    .chat-empty-icon { margin-bottom: .5rem; }
    .chat-empty-title { font-size: 1rem; font-weight: 600; color: #8B8FA8; }
    .chat-empty-sub { font-size: .82rem; color: #4A5568; max-width: 360px; line-height: 1.5; }

    /* ── Chat Turn ── */
    .chat-turn { display: flex; flex-direction: column; gap: 1rem; }

    .msg-row {
      display: flex;
      gap: .75rem;
    }
    .msg-row--user { justify-content: flex-end; }
    .msg-row--agent { justify-content: flex-start; align-items: flex-start; }

    /* ── User Bubble ── */
    .bubble--user {
      background: #6C63FF;
      color: #fff;
      padding: .7rem 1.1rem;
      border-radius: 14px 14px 4px 14px;
      font-size: .9rem;
      line-height: 1.5;
      max-width: 70%;
      word-break: break-word;
    }

    /* ── Agent Avatar ── */
    .agent-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6C63FF, #A78BFA);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .65rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
      margin-top: .1rem;
    }

    /* ── Agent Content ── */
    .agent-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: .75rem;
      min-width: 0;
    }

    /* ── SQL Block ── */
    .sql-wrapper {
      background: #0D0F1A;
      border: 1px solid #2A2D3E;
      border-radius: 10px;
      overflow: hidden;
    }
    .sql-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .55rem 1rem;
      border-bottom: 1px solid #2A2D3E;
      background: #0A0C14;
    }
    .sql-label {
      font-size: .68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: #8B8FA8;
    }
    .badge-groq {
      font-size: .68rem;
      background: rgba(108,99,255,.15);
      color: #A78BFA;
      border: 1px solid rgba(108,99,255,.25);
      border-radius: 20px;
      padding: 2px 9px;
      font-weight: 600;
    }
    .sql-block {
      background: transparent;
      color: #A78BFA;
      padding: .85rem 1rem;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: .82rem;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
    }

    /* ── Result ── */
    .result-wrapper {
      background: #212435;
      border: 1px solid #2A2D3E;
      border-radius: 10px;
      overflow: hidden;
    }
    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .55rem 1rem;
      border-bottom: 1px solid #2A2D3E;
    }
    .result-count { font-size: .72rem; color: #8B8FA8; }
    .result-table-scroll { overflow-x: auto; }
    .no-result {
      font-size: .85rem;
      color: #8B8FA8;
      padding: .75rem 1rem;
      font-style: italic;
    }

    /* ── Typing Dots ── */
    .typing-dots {
      display: flex;
      gap: 4px;
      padding: .75rem 1rem;
      background: #212435;
      border: 1px solid #2A2D3E;
      border-radius: 10px;
      width: fit-content;
    }
    .typing-dots span {
      width: 7px;
      height: 7px;
      background: #6C63FF;
      border-radius: 50%;
      animation: bounce .8s ease-in-out infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: .15s; }
    .typing-dots span:nth-child(3) { animation-delay: .3s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: .4; }
      40% { transform: translateY(-6px); opacity: 1; }
    }

    /* ── Error ── */
    .chat-error {
      margin: 0 1.5rem .5rem;
      padding: .65rem .9rem;
      border-radius: 8px;
      background: rgba(255,71,87,.1);
      color: #FF4757;
      border: 1px solid rgba(255,71,87,.2);
      font-size: .85rem;
      display: flex;
      align-items: center;
      gap: .5rem;
    }

    /* ── Chat Input ── */
    .chat-input-area {
      padding: 1rem 1.25rem;
      border-top: 1px solid #2A2D3E;
      display: flex;
      gap: .75rem;
      align-items: flex-end;
      background: #1A1D27;
    }
    .chat-textarea {
      flex: 1;
      background: #212435;
      border: 1px solid #2A2D3E;
      border-radius: 10px;
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: .9rem;
      padding: .7rem 1rem;
      resize: none;
      line-height: 1.5;
      transition: border-color .2s;
      max-height: 120px;
      overflow-y: auto;
    }
    .chat-textarea:focus {
      outline: none;
      border-color: #6C63FF;
    }
    .chat-textarea::placeholder { color: #4A5568; }

    .chat-send-btn {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: #6C63FF;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      padding: 0;
      transition: background .2s, transform .1s;
    }
    .chat-send-btn:hover:not(:disabled) { background: #5a52d5; }
    .chat-send-btn:active:not(:disabled) { transform: scale(.95); }
    .chat-send-btn:disabled { opacity: .4; cursor: not-allowed; }
  `],
})
export class AgentComponent implements AfterViewChecked {
  question      = '';
  pendingQuestion = '';
  historique: HistoriqueItem[] = [];
  chargement    = false;
  erreur        = '';

  private shouldScroll = false;

  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  constructor(private api: ApiService) {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.messagesEnd) {
      this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.shouldScroll = false;
    }
  }

  getColonnes(resultat: any[]): string[] {
    if (!resultat || resultat.length === 0) return [];
    return Object.keys(resultat[0]);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.demander();
    }
  }

  demander(): void {
    const q = this.question.trim();
    if (!q || this.chargement) return;

    this.chargement = true;
    this.erreur = '';
    this.pendingQuestion = q;

    this.api.queryAgent(q).subscribe({
      next: (res: any) => {
        this.historique.unshift({
          question: res.question,
          sql: res.sql,
          resultat: res.resultat,
        });
        this.question = '';
        this.chargement = false;
        this.shouldScroll = true;
      },
      error: (err) => {
        this.erreur = err.error?.message || 'Erreur lors de la requête.';
        this.chargement = false;
      },
    });
  }

  chargerHistorique(item: HistoriqueItem): void {
    this.question = item.question;
    this.erreur = '';
  }
}
