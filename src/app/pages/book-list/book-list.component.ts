import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { catchError, finalize, map, of } from 'rxjs';


@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  // Cida
  searchForm!: FormGroup;
  allBooks: any[] = [];
  filteredBooks: any[] = [];
  error: any;
  loading = false; // Controla o estado de carregamento

  constructor(private readonly fb: FormBuilder,
              private readonly bookService: BookService) {}

  ngOnInit() {
    this.startFields();
    //this.loadBooks();
    this.loadBooksTeste();
    this.verifyFields();
  }

  // ok
  startFields(): void {
    // Inicializa o form com os campos vazios
    this.searchForm = this.fb.group({
      nomeBook: [''],
      nomeRelatorio: [''],
      dataInicio: [null],
      dataFim: [null],
      documentosClientes: this.fb.group({
        possuiContrato: [''],
        nomeDocumento: ['']
      })
    });
  }

  //ok
  // loadBooks(): void {
  //   this.bookService.getAll().subscribe(data => {
  //     this.allBooks = data;
  //     this.filteredBooks = data; // Inicializa com todos os dados (TODO: montar uma paginação com 10 itens 5 por pagina)
  //   });
  // }

  loadBooksTeste(): void {
    this.loading = true;

    // Chama o serviço com um parâmetro dinâmico, por exemplo, 'nomeCampanha' e 'Campanha A'
    this.bookService.getBooksByHeaderTeste('nomeBook', 'Book A').subscribe(
      (data) => {
        this.filteredBooks = data;  // Armazena os livros retornados
        this.loading = false;  // Finaliza o carregamento
      },
      (err) => {
        this.error = 'Erro ao carregar livros: ' + err.message; // Exibe erro
        this.loading = false;
      }
    );
  }

  // ok
  verifyFields(): void {
    // Observa as mudanças no formulário e habilita/desabilita o botão
    this.searchForm.valueChanges.subscribe(() => {
      this.formButtonState();
    });
  }

  // ok, só que a primeira vez que faz o load ta deixando o botao habilitado, verificar depois
  formButtonState(): void {
    // Desabilita o botão se todos os campos estiverem vazios
    const formValues = this.searchForm.value;
    const isFormFilled = Object.values(formValues).some(value => value !== '');
    // Se algum campo for preenchido, habilita o botão; caso contrário, desabilita
    const searchButton = document.getElementById('form-search-button') as HTMLButtonElement;
    if (searchButton) {
      searchButton.disabled = !isFormFilled; // Desabilita o botão caso nenhum campo esteja preenchido
    }
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.loading = true;

      // Construa um objeto de filtros com os valores do formulário
      const formValues = this.searchForm.value;
      const filters: { [key: string]: string } = {};

      Object.keys(formValues).forEach((key) => {
        const value = formValues[key];
        if (value) {
          filters[key] = value;  // Adiciona o filtro apenas se o valor não for vazio
        }
      });
      console.log('formValues:',formValues);
      console.log('filters:',filters);


      // Chama o serviço passando os filtros
      this.bookService.getBooksWithFilters(filters).subscribe(
        (books) => {
          this.filteredBooks = books;
          this.loading = false;
        },
        (error) => {
          console.error('Erro ao buscar livros', error);
          this.loading = false;
        }
      );
    }
  }


  // onSubmit(): void {
  //   if (this.searchForm.valid) {
  //     this.loading = true;

  //     // Coleta os valores do formulário
  //     const formValues = this.searchForm.value;

  //     // Filtra os parâmetros que possuem valores
  //     const filterParams = Object.keys(formValues).reduce((params: any, key) => {
  //       if (formValues[key]) {
  //         params[key] = formValues[key];
  //       }
  //       return params;
  //     }, {});

  //     console.log('onSubmit com filterParams = ', filterParams);
  //     // Chama o método do serviço para buscar livros com os parâmetros
  //     this.bookService.getBooksByHeader(filterParams).pipe(
  //       finalize(() => {
  //         this.loading = false; // Finaliza o carregamento
  //       }),
  //       catchError((error) => {
  //         this.loading = false; // Finaliza o carregamento
  //         console.error('Erro ao buscar livros:', error);
  //         return of([]); // Retorna um array vazio em caso de erro
  //       })
  //     ).subscribe((books) => {
  //       this.filteredBooks = books; // Atualiza os livros filtrados
  //       console.log('Livros filtrados:', this.filteredBooks);
  //     });
  //   }
  // }

  // Método que será chamado quando o formulário for enviado
  // onSubmit(): void {
  //   if (this.searchForm.valid) {
  //     console.log('is Valid? ',this.searchForm.valid);
  //     this.loading = true;

  //     // Constrói os parâmetros com base no valor do formulário
  //     const filterParams = this.buildFilterParams();
  //     console.log('Params = ',filterParams);


  //     // Inicia a requisição com os parâmetros de busca
  //     this.bookService.getBooksByParamsTeste(filterParams).pipe(
  //       // Manipula os dados recebidos da API
  //       map(response => {
  //         console.log('Entrou no onSubmit com response = ',response);

  //         // Aqui você pode manipular ou filtrar a resposta da API antes de atribuí-la
  //         return response.filter((item: any) => this.applyFilters(item));
  //       }),
  //       // Trata erros na requisição
  //       catchError(error => {
  //         console.error('Erro ao buscar livros', error);
  //         this.loading = false;
  //         return of([]); // Retorna um array vazio em caso de erro
  //       }),
  //       // Finaliza o carregamento após a requisição, independentemente de sucesso ou falha
  //       finalize(() => {
  //         this.loading = false;
  //         console.log('Chamou finalize ');

  //       })
  //     ).subscribe((books) => {
  //       // Atualiza os livros filtrados com a resposta
  //       this.filteredBooks = books;
  //       console.log('Livros filtrados recebidos:', this.filteredBooks);
  //     });
  //   }
  // }

  // Constrói os parâmetros com base nos campos de entrada
  private buildFilterParams(): any {
    const params: { [key: string]: string } = {}; // Objeto para armazenar os parâmetros

    // Coleta os valores do formulário
    const formValues = this.searchForm.value;

    if (formValues.nomeCampanha) {
      params['nomeBook'] = formValues.nomeCampanha;
    }

    if (formValues.nomeRelatorio) {
      params['nomeRelatorio'] = formValues.nomeRelatorio;

    if (formValues.nomeDocumento) {
      params['nomeDocumento'] = formValues.nomeDocumento;
    }

    if (formValues.possuiContrato !== '') {
      params['possuiContrato'] = formValues.possuiContrato;
    }

    if (formValues.dataInicio) {
      params['dataInicio'] = formValues.dataInicio;
    }

    if (formValues.dataFim) {
      params['dataFim'] = formValues.dataFim;
    }
    console.log('Entrou buildFilterParams com os parâmetros construídos:', params);

    return params;
  }


  }

  // Aplica os filtros de forma local
  private applyFilters(item: any): boolean {
    const formValues = this.searchForm.value;

    console.log('FormValues = ',formValues.nomeCampanha.value);
    console.log('ItemValues = ',item.nomeCampanha);
    return (
      item.nomeCampanha.toLowerCase().includes(formValues.nomeCampanha.toLowerCase()) ||
      item.nomeRelatorio.toLowerCase().includes(formValues.nomeRelatorio.toLowerCase()) ||
      item.documentosClientes.nomeDocumento.toLowerCase().includes(formValues.nomeDocumento.toLowerCase())
    );
  }

}

 // teste(){
    // this.searchForm.get('nomeBook')?.valueChanges.pipe(
    //     map((value) => value.trim()), // Aplica o trim para remover espaços antes e depois
    //     filter((value) => value.length > 2), // Só envia a requisição se o nome tiver mais de 2 caracteres
    //     debounceTime(500), // Tempo de debounce para esperar após o usuário parar de digitar
    //     distinctUntilChanged(), // Evita chamadas repetidas para o mesmo valor
    //     switchMap((nome) => this.searchReport(nome)),// Chama o método de busca na API
    //     tap((value) => console.log(value)),
    //   )
    //   .subscribe((data: any) => {
    //     this.books = data;
    //   });
   //}

