import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None, // para aplicar a borda customizada no outlined
})
export class AppComponent {

  // Exemplo de interceptor cair no status 404 not found
  // http = inject(HttpClient);

  // constructor(){
  //   this.http.get('https://jsonplaceholder.typicode.com/usershyghtdgdhjsakjdsndjfkfkfkefmfmef')
  //   .subscribe((res) => {
  //     console.log(res);
  //   })
  // }

  }
