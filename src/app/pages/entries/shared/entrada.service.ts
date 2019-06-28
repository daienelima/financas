import { Injectable } from '@angular/core';
import { Entry } from './entry.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private entradaCollecton: AngularFirestoreCollection<Entry> = this.afs.collection('entradas');

  constructor(private afs: AngularFirestore) { }

  getEntradas(): Observable<Entry[]>{
    return this.entradaCollecton.valueChanges();
  }

  getById(id: string): Observable<Entry[]>{
    return this.afs.collection<Entry>('entradas', 
    ref => ref.where('id', '==', id)).valueChanges();
  }

  addEntrada(entrada: Entry){
    entrada.id = this.afs.createId();
    return this.entradaCollecton.doc(entrada.id).set(entrada);
    //return this.entradaCollecton.add(entrada);
  }

  deleteEntrada(entrada: Entry){
    return this.entradaCollecton.doc(entrada.id).delete();
  }

  updateEntrada(entrada: Entry){
    return this.entradaCollecton.doc(entrada.id).set(entrada);
  }

  getByMonthAndYear(a,b):  Observable<Entry[]>{
    return this.afs.collection<Entry>('entradas',
    ref => ref.orderBy('date').endAt(b).endBefore(a))
    .valueChanges();
  }

}
