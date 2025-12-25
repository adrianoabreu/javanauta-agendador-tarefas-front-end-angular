import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DialogField, ModalDialogComponent } from '../../shared/components/modal-dialog/modal-dialog.component';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {

  private tasksService = inject(TasksService)
  readonly dialog = inject(MatDialog);

  cadstrarTarefa() {
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

        const formatterDateTime = (n: number) => n.toString().padStart(2, "0")

        const ano = data.getFullYear();
        const mes = formatterDateTime(data.getMonth() + 1);
        const dia = formatterDateTime(data.getDate());

        const hora = formatterDateTime(tempo.getHours());
        const minuto = formatterDateTime(tempo.getMinutes());
        const segundo = formatterDateTime(tempo.getSeconds());

        const dataEvento = `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`
        
        const payload = {
          ...resto,
          dataEvento
        }
       
        this.tasksService.createTask(payload).subscribe({
          next: () => console.log('Tarefa cadastrada com sucesso', payload),
          error: () => console.log('Erro ao cadastrar a tarefa', payload),
        })
      }
    });
  }

}
