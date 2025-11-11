import { render, screen, waitFor } from '@testing-library/react'
import Categories from '../../src/components/Categories' // Supondo que o componente exista
import { server, apiGet, json } from '../setup'

describe('Categories integration - carga de lista', () => {
  it('renderiza categorias retornadas pela API', async () => {
    server.use(
      apiGet('/categories', (_req) =>
        json({
          data: [
            { id: 'c1', name: 'Trabalho', createdAt: new Date().toISOString() },
            { id: 'c2', name: 'Estudo', createdAt: new Date().toISOString() },
          ],
        })
      )
    )

    render(<Categories />)

    await waitFor(() => {
      expect(screen.getByText('Trabalho')).toBeInTheDocument()
      expect(screen.getByText('Estudo')).toBeInTheDocument()
    })
  })
})