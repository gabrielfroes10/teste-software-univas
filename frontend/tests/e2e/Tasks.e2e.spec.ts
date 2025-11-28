import { test, expect } from '@playwright/test';

test.describe('Tasks (Tarefas)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Tasks|Tarefas/i }).click();
  });

  test('deve criar uma nova tarefa', async ({ page }) => {
    
    await page.getByRole('button', { name: /Adicionar/i }).click();

    const tituloTask = `Minha Task ${Date.now()}`;

    await page.getByRole('textbox').first().fill(tituloTask);

    await page.locator('.form-group')
              .filter({ hasText: 'Usuário:' })
              .getByRole('combobox')
              .selectOption({ index: 1 });

    await page.locator('.form-group')
              .filter({ hasText: 'Categoria:' })
              .getByRole('combobox')
              .selectOption({ index: 1 });

    await page.getByRole('button', { name: 'Criar', exact: true }).click();

    await expect(page.getByText(tituloTask)).toBeVisible();
  });

  test('deve excluir uma tarefa', async ({ page }) => {
    
    await page.getByRole('button', { name: /Adicionar/i }).click();
    
    const tituloDeletar = `Task Delete ${Date.now()}`;
    await page.getByRole('textbox').first().fill(tituloDeletar);
    
    await page.locator('.form-group').filter({ hasText: 'Usuário:' }).getByRole('combobox').selectOption({ index: 1 });
    await page.locator('.form-group').filter({ hasText: 'Categoria:' }).getByRole('combobox').selectOption({ index: 1 });
    
    await page.getByRole('button', { name: 'Criar', exact: true }).click();
    
    await expect(page.getByText(tituloDeletar)).toBeVisible();


    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    await page.getByRole('row', { name: tituloDeletar })
              .getByRole('button', { name: /Excluir/i }).click();

    await expect(page.getByText(tituloDeletar)).not.toBeVisible();
  });

});