import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-popular',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.css'
})
export class PopularComponent {
  private router = inject(Router);
  public langService = inject(LanguageService);

  // Datos mock agrupados por "Room"
  popularRooms = [
    {
      id: 'ajedrez',
      name: 'AJEDREZ',
      posts: [
        { id: 101, title: 'EL MEJOR GAMBITO DE REY', author: 'Magnus_90', likes: 156, dislikes: 12 },
        { id: 102, title: 'TORNEO DE PRIMAVERA', author: 'ChessMaster', likes: 89, dislikes: 3 }
      ]
    },
    {
      id: 'gaming',
      name: 'GAMING',
      posts: [
        { id: 201, title: 'REVIEW: ELDEN RING DLC', author: 'GamerX', likes: 420, dislikes: 15 },
        { id: 202, title: 'BUSCO GENTE PARA RAID', author: 'NoobPro', likes: 45, dislikes: 0 }
      ]
    },
    {
      id: 'tech',
      name: 'TECNOLOGIA',
      posts: [
        { id: 301, title: 'NUEVA IA PARA CODIGO', author: 'DevLover', likes: 312, dislikes: 8 }
      ]
    }
  ];

  goToPost(roomId: string, postId: number) {
    this.router.navigate(['/foro', roomId, 'post', postId]);
  }
}
