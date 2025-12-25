import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { DialogField, ModalDialogComponent } from '../../shared/components/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-tasks',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {

  mockBody = {
    nomeTarefa: "string",
    descricao: "string",
    dataEvento: "2025-11-16T20:23:17.702Z"
  }

  private authService = inject(AuthService);
  readonly dialog = inject(MatDialog);

  cadstrarTarefa() {

    const token = this.authService.getToken()
    if (!token) return

    const formConfig: DialogField[] = [
      { name: 'nomeTarefa', label: 'Nome da Tarefa' },
      { name: 'data', label: 'Data da Tarefa', type: 'date' },
      { name: 'tempo', label: 'Hora da Tarefa', type: 'time' },
      { name: 'descricao', label: 'Descreva a Tarefa' },
    ]
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: { title: 'Adicionar Tarefa', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const { data, tempo, ...resto } = result;
        const ano = data.getFullYear();
        const mes = data.getMonth();
        const dia = data.getDate();

        const hora = tempo.getHours();
        const minuto = tempo.getMinutes();
        const segundo = tempo.getSeconds();

        const dataEvento = new Date(ano, mes, dia, hora, minuto, segundo).toISOString()
        
        const payload = {
          ...resto,
          dataEvento
        }

        console.log("tarefa cadastrada", payload)
        // this.userService.saveEndereco(result, token).subscribe({
        //   next: () => console.log('Endereço cadastrado com sucesso', result),
        //   error: () => console.log('Erro ao cadastrar endereço', result),
        // })
      }
    });
  }

}
