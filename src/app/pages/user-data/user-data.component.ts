import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserResponse, UserService } from '../../services/user.service';
import { DialogField, ModalDialogComponent } from '../../shared/components/modal-dialog/modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-data',
  imports: [MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss'
})
export class UserDataComponent {

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  readonly dialog = inject(MatDialog);

  user = this.userService.user;

  form = this.formBuilder.group({
    nome: [{ value: this.user()?.nome || '', disabled: true }],
    email: [{ value: this.user()?.email || '', disabled: true }],
  });

  cadstrarEndereco() {

    const token = this.authService.getToken()
    if (!token) return

    const formConfig: DialogField[] = [
      { name: 'cep', label: 'CEP', validators: [Validators.required] },
      { name: 'rua', label: 'Rua' },
      { name: 'numero', label: 'Numero', type: 'number' },
      { name: 'complemento', label: 'Complemento' },
      { name: 'cidade', label: 'Cidade' },
      { name: 'estado', label: 'Estado' },
    ]
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: { title: 'Adicionar Endereço', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.saveEndereco(result, token).subscribe({
          next: () => console.log('Endereço cadastrado com sucesso', result),
          error: () => console.log('Erro ao cadastrar endereço', result),
        })
      }
    });
  }

  editarEndereco(endereco: {
    id: number,
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }) {

    const token = this.authService.getToken()
    if (!token) return

    const formConfig: DialogField[] = [
      { name: 'cep', label: 'CEP', value: endereco.cep,validators: [Validators.required] },
      { name: 'rua', label: 'Rua', value: endereco.rua },
      { name: 'numero', label: 'Numero', type: 'number', value: endereco.numero },
      { name: 'complemento', label: 'Complemento', value: endereco.complemento },
      { name: 'cidade', label: 'Cidade', value: endereco.cidade },
      { name: 'estado', label: 'Estado', value: endereco.estado },
    ]
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: { title: 'Editar Endereço', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateEndereco(endereco.id, result, token).subscribe({
          next: () => console.log('Endereço editado com sucesso', result),
          error: () => console.log('Erro ao editar endereço', result),
        })
      }
    });
  }

  cadastrarTelefone() {

    const token = this.authService.getToken()
    if (!token) return

    const formConfig: DialogField[] = [
      { name: 'ddd', label: 'DDD', validators: [Validators.required] },
      { name: 'numero', label: 'numero', validators: [Validators.required] },
    ]

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: { title: 'Adicionar Telefone', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.savePhone(result, token).subscribe({
          next: () => console.log('Telefone cadastrado com sucesso', result),
          error: () => console.log('Erro ao cadastrar telefone', result),
        })
      }
    });
  }

  editarTelefone(telefone: { id: number, ddd: string, numero: string }) {

    const token = this.authService.getToken()
    if (!token) return

    const formConfig: DialogField[] = [
      { name: 'ddd', label: 'DDD', value: telefone.ddd, validators: [Validators.required] },
      { name: 'numero', label: 'numero', value: telefone.numero, validators: [Validators.required] },
    ]

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: { title: 'Editar Telefone', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updatePhone(telefone.id, result, token).subscribe({
          next: () => console.log('Telefone editado com sucesso', result),
          error: () => console.log('Erro ao editar telefone', result),
        })
      }
    });
  }
}
