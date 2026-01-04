import z from 'zod'

export type ZodFieldErrors<T extends z.ZodRawShape> = Partial<Record<keyof T, string[]>>