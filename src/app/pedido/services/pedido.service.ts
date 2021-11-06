import { Injectable } from '@angular/core';
import { ItensDoPedido, Pedidos } from '../../shared/models/pedidos.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Produto } from 'src/app/shared/models/produto.model';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private httpClient: HttpClient) { }
  
  BASE_URL = 'https://apiufpr2021.herokuapp.com/api/v1/pedidos'
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  inserirPedido(order: {}): Observable<[{}]>{
    return this.httpClient.post<[{}]>(this.BASE_URL, JSON.stringify(order), this.httpOptions)
  }

  converteProdutosEmProdutosPedido(produtos: Produto[], idCliente: string): ItensDoPedido[]{
    let produtosPedido: ItensDoPedido[] = []
    produtos.forEach(produto => {
      let item: ItensDoPedido = {idCliente:idCliente, produto:produto, quantidade:0}
      produtosPedido.push(item)
    });
    return produtosPedido
  }

  listarTodosPedidos(): Observable<Pedidos[]>{
    return this.httpClient.get<Pedidos []>(this.BASE_URL, this.httpOptions);
  }
  
  // Back não remove pedidos
  // remover(id:number): void {
  //     let pedidos: Pedidos[] = this.listarTodosPedidos();
  //     pedidos = pedidos.filter(pedido => pedido.idPedido !== id);
  //     localStorage[LS_CHAVE_PEDIDOS] = JSON.stringify(pedidos);
  //   }
}


