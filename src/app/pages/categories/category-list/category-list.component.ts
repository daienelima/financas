import { Component, OnInit } from '@angular/core';

import { Category } from "../shared/category.model";
import { CategoriaService } from '../shared/categoria.service';
import { Observable } from 'rxjs';
import toastr from "toastr";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categoria$: Observable<Category[]>;

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.categoria$ = this.categoriaService.getCategoria();
  }

  private actionsForSuccess() {
    toastr.success("Solicitação processada com sucesso!");
  }

  delete(c: Category) {
    const confirmacao = confirm('Deseja realmente excluir este item?');

    if (confirmacao) {
      this.categoriaService.deleteCategoria(c).then(() => {
        this.actionsForSuccess();
      }).catch((e) => {
        alert('Erro ao tentar Excluir Categoria');
      })
    }
  }

}