import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="post-details-container">
      <div class="top-nav">
        <button class="win-button" (click)="goBack()">
          <i class="pixelart-icons-font-arrow-left"></i> {{ langService.translate('BACK_TO_FORUM') }}
        </button>
      </div>
      
      <div class="post-main win-panel">
        <div class="post-header">
          <span class="author"><i class="pixelart-icons-font-user"></i> {{ langService.translate('USER') }}: {{post.author}}</span>
          <span class="date"><i class="pixelart-icons-font-calendar"></i> {{ langService.translate('DATE') }}: {{post.date}}</span>
        </div>
        <h1 class="win-title">{{post.title}}</h1>
        <p class="post-content">{{post.content}}</p>
        
        <div class="post-actions-row">
          <div class="reactions-left">
            <button class="win-button small"><i class="pixelart-icons-font-arrow-up"></i> {{post.likes}} LIKES</button>
            <button class="win-button small"><i class="pixelart-icons-font-arrow-down"></i> {{post.dislikes}} DISLIKES</button>
          </div>
          <div class="translate-right">
            <select class="win-select mini" (change)="translatePost(post, $event)">
              <option value="" selected disabled>{{ langService.translate('TRANSLATE_TO') }}...</option>
              <option value="es">ESPAÑOL</option>
              <option value="en">ENGLISH</option>
              <option value="fr">FRANÇAIS</option>
              <option value="jp">日本語</option>
              <option value="it">ITALIANO</option>
              <option value="pt">PORTUGUÊS</option>
            </select>
          </div>
        </div>
      </div>

      <div class="comments-section">
        <h3 class="win-title">{{ langService.translate('COMMENTS') }} ({{comments.length}})</h3>
        
        <div class="comment-input win-panel">
          <textarea class="win-input" [placeholder]="langService.translate('WRITE_COMMENT_PLACEHOLDER')"></textarea>
          <button class="win-button"><i class="pixelart-icons-font-message"></i> {{ langService.translate('PUBLISH') }}</button>
        </div>

        <div class="comment-card win-panel" *ngFor="let comment of comments">
          <div class="comment-header">
            <span><i class="pixelart-icons-font-user"></i> {{comment.author}}</span>
            <span>{{comment.date}}</span>
          </div>
          <p>{{comment.text}}</p>
          <div class="comment-actions-row">
            <div class="reactions-left">
              <span class="small-text"><i class="pixelart-icons-font-arrow-up"></i> {{comment.likes}}</span>
              <span class="small-text"><i class="pixelart-icons-font-arrow-down"></i> {{comment.dislikes}}</span>
            </div>
            <div class="translate-right">
              <select class="win-select mini" (change)="translatePost(comment, $event)">
                <option value="" selected disabled>{{ langService.translate('TRANSLATE_TO') }}...</option>
                <option value="es">ESPAÑOL</option>
                <option value="en">ENGLISH</option>
                <option value="fr">FRANÇAIS</option>
                <option value="jp">日本語</option>
                <option value="it">ITALIANO</option>
                <option value="pt">PORTUGUÊS</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .post-details-container { max-width: 900px; margin: 0 auto; padding: 10px; }
    .top-nav { height: 45px; display: flex; align-items: center; margin-bottom: 10px; }
    .post-main { padding: 20px; margin-bottom: 30px; }
    .post-header { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 15px; }
    .post-header i { margin-right: 5px; }
    .post-content { margin: 20px 0; line-height: 1.6; white-space: pre-wrap; font-size: 0.95rem; }
    .comments-section { margin-top: 40px; }
    
    .post-actions-row, .comment-actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .reactions-left { display: flex; gap: 10px; }
    
    .comment-input { margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; padding: 15px; }
    textarea { background: black; border: 1px solid var(--win-border-light); color: var(--accent-color); min-height: 80px; padding: 10px; outline: none; resize: vertical; }
    .comment-card { padding: 15px; margin-bottom: 10px; }
    .comment-header { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--accent-color); margin-bottom: 10px; font-weight: bold; }
    .comment-header i { margin-right: 5px; }
    .small-text { font-size: 0.7rem; margin-right: 15px; }
    
    .win-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 32px;
      padding: 0 15px;
      font-size: 0.75rem;
    }

    .win-button.small { height: 26px; padding: 0 10px; font-size: 0.65rem; }

    .win-select.mini {
      font-size: 0.7rem;
      padding: 2px 5px;
      height: 22px;
      background-color: var(--win-bg-dark);
      color: var(--accent-color);
      border: 1px solid var(--win-border-light);
    }
  `]
})
export class PostDetailsComponent implements OnInit {
  private location = inject(Location);
  public langService = inject(LanguageService);
  private transService = inject(TranslationService);
  private route = inject(ActivatedRoute);

  post = {
    id: 1,
    author: 'ADMIN_01',
    title: 'REGLAS DE LA SALA',
    content: 'ESTE ES EL CONTENIDO DETALLADO DE LAS REGLAS...',
    likes: 45,
    dislikes: 2,
    date: '24/03/2026',
    originalTitle: '',
    originalContent: ''
  };

  comments: any[] = [
    { author: 'USER_TEST', text: 'ENTENDIDO.', date: '24/03/2026', likes: 2, dislikes: 0, originalText: '' }
  ];

  ngOnInit() {
    const postId = this.route.snapshot.params['postId'];
    console.log('Cargando post:', postId);
  }

  goBack() {
    this.location.back();
  }

  async translatePost(item: any, event: any) {
    const targetLang = event.target.value;
    if (!targetLang) return;

    if (targetLang === this.langService.currentLang()) {
      if (item.content !== undefined && item.originalTitle) {
        item.title = item.originalTitle;
        item.content = item.originalContent;
      } else if (item.text !== undefined && item.originalText) {
        item.text = item.originalText;
      }
      event.target.value = '';
      return;
    }

    const originalOptionText = event.target.options[event.target.selectedIndex].text;
    event.target.options[event.target.selectedIndex].text = '...';

    try {
      const currentLang = this.langService.currentLang();
      if (item.content !== undefined) {
        if (!item.originalTitle) item.originalTitle = item.title;
        if (!item.originalContent) item.originalContent = item.content;
        
        item.title = await this.transService.translateText(item.originalTitle, targetLang, currentLang);
        item.content = await this.transService.translateText(item.originalContent, targetLang, currentLang);
      } 
      else if (item.text !== undefined) {
        if (!item.originalText) item.originalText = item.text;
        item.text = await this.transService.translateText(item.originalText, targetLang, currentLang);
      }
    } finally {
      event.target.options[event.target.selectedIndex].text = originalOptionText;
      event.target.value = '';
    }
  }
}
