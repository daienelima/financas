import { Component, OnInit, Injector, AfterContentChecked } from '@angular/core';
import { Validators, FormBuilder } from "@angular/forms";

import { Entry } from "../shared/entry.model";
import { Category } from "../../categories/shared/category.model";
import { EntradaService } from '../shared/entrada.service';
import { CategoriaService } from '../../categories/shared/categoria.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import toastr from "toastr";
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  categoria$: Observable<Category[]>;
  name$: Observable<Category[]>;
  currentAction: string;
  pageTitle: string;
  private nomeCategoriaRetorno: string;
  private nomeEditar: string;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }

  constructor(
    private entradaService: EntradaService, private categoriaService: CategoriaService,
    private router: Router, private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadCategories();
    this.setCurrentAction();
    this.loadResource();
  }

  private loadCategories() {
    this.categoria$ = this.categoriaService.getCategoria();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new"
    }
    else {
      this.currentAction = "edit"
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = this.creationPageTitle();
    else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  private loadResource() {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.entradaService.getById(params.get('id')))).subscribe(
        (entradaAlt) => {
          this.entradaForm.patchValue(entradaAlt);
          this.edite(entradaAlt[0]);
        } 
      )
    }
  }

  entradaForm = this.formBuilder.group({
    id: [undefined],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    type: ["Despesa", [Validators.required]],
    amount: ['', [Validators.required]],
    date: ['', [Validators.required]],
    paid: [true, [Validators.required]],
    categoryId: ['', [Validators.required]]
  });

  private actionsForSuccess() {
    toastr.success("Solicitação processada com sucesso!");
  }

  salvar() {
    let e: Entry = this.entradaForm.value;
    if (!e.id) {
      this.categoriaService.getById(e.categoryId).subscribe(categoriaNome => {
        categoriaNome.map(res => this.nomeCategoriaRetorno = res.name);
        e.categoryId = this.entradaForm.get('categoryId').value;
        e.category = this.nomeCategoriaRetorno;
        this.addentrada(e);
      });
    } else {
      this.categoriaService.getById(e.categoryId).subscribe(categoriaNome => {
        categoriaNome.map(res => this.nomeCategoriaRetorno = res.name);
        e.categoryId = this.entradaForm.get('categoryId').value;
        e.category = this.nomeCategoriaRetorno;
        this.updateEntrada(e);
      });
    }
  }

  addentrada(e: Entry) {
    this.entradaService.addEntrada(e).then(() => {
      this.actionsForSuccess();
      this.router.navigate(['/entries']);
    }).catch((e) => {
      console.log(e);
    })
  }

  updateEntrada(e: Entry) {
    this.entradaService.updateEntrada(e).then(() => {
      this.actionsForSuccess();
      this.router.navigate(['/entries']);
    }).catch((err) => {
      console.log(err);
    })
  }

  edite(e: Entry) {
    this.nomeEditar = e.name;
    //this.entradaForm.setValue(e); 
    this.entradaForm.controls['id'].setValue(e.id);
    this.entradaForm.controls['name'].setValue(e.name);
    this.entradaForm.controls['description'].setValue(e.description);
    this.entradaForm.controls['type'].setValue(e.type);
    this.entradaForm.controls['amount'].setValue(e.amount);
    this.entradaForm.controls['date'].setValue(e.date);
    this.entradaForm.controls['categoryId'].setValue(e.categoryId);
    this.entradaForm.controls['paid'].setValue(e.paid);
  }

  private creationPageTitle(): string {
    return "Cadastro de Novo Lançamento";
  }

  private editionPageTitle(): string {
    const resourceName = this.nomeEditar || "";
    return "Editando Lançamento: " + resourceName;
  }

}