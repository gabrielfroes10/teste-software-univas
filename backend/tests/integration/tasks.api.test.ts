import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb } from './testDb'

describe('Tasks API', () => {
  let userId: string
  let categoryId: string

  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })

  beforeEach(async () => {
    await resetDb()
    const user = await prisma.user.create({ data: { name: 'João', email: 'joao@ex.com' } })
    userId = user.id
    const category = await prisma.category.create({ data: { name: 'Trabalho' } })
    categoryId = category.id
  })

  it('POST /api/tasks cria tarefa válida', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ 
        title: 'Tarefa de teste', 
        description: 'Descrição', 
        userId, 
        categoryId,
        priority: 'MEDIUM',
        status: 'PENDING'
      })
    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({ title: 'Tarefa de teste', description: 'Descrição' })
  })

  it('GET /api/tasks lista tarefas', async () => {
    await prisma.task.create({ 
      data: { 
        title: 'Tarefa 1', 
        description: 'Desc', 
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } }
      } 
    })
    const res = await request(app).get('/api/tasks')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('PUT /api/tasks/:id atualiza tarefa válida', async () => {
    const task = await prisma.task.create({ 
      data: { 
        title: 'Tarefa', 
        description: 'Desc', 
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } }
      } 
    })
    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: 'Tarefa atualizada', description: 'Nova desc' })
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ title: 'Tarefa atualizada', description: 'Nova desc' })
  })

  it('PUT /api/tasks/:id retorna erro para tarefa não encontrada', async () => {
    const res = await request(app)
      .put('/api/tasks/999')
      .send({ title: 'Teste' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Task not found')
  })

  it('DELETE /api/tasks/:id exclui tarefa válida', async () => {
    const task = await prisma.task.create({ 
      data: { 
        title: 'Tarefa', 
        description: 'Desc', 
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } }
      } 
    })
    const res = await request(app).delete(`/api/tasks/${task.id}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Task deleted successfully')
    const deletedTask = await prisma.task.findUnique({ where: { id: task.id } })
    expect(deletedTask).toBeNull()
  })

  it('DELETE /api/tasks/:id retorna erro para tarefa não encontrada', async () => {
    const res = await request(app).delete('/api/tasks/999')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Task not found')
  })
})