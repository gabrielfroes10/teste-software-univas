import { test, expect } from '@playwright/test'
test.describe('Usuários', () => {
  
  test('navega para Usuários e lista itens do backend', async ({ page }) => {
    await page.goto('/') // Dashboard
    await page.getByRole('link', { name: 'Usuários' }).click()
    // Título da seção
    await expect(page.getByRole('heading', { name: /Usuários/i })).toBeVisible()
    // Emails semeados (seed do backend)
    await expect(page.getByText(/john.doe@example.com/i)).toBeVisible()
    await expect(page.getByText(/jane.smith@example.com/i)).toBeVisible()
  });
});
test('cria usuário e aparece na lista', async ({ page }) => {
    await page.goto('/users')
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()  
    const uniqueEmail = `aluno.${Date.now()}@ex.com`
    await page.getByLabel('Nome:').fill('Aluno E2E')
    await page.getByLabel('Email:').fill(uniqueEmail)  
    await page.getByRole('button', { name: /Criar/i }).click()
      // Aguarda recarga da lista
    await expect(page.getByText(uniqueEmail)).toBeVisible()
  });
test('atualiza um usuário existente', async ({ page }) => {
    // 1. Criação prévia
    await page.goto('/users');
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click();
    
    const emailOriginal = `edit.${Date.now()}@ex.com`;
    await page.getByLabel('Nome:').fill('Usuario Original');
    await page.getByLabel('Email:').fill(emailOriginal);
    await page.getByRole('button', { name: /Criar/i }).click();
    await expect(page.getByText(emailOriginal)).toBeVisible();

    await page.getByRole('row', { name: emailOriginal })
              .getByRole('button', { name: /Editar/i }).click(); 

    await page.getByLabel('Nome:').fill('Usuario Editado');
    await page.getByRole('button', { name: /Atualizar|Salvar|Criar/i }).click();

    await expect(page.getByText('Usuario Editado')).toBeVisible();
  });

  test('exclui um usuário', async ({ page }) => {
    await page.goto('/users');
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click();
    
    const emailParaDeletar = `del.${Date.now()}@ex.com`;
    await page.getByLabel('Nome:').fill('Usuario Deletar');
    await page.getByLabel('Email:').fill(emailParaDeletar);
    await page.getByRole('button', { name: /Criar/i }).click();
    await expect(page.getByText(emailParaDeletar)).toBeVisible();

    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    await page.getByRole('row', { name: emailParaDeletar })
              .getByRole('button', { name: /Excluir/i }).click();

    await expect(page.getByText(emailParaDeletar)).not.toBeVisible();
  });

