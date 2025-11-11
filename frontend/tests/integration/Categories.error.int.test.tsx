import { render, screen, waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw' 
import Categories from '../../src/components/Categories' 
import { server, apiGet } from '../setup'

describe('Categories integrations - falhas da API', () => {
  it('mostra mensagem de erro quando a API falha', async () => {
    server.use(
      apiGet('/categories', () => HttpResponse.error())
    )

    render(<Categories />)

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar categorias/i)
      ).toBeInTheDocument()
    })
  })
})