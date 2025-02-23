import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
// Importar localidade para pt-BR
import localePt from '@angular/common/locales/pt';
import { Book } from '../../models/book';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';
registerLocaleData(localePt);


@Component({
  selector: 'app-book-list',
  standalone: true,
  providers: [provideNativeDateAdapter(),
      { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    ],
    imports: [CommonModule, ReactiveFormsModule, MatPaginator, MatSort,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatTableModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit, AfterViewInit {
  // Testes By Cida
  searchForm!: FormGroup;
  dataSourceBooks = new MatTableDataSource<Book>();
  allBooks!: Book[];
  filteredBooks!: Book[];
  error: any;
  loading = false; // Controla o estado de carregamento
  minDateRule: Date;
  maxDateRule: Date;

  displayedColumns = ['nomeBook', 'nomeRelatorio', 'nomeDocumento', 'possuiContrato', 'dataInicio', 'dataFim', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  page: number = 1; // pagina atual
  limit: number = 10; // limite de itens por página
  total: number | undefined = 1; // numero total de registros


  constructor(private readonly _fb: FormBuilder,
              private readonly _bookService: BookService,
  ) {
    // Set the minimum to January 1st 5 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDateRule = new Date(currentYear - 5, 0, 1);
    this.maxDateRule = new Date(currentYear + 1, 11, 31);
  }

  ngAfterViewInit() {
    this.dataSourceBooks.paginator = this.paginator;
    this.dataSourceBooks.sort = this.sort;
  }

  ngOnInit() {
    this.startFields();
    this.startBooks();
  }

  // ok
  startFields(): void {
    // Inicializa o form com os campos vazios
    this.searchForm = this._fb.group({
      nomeBook: [''],
      nomeRelatorio: [''],
      dataInicio: [null],
      dataFim: [null],
      documentosClientes: this._fb.group({
        possuiContrato: [''],
        nomeDocumento: ['']
      })
    });
  }


  startBooks(page: number = 1) {
    this._bookService.getBooks(page, this.limit).subscribe({
      next: (res: HttpResponse<Book[]>) => {  // Garantir que a resposta é um array de Books
        const books = res.body || []; // A resposta real vem no body
        this.allBooks = books;  // Armazenar todos os livros
        this.filteredBooks = books;  // Inicializar os dados filtrados com todos os livros
        this.dataSourceBooks = new MatTableDataSource<Book>(this.filteredBooks);  // Configurar o dataSource
        //this.updateDataSource();
        // O total de registros é obtido através do cabeçalho 'X-Total-Count' do JSON Server
        // Verificar se os cabeçalhos existem antes de tentar acessá-los
        // const totalCountHeader = res.headers.get('X-Total-Count');
        // if (totalCountHeader) {
        //   this.total = parseInt(totalCountHeader, 10);
        // }

        this.total = res.body?.length;
        console.log('All Books: ',this.allBooks);
        console.log('Filtered Books: ',this.filteredBooks);
        console.log('Total records: ',this.total);
        console.log('Response: ',res);
        console.log('Headers: ', res.headers);
      },
      error: (err) =>{
        console.log(err);
      },
      complete: () => {
      }
    });
  }

  // Método para ser chamado quando o usuário mudar de página
  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.startBooks(this.page + 1); // Lembre-se que a página começa em 0
  }

  //ok
  // loadBooks(): void {
  //   this._bookService.getAll().subscribe(data => {
  //     this.allBooks = data;
  //     this.filteredBooks = data; // Inicializa com todos os dados (TODO: montar uma paginação com 10 itens 5 por pagina)
  //   });
  // }



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
    console.log('Clicou');
    //this.testStartEndDate(); // teste Cida

    if (this.searchForm.valid) {
      this.loading = true;

      // Construa um objeto de filtros com os valores do formulário
      const formValues = this.searchForm.value;
      const filters: { [key: string]: string } = {};


      Object.keys(formValues).forEach((key) => {
        const value = formValues[key];
        if (value) {
            // Formatar as datas se estiverem presentes
            if (formValues.dataInicio) {
              const dataInicio = formValues.dataInicio;
              const formattedDataInicio = moment.utc(dataInicio).local().format("DD/MM/YYYY");
              filters['dataInicio'] = formattedDataInicio;
            }

            if (formValues.dataFim) {
              const dataFim = formValues.dataFim;
              const formattedDataFim = moment.utc(dataFim).local().format("DD/MM/YYYY");
              filters['dataFim'] = formattedDataFim;
            }
          filters[key] = value;  // Adiciona o filtro apenas se o valor não for vazio
        }
      });
      console.log('formValues:',formValues);
      console.log('filters:',filters);

      // Chama o serviço passando os filtros
      this._bookService.getBooksWithFilters(filters).subscribe(
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


  // Testes By Cida


  testStartEndDate(){
      // Se existir dataInicio recupera e formata
      if(this.searchForm.value.dataInicio){
        const dataInicio = this.searchForm.value.dataInicio;
        if(dataInicio){
          const testFormttedDate: moment.Moment = moment.utc(dataInicio).local();
          const formatted = testFormttedDate.format("DD-MM-YYYY");
          console.log(formatted);
        }
      }
      // Se existir dataFim recupera e formata
      if(this.searchForm.value.dataFim){
        const dataFim = this.searchForm.value.dataFim;
        if(dataFim){
          const testFormttedDate: moment.Moment = moment.utc(dataFim).local();
          const formatted = testFormttedDate.format("DD-MM-YYYY");
          console.log(formatted);
        }
      }
    }


  // Constrói os parâmetros com base nos campos de entrada
  private buildFilterParams(): any {
    const params: { [key: string]: string } = {}; // Objeto para armazenar os parâmetros

    // Coleta os valores do formulário
    const formValues = this.searchForm.value;

    if (formValues.nomeBook) {
      params['nomeBook'] = formValues.nomeBook;
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

    console.log('FormValues = ',formValues.nomeBook.value);
    console.log('ItemValues = ',item.nomeBook);
    return (
      item.nomeBook.toLowerCase().includes(formValues.nomeBook.toLowerCase()) ||
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

