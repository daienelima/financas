import { Component, OnInit } from '@angular/core';

import { Entry } from "../shared/entry.model";
import { EntradaService } from '../shared/entrada.service';
import { Observable } from 'rxjs';
import toastr from "toastr";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  lancamentos$: Observable<Entry[]>;

  constructor(private entradaService: EntradaService) { }

  ngOnInit() {
    this.lancamentos$ = this.entradaService.getEntradas();
  }

  private actionsForSuccess() {
    toastr.success("Solicitação processada com sucesso!");
  }

  delete(e: Entry) {
    const confirmacao = confirm('Deseja realmente excluir este item?');

    if (confirmacao) {
      this.entradaService.deleteEntrada(e).then(() => {
        this.actionsForSuccess();
      }).catch((e) => {
        alert('Erro ao tentar Excluir Lançamento');
      })
    }

  }

}
