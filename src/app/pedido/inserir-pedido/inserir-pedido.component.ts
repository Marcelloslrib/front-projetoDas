import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from '../../cliente/services/cliente.service';
import { ProdutoService } from 'src/app/produto/services/produto.service';
import { PedidoService } from '../services/pedido.service';
import { Pedidos } from '../../shared/models/pedidos.model';
import { ProdutosPedido } from '../../shared/models/pedidos.model';

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inserir-pedido',
  templateUrl: './inserir-pedido.component.html',
  styleUrls: ['./inserir-pedido.component.css']
})
export class InserirPedidoComponent implements OnInit {

  pedido!: Pedidos
  cliente!: {cpf:string, nome:string, sobreNome:string, id:number}  
  produtosPedido!: any
  message!: string | null
  produtos!: {descricao: string, id: number}[]

  @ViewChild('formNovoPedido') formNovoPedido!: NgForm


  constructor(private pedidoService: PedidoService, private clienteService: ClienteService, private produtoService: ProdutoService,private router: Router) { }

  ngOnInit(): void {
    this.pedido = new Pedidos()
    this.pedido.idPedido = this.gerarInteiroAleatorio()
    this.produtosPedido = this.povoarProdutosPedido()
    this.produtoService.listarTodosRest().subscribe(
      (data) => {
        this.produtos = data
      }
    )
  }
    
  
  
  buscarCpf(cpf: string): void{
    this.clienteService.buscaPorCpf(cpf).subscribe((data) => {
      if(data){
        data.forEach((x) => this.cliente = x)
        this.message = null
      }
      else{
        this.message = 'Cliente não encontrado!'
      }
    })
  }

  
  
  gerarInteiroAleatorio(): number{
    const min = 1
    const max = 100
    const dataAtual = new Date().getTime()
    const inteiroAleatorio = Math.floor(Math.random() * (max - min)) + min
    return dataAtual + inteiroAleatorio
  }

  povoarProdutosPedido(): ProdutosPedido[]{
    const produtos = this.listarProdutos()
    let listaProdutos = []
    for (let produto of produtos){
      let prod = new ProdutosPedido()
      prod.idProdutosPedido = this.gerarInteiroAleatorio()
      prod.idPedido = this.pedido.idPedido
      prod.nomeProduto = produto
      prod.quantidade = 0
      listaProdutos.push(prod)
    }
    return listaProdutos
  }

  listarProdutos(): string[]{
    return ['Vinho', 'Queijo', 'Requeijão', 'Sabão', 'Detergente', 'Pão']
  }

  inserirProdutosPedido(produto: ProdutosPedido){
    if(produto.quantidade! > 0){
      this.pedidoService.inserirProdutosPedido(produto)
    }
  }

  inserirNovoPedido():void{
    for(let produto of this.produtosPedido){
      this.inserirProdutosPedido(produto)
    }

    const quantidadeMaiorQueZero = (produto: any) => produto.quantidade > 0
    if (!this.produtosPedido.some(quantidadeMaiorQueZero)){
      this.message = 'Nenhum produto adicionado ao pedido.'
    }else{
      this.message = null
      //this.pedido.idCliente = this.cliente.id
      this.pedidoService.inserirPedido(this.pedido)
      this.router.navigate([""])
    }
  }
}
