describe('Fluxo Layout', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('Verifica o botão de Cancelar', () => {
    // Verifica o nome do botão Cancelar de 2 formas e aplica o evento de clique em ambas
    cy.get('.mdc-button--outlined > .mdc-button__label').contains('Cancelar').click();
    cy.get('button').contains('Cancelar').click();
  });

  it('Verifica o botão de Continuar', () => {
    // Verifica o nome do botão Continuar de 2 formas e aplica o evento de clique em ambas
    cy.get('.mdc-button--raised > .mdc-button__label').contains('Continuar').click();
    cy.get('button').contains('Continuar').click();
  });
});
