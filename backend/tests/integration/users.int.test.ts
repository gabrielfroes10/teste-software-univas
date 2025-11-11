import { describe, it, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'

import app, { prisma as appPrisma } from '../../src/index' 

import { prisma, resetDb } from './testDb' 

describe('Users API', () => {
  afterAll(async () => {
    
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })

  beforeEach(async () => {
    
    await resetDb()
  })

  

  it('POST /api/users cria usuário válido', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Ana', email: 'ana@ex.com' })

    expect(res.status).toBe(201) 
    expect(res.body.data).toMatchObject({ name: 'Ana', email: 'ana@ex.com' })
    expect(res.body.data.id).toBeDefined()
  })

  it('POST /api/users retorna 400 para dados inválidos (ex: email faltando)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Incompleto' }) 

    expect(res.status).toBe(400) 
  })

  

  it('GET /api/users lista usuários', async () => {
    await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })

    const res = await request(app).get('/api/users')

    expect(res.status).toBe(200) 
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
    expect(res.body.data.some((u: any) => u.email === 'ana@ex.com')).toBe(true)
  })

  it('GET /api/users/:id retorna um usuário específico', async () => {
    
    const user = await prisma.user.create({ data: { name: 'Beto', email: 'beto@ex.com' } })

    const res = await request(app).get(`/api/users/${user.id}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ id: user.id, name: 'Beto' })
  })

  it('GET /api/users/:id retorna 404 para usuário inexistente', async () => {
    const res = await request(app).get(`/api/users/999999`) // 
    expect(res.status).toBe(404) 
  })

  

  it('PUT /api/users/:id atualiza um usuário', async () => {
    
    const user = await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
    const updatedData = { name: 'Ana Silva', email: 'ana.silva@ex.com' }

    
    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .send(updatedData)

    
    expect(res.status).toBe(200) 
    expect(res.body.data).toMatchObject(updatedData)

    
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    expect(dbUser).toMatchObject(updatedData)
  })

  it('PUT /api/users/:id retorna 404 para usuário inexistente', async () => {
    const res = await request(app)
      .put(`/api/users/999999`) 
      .send({ name: 'Fantasma', email: 'fantasma@ex.com' })

    expect(res.status).toBe(404)
  })

  

  it('DELETE /api/users/:id exclui um usuário', async () => {
    
    const user = await prisma.user.create({ data: { name: 'Carlos', email: 'carlos@ex.com' } })

    
    const res = await request(app).delete(`/api/users/${user.id}`)

    
    expect(res.status).toBe(200)
    
    
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    expect(dbUser).toBeNull()
  })

  it('DELETE /api/users/:id retorna 404 para usuário inexistente', async () => {
    const res = await request(app).delete(`/api/users/999999`) 
    expect(res.status).toBe(404)
  })
})