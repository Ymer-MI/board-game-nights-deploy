'use server'

import JWTHelper from '@/helpers/JWTHelper'
import { getBGGDB } from '@/lib/getBGGDB'
import { IBGGDBRow } from '@/models/BGGDB'
import { IEvent } from '@/models/Event'
import BoardGameNightsAPI, { IInputTypes } from '@/services/boardGameNightsAPI'

const DB = await getBGGDB(), JWT = new JWTHelper(), API = new BoardGameNightsAPI()

export const getGameByID = async (id: IBGGDBRow['id']) => DB.findByID(id)?.getName()

export const searchByName = async (gameName: string) => DB.searchByName(gameName).map(e => ({ label: e.getName(), value: e.getID() }))

export const getToken = async (str: string) => await JWT.getToken(str)

export const verifyToken = async (str: string, token: string) => await JWT.verifyToken(str, token)

export const createEvent = async (data: IInputTypes['createEvent']) => await API.createEvent(data)

export const getEvents = async () => await API.getEvents()

export const attendEvent = async (id: IEvent['documentId'], data: IInputTypes['attendEvent']) => await API.attendEvent(id, data)

export const createClient = async (data: IInputTypes['createClient']) => await API.createClient(data)

export const getClient = async (token: IInputTypes['getClient']['token']) => await API.getClient(token)