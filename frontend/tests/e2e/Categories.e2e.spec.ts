import { test, expect } from '@playwright/test';

test.describe('Categorias', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Categorias/i }).click();
  });

  test('deve listar as categorias', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible();
    await expect(page.locator('table')).toBeVisible(); 
  });

  test('deve criar uma nova categoria', async ({ page }) => {
    // 1. Clica no botão de abrir o modal/formulário
    await page.getByRole('button', { name: 'Adicionar Categoria' }).click();

    const nomeCategoria = `Cat Nova ${Date.now()}`;
    await page.getByRole('textbox').first().fill(nomeCategoria);
    
    await page.getByRole('button', { name: 'Criar', exact: true }).click();

    await expect(page.getByText(nomeCategoria)).toBeVisible();
  });

  test('deve atualizar uma categoria', async ({ page }) => {
    // 1. Criação prévia (Preparação)
    await page.getByRole('button', { name: 'Adicionar Categoria' }).click();
    const nomeOriginal = `Cat Edit ${Date.now()}`;
    await page.getByRole('textbox').first().fill(nomeOriginal);
    await page.getByRole('button', { name: 'Criar', exact: true }).click();

    // 2. Edição
    await page.getByRole('row', { name: nomeOriginal })
              .getByRole('button', { name: /Editar/i }).click();

    const nomeEditado = `${nomeOriginal} - Editado`;
    await page.getByRole('textbox').first().fill(nomeEditado);
    
    await page.getByRole('button', { name: /Salvar|Atualizar/i }).click();

    await expect(page.getByText(nomeEditado)).toBeVisible();
  });

  test('deve excluir uma categoria', async ({ page }) => {
    // 1. Criação prévia (Preparação)
    await page.getByRole('button', { name: 'Adicionar Categoria' }).click();
    const nomeDeletar = `Cat Del ${Date.now()}`;
    await page.getByRole('textbox').first().fill(nomeDeletar);
    await page.getByRole('button', { name: 'Criar', exact: true }).click(); // Correção aqui também
    await expect(page.getByText(nomeDeletar)).toBeVisible();

    // Ouvinte de Dialog (Alertas)
    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    // 2. Exclusão
    await page.getByRole('row', { name: nomeDeletar })
              .getByRole('button', { name: /Excluir/i }).click();

    await expect(page.getByText(nomeDeletar)).not.toBeVisible();
  });

});