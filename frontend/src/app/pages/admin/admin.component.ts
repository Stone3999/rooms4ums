import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <h1 class="win-title">PANEL DE ADMINISTRACION</h1>
      
      <div class="stats-row">
        <div class="stat-card win-panel">
          <h3>USUARIOS TOTALES</h3>
          <p class="stat-number">1,240</p>
        </div>
        <div class="stat-card win-panel">
          <h3>ROOMS ACTIVAS</h3>
          <p class="stat-number">12</p>
        </div>
        <div class="stat-card win-panel">
          <h3>MENSAJES / DIA</h3>
          <p class="stat-number">45,000</p>
        </div>
      </div>

      <div class="admin-table-container win-panel">
        <h3 class="win-title">GESTION DE USUARIOS</h3>
        <table class="win-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USUARIO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>ADMIN_MASTER</td>
              <td>ACTIVO</td>
              <td><button class="win-button small">EDITAR</button></td>
            </tr>
            <tr>
              <td>002</td>
              <td>USER_TEST</td>
              <td>SUSPENDIDO</td>
              <td><button class="win-button small">ACTIVAR</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
    }
    .stats-row {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      flex: 1;
      text-align: center;
      padding: 20px;
    }
    .stat-number {
      font-size: 2rem;
      color: var(--accent-color);
      font-weight: bold;
    }
    .win-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid var(--win-border-light);
      padding: 10px;
      text-align: left;
    }
    th {
      color: var(--accent-color);
      text-transform: uppercase;
      font-size: 0.8rem;
    }
    .small {
      padding: 2px 8px;
      font-size: 0.7rem;
    }
  `]
})
export class AdminComponent {}
