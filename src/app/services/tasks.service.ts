import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TaskResponse {
  id: string,
  nomeTarefa: string,
  descricao: string,
  dataCriacao: string,
  dataEvento: string,
  emailUsuario: string,
  dataAlteracao: string,
  statusNotificacaoEnum: 'PENDENTE' | 'NOTIFICADO' | 'CANCELADO'
}

interface TaskPayload {
  nomeTarefa: string,
  descricao: string,
  dataCriacao: string
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private apiUrl = 'http://localhost:8083'; //TODO: colocar esse valor num .ENV

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `${token}` })
  }

  getTasks(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/tarefas`, { headers: this.getHeaders() })
  }

  createTask(body: TaskPayload): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiUrl}/tarefas`, body, { headers: this.getHeaders() })
  }

}
