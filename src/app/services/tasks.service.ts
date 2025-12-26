import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface TasksResponse {
  id: string,
  nomeTarefa: string,
  descricao: string,
  dataCriacao: string,
  dataEvento: string,
  emailUsuario: string,
  dataAlteracao: string,
  statusNotificacaoEnum: 'PENDENTE' | 'NOTIFICADO' | 'CANCELADO'
}

interface TasksPayload {
  nomeTarefa: string,
  descricao: string,
  dataCriacao: string
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private apiUrl = 'http://localhost:8083'; //TODO: colocar esse valor num .ENV

  private _tasks = signal<TasksResponse[] | null>(null);
  readonly tasks = this._tasks.asReadonly();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { this.loadTasks() }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `${token}` })
  }

  loadTasks(): void {
    this.http.get<TasksResponse[]>(`${this.apiUrl}/tarefas`, { headers: this.getHeaders() })
    .subscribe({
      next: tasks => this._tasks.set(tasks),
      error: () => this._tasks.set([])
    })
  }

  createTask(body: TasksPayload): Observable<TasksResponse> {
    return this.http.post<TasksResponse>(`${this.apiUrl}/tarefas`, body, { headers: this.getHeaders() })
    .pipe(
      tap(() => this.loadTasks())
    )
  }

  editTask(id: string, body: TasksPayload): Observable<TasksResponse> {
    return this.http.put<TasksResponse>(`${this.apiUrl}/tarefas?id=${id}`, body, { headers: this.getHeaders() })
    .pipe(
      tap(() => this.loadTasks())
    )
  }

}
