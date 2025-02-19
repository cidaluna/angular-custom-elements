import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  searchForm!: FormGroup;
  books: any[] = [];
  baseUrl = 'http://localhost:3000/books'; // URL do JSON Server

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient) {}

  ngOnInit() {
    // Criando o FormGroup com os campos necessários
    this.searchForm = this.fb.group({
      id: [''],
      report: [''],
      status: [''],
      startDate: [''],
      endDate: [''],
      exibDate: [''],
    });

    this.searchForm.get('report')?.valueChanges.pipe(
        map((value) => value.trim()), // Aplica o trim para remover espaços antes e depois
        filter((value) => value.length > 2), // Só envia a requisição se o nome tiver mais de 2 caracteres
        debounceTime(500), // Tempo de debounce para esperar após o usuário parar de digitar
        distinctUntilChanged(), // Evita chamadas repetidas para o mesmo valor
        switchMap((nome) => this.searchReport(nome)),// Chama o método de busca na API
        tap((value) => console.log(value)),
      )
      .subscribe((data: any) => {
        this.books = data;
      });
  }

  // Método para buscar os livros na API
  searchReport(nome: string): Observable<any> {
    console.log('searchReport: ', nome);
    const url = `${this.baseUrl}?report=${nome}`;
    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Erro ao buscar livros:', error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  // Função chamada ao submeter o formulário
  onSubmit(): void {
    const nome = this.searchForm.get('report')?.value.trim();
    if (nome && nome.length > 2) {
      console.log('onSubmit: ', nome);
      this.searchReport(nome).subscribe((data: any) => {
        this.books = data;
      });
    } else {
      this.books = []; // Limpa a tabela se o nome não for válido
    }
  }

  // Função que verifica se pelo menos um campo foi preenchido
  isFormValid(): boolean {
    console.log('isFormValid?');

    return this.searchForm.valid;
  }
}
