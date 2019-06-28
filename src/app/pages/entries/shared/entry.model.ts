export class Entry {
    public id?: string;
    public name?: string;
    public description?: string;
    public type?: string;
    public amount?: string;
    public date?: string;
    public paid?: boolean;
    public categoryId?: string;
    public category?: string

  static types = {
    Despesa: 'Despesa',
    Receita: 'Receita'
  };

  static fromJson(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  get paidText(): string {
    return this.paid ? 'Pago' : 'Pedente';
  }
}