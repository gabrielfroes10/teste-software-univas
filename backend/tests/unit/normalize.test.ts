// backend/tests/unit/normalize.test.ts
import { describe, it, expect } from 'vitest'
import { normalizeName } from '../../src/utils/normalize'

describe('normalizeName', () => {
  it('converte a string para minúsculas', () => {
    expect(normalizeName('TEST NAME')).toBe('test name')
  })

  it('remove espaços extras no início e no fim (trim)', () => {
    expect(normalizeName('  Test Name  ')).toBe('test name')
  })

  it('substitui múltiplos espaços internos por um único espaço', () => {
    expect(normalizeName('Test   Multiple   Spaces')).toBe('test multiple spaces')
  })

  it('aplica todas as regras de normalização (trim, múltiplos espaços e minúsculas)', () => {
    expect(normalizeName('   My   COMPLICATED   Name   ')).toBe('my complicated name')
  })

  it('retorna uma string vazia se a entrada for vazia', () => {
    expect(normalizeName('')).toBe('')
  })
})