import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private categoriaCollecton: AngularFirestoreCollection<Category> = this.afs.collection('categoria');

  constructor(private afs: AngularFirestore) { }

  getCategoria(): Observable<Category[]>{
    return this.categoriaCollecton.valueChanges();
  }

  addCategoria(categoria: Category){
    categoria.id = this.afs.createId();
    return this.categoriaCollecton.doc(categoria.id).set(categoria);
    //return this.categoriaCollecton.add(categoria);
  }

  deleteCategoria(categoria: Category){
    return this.categoriaCollecton.doc(categoria.id).delete();
  }

  updateCategoria(categoria: Category){
    return this.categoriaCollecton.doc(categoria.id).set(categoria);
  }

  getById(id: string): Observable<Category[]>{
    return this.afs.collection<Category>('categoria', 
    ref => ref.where('id', '==', id)).valueChanges();
  }
}