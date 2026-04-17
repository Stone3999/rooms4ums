import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RoomService, Room } from '../../core/services/room.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dashboard">
      <h1 class="win-title">SISTEMA DE ADMINISTRACIÓN CENTRAL</h1>
      
      <!-- TABS -->
      <div class="win-tabs">
        <button class="tab-button" [class.active]="activeTab === 'users'" (click)="setTab('users')">USUARIOS</button>
        <button class="tab-button" [class.active]="activeTab === 'rooms'" (click)="setTab('rooms')">ROOMS</button>
      </div>

      <!-- CONTENIDO DE USUARIOS -->
      <div class="tab-content win-panel" *ngIf="activeTab === 'users'">
        <div class="header-row">
          <h3 class="win-title mini">GESTIÓN DE USUARIOS</h3>
          <button class="win-button" (click)="loadUsers()"><i class="pixelart-icons-font-reload"></i> REFRESCAR</button>
        </div>
        
        <table class="win-table">
          <thead>
            <tr>
              <th>USUARIO</th>
              <th>EMAIL</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <span [class.status-active]="user.status === 'ONLINE'" 
                      [class.status-suspended]="user.status === 'SUSPENDED'">
                  {{ user.status }}
                </span>
              </td>
              <td class="actions">
                <button class="win-button small" (click)="toggleUserStatus(user)">
                  {{ user.status === 'SUSPENDED' ? 'ACTIVAR' : 'SUSPENDER' }}
                </button>
                <button class="win-button small danger" (click)="deleteUser(user)">BORRAR</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CONTENIDO DE ROOMS -->
      <div class="tab-content win-panel" *ngIf="activeTab === 'rooms'">
        <div class="header-row">
          <h3 class="win-title mini">GESTIÓN DE ROOMS</h3>
          <button class="win-button accent" (click)="openRoomModal()"><i class="pixelart-icons-font-plus"></i> NUEVA ROOM</button>
        </div>

        <table class="win-table">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>SLUG</th>
              <th>ESTADO</th>
              <th>ICONO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let room of rooms()">
              <td>{{ room.name }}</td>
              <td>{{ room.slug }}</td>
              <td>{{ room.status }}</td>
              <td><i [class]="room.icon || 'pixelart-icons-font-door'"></i></td>
              <td class="actions">
                <button class="win-button small" (click)="openRoomModal(room)">EDITAR</button>
                <button class="win-button small danger" (click)="deleteRoom(room)">BORRAR</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MODAL PARA ROOMS -->
      <div class="modal-overlay" *ngIf="showRoomModal">
        <div class="win-panel modal-content">
          <div class="win-title-bar">
            <span>{{ editingRoom ? 'EDITAR ROOM' : 'NUEVA ROOM' }}</span>
            <button class="win-button close" (click)="closeRoomModal()">X</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>NOMBRE:</label>
              <input type="text" [(ngModel)]="roomForm.name" class="win-input">
            </div>
            <div class="form-group">
              <label>SLUG:</label>
              <input type="text" [(ngModel)]="roomForm.slug" class="win-input">
            </div>
            <div class="form-group">
              <label>DESCRIPCIÓN:</label>
              <textarea [(ngModel)]="roomForm.description" class="win-input"></textarea>
            </div>
            <div class="form-group">
              <label>ICONO (pixelart-icons):</label>
              <input type="text" [(ngModel)]="roomForm.icon" class="win-input" placeholder="pixelart-icons-font-door">
            </div>
            <div class="form-group">
              <label>ESTADO:</label>
              <select [(ngModel)]="roomForm.status" class="win-input">
                <option value="ACTIVE">ACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="CONSTRUCTION">CONSTRUCTION</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="win-button" (click)="closeRoomModal()">CANCELAR</button>
            <button class="win-button accent" (click)="saveRoom()">GUARDAR CAMBIOS</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard { padding: 20px; }
    .win-tabs { display: flex; gap: 4px; margin-bottom: -2px; position: relative; z-index: 1; }
    .tab-button {
      padding: 10px 20px; border: 2px solid; 
      border-color: var(--win-border-light) var(--win-border-dark) transparent var(--win-border-light);
      background: var(--bg-secondary); color: var(--text-secondary); cursor: pointer;
      font-weight: bold; font-size: 0.8rem;
    }
    .tab-button.active { background: var(--bg-color); color: var(--accent-color); border-bottom-color: var(--bg-color); }
    
    .tab-content { padding: 20px; min-height: 400px; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .win-title.mini { margin-bottom: 0; font-size: 0.8rem; border-bottom: none; }

    .win-table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #333; padding: 12px; text-align: left; font-size: 0.85rem; }
    th { color: var(--accent-color); background: #111; text-transform: uppercase; font-size: 0.75rem; }
    
    .status-active { color: #00ff00; }
    .status-suspended { color: #ff0000; }

    .actions { display: flex; gap: 8px; }
    .win-button.small { padding: 4px 8px; font-size: 0.7rem; }
    .win-button.danger { color: #ff5555; border-color: #ff5555; }
    .win-button.accent { color: black; background: var(--accent-color); }

    /* MODAL */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal-content { width: 500px; max-width: 90%; }
    .win-title-bar { 
      background: var(--accent-color); color: black; padding: 5px 10px;
      display: flex; justify-content: space-between; align-items: center; font-weight: bold;
    }
    .win-title-bar .close { background: #000; color: #fff; padding: 0 5px; height: 20px; line-height: 20px; }
    .modal-body { padding: 20px; }
    .form-group { margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px; }
    .form-group label { font-size: 0.7rem; color: var(--accent-color); }
    .win-input { background: #000; border: 1px solid #333; color: #fff; padding: 8px; outline: none; }
    .modal-footer { padding: 15px 20px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #222; }
  `]
})
export class AdminComponent implements OnInit {
  authService = inject(AuthService);
  roomService = inject(RoomService);

  activeTab = 'users';
  users = signal<any[]>([]);
  rooms = signal<Room[]>([]);

  // Modal logic
  showRoomModal = false;
  editingRoom: Room | null = null;
  roomForm: {
    name: string;
    slug: string;
    description: string;
    icon: string;
    status: 'ACTIVE' | 'MAINTENANCE' | 'CONSTRUCTION' | 'ARCHIVED';
  } = {
    name: '',
    slug: '',
    description: '',
    icon: 'pixelart-icons-font-door',
    status: 'ACTIVE'
  };

  ngOnInit() {
    this.loadUsers();
    this.loadRooms();
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  // --- USERS LOGIC ---
  async loadUsers() {
    try {
      const data = await this.authService.getAllUsers();
      this.users.set(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  async toggleUserStatus(user: any) {
    const newStatus = user.status === 'SUSPENDED' ? 'OFFLINE' : 'SUSPENDED';
    try {
      await this.authService.updateUserStatus(user.id, newStatus);
      this.loadUsers();
    } catch (error) {
      alert('Error al actualizar estado del usuario');
    }
  }

  async deleteUser(user: any) {
    if (!confirm(`¿Seguro que quieres eliminar a ${user.username}? Esta acción es irreversible.`)) return;
    try {
      await this.authService.deleteUser(user.id);
      this.loadUsers();
    } catch (error) {
      alert('Error al eliminar usuario');
    }
  }

  // --- ROOMS LOGIC ---
  async loadRooms() {
    try {
      const data = await this.roomService.getAllRooms();
      this.rooms.set(data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  }

  openRoomModal(room?: Room) {
    if (room) {
      this.editingRoom = room;
      this.roomForm = {
        name: room.name,
        slug: room.slug,
        description: room.description,
        icon: room.icon || 'pixelart-icons-font-door',
        status: room.status
      };
    } else {
      this.editingRoom = null;
      this.roomForm = {
        name: '',
        slug: '',
        description: '',
        icon: 'pixelart-icons-font-door',
        status: 'ACTIVE'
      };
    }
    this.showRoomModal = true;
  }

  closeRoomModal() {
    this.showRoomModal = false;
  }

  async saveRoom() {
    try {
      if (this.editingRoom) {
        await this.roomService.updateRoom(this.editingRoom.id, this.roomForm);
      } else {
        await this.roomService.createRoom(this.roomForm);
      }
      this.closeRoomModal();
      this.loadRooms();
    } catch (error) {
      alert('Error al guardar la room. Asegúrate de que el slug sea único.');
    }
  }

  async deleteRoom(room: Room) {
    if (!confirm(`¿Borrar la room ${room.name}? Se perderá el acceso desde el inicio.`)) return;
    try {
      await this.roomService.deleteRoom(room.id);
      this.loadRooms();
    } catch (error) {
      alert('Error al borrar la room');
    }
  }
}
