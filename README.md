# Angular Custom Elements (em desenvolvimento)

Projeto Angular para customizar elementos em páginas Web.

### Pre-Requisitos
- Node.js ^18
- Angular CLI 17.3.10

### Tecnologias

- Angular 17.3.10, 
- Angular Material 17.3.10,
- Jasmine Karma,
- Node.js,
- Json Server,


## Como rodar a aplicação Angular:

1. **Clone o repositório:**
  ```bash
    git clone https://github.com/cidaluna/angular-custom-elements.git
  ```

2. **Navegue no diretório principal**
```bash
  cd angular-custom-elements
```

3. **Execute o comando JSON Server para acesso a API Backend provisório**
```bash
  json-server --watch db.json --host localhost --port 3000
```

4. **Abra outro terminal, dentro do diretório do projeto e execute o comando**
  ```bash 
    npm install
  ```

5. **Execute a aplicação Angular**
  ```bash 
    ng serve
  ```

6. **Navegue na URL que o comando anterior apresentou**

Após isso, a aplicação estará disponível em: http://localhost:4200



Tela de botões do Angular Material customizados:

![Customizando botões do Angular Material](./src/assets/custom-buttons-angular-material-Cida.PNG)

Tela com layout reutilizável:

