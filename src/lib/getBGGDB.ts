'use server'

import { cache } from 'react'
import BGGDB, { type IBGGDBRow } from '@/models/BGGDB'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

export const getBGGDB = cache(async () => new BGGDB(JSON.parse(await readFile(join(process.cwd(), 'public/json/BGG-BoardGame-List-Filtered.min.json'), 'utf-8')) as IBGGDBRow[]))