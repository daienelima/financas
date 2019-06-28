import { Component, Injector, OnInit, AfterContentChecked } from '@angular/core';
import { Validators, FormBuilder } from "@angular/forms";

import { Category } from "../shared/category.model";
import { CategoriaService } from '../shared/categoria.service';
import toastr from "toastr";
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from "rxjs/operators";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked{

  currentAction: string;
  pageTitle: string;
  private route: ActivatedRoute;
  private router: Router;
  private nomeCategoriaEditada: string;

  constructor(private categoriaService: CategoriaService, 
              private formBuilder: FormBuilder, private injector: Injector) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
   
  }

  formCategoria = this.formBuilder.group({
    id: [undefined],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['']
  });

  ngOnInit() {
    this.setCurrentAction();
    this.loadResource();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new"
    }     
    else{
      this.currentAction = "edit"
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = this.creationPageTitle();
    else{
      this.pageTitle = this.editionPageTitle();
    }
  }

  private loadResource() {
    if (this.currentAction == "edit") {
      
      this.route.paramMap.pipe(
        switchMap(params => this.categoriaService.getById(params.get('id')))
      ).subscribe(
        (categoriaAlt) => {
          this.formCategoria.patchValue(categoriaAlt)
          this.edite(categoriaAlt[0]);
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private actionsForSuccess(){
    toastr.success("Solicitação processada com sucesso!");
  }

  salvar(){
    let c: Category = this.formCategoria.value;
    if(!c.id){
      this.addCategoria(c);
    }else{
      this.updateCategoria(c);
    }
  }

  addCategoria(c: Category){
    this.categoriaService.addCategoria(c)
    .then(()=>{
      this.actionsForSuccess(); 
      this.router.navigate(['/categories']);
    }).catch((e)=>{
      console.log(e);
    })
  }

  updateCategoria(c: Category){
    this.categoriaService.updateCategoria(c)
    .then(()=>{
      this.actionsForSuccess(); 
      this.router.navigate(['/categories']);
    }).catch((e)=>{
      console.log(e);
    })
  }

  edite(c: Category){
    this.nomeCategoriaEditada = c.name;
    this.formCategoria.setValue(c); 
  }

  private creationPageTitle(): string {
    return "Cadastro de Nova Categoria";
  }

  private editionPageTitle(): string {
    const categoryName = this.nomeCategoriaEditada || "";
    return "Editando Categoria: " + categoryName;
  }
}