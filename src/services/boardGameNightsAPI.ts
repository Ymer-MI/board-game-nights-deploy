import { BaseService } from '@/services/base'
import IStrapiResponse from '@/models/IStrapiResponse'
import { IEvent } from '@/models/Event'
import { IClient } from '@/models/Client'

export interface IInputTypes {
    createClient: { email: string, name: string, token: string },
    getClient: { token: string },
    createEvent: { host: { connect: IClient['documentId'][] }, location: string, dateTime: ReturnType<Date['toISOString']>, gameID: number, description: string, token: string, playersMin?: number, playersMax?:number },
    attendEvent: { attendees: { connect: IClient['documentId'][] } }
}

const KEYS = { CLIENTS: Object.keys({ name: '', token: '' } satisfies Omit<IClient, 'documentId'>), EVENTS: Object.keys({ location: '', dateTime: '', gameID: 0, description: '', token: '', playersMin: 0, playersMax: 0 } satisfies Omit<IEvent, 'documentId'>) }
    
export default class BoardGameNightsAPI {
    private readonly URL = process.env.DB_API_URL
    private readonly TOKEN = process.env.DB_API_TOKEN
    private readonly ENDPOINTS = { PREFIX: '/api', CLIENTS: 'clients', EVENTS: 'events' }
    private readonly POPULATE = { ClIENTS: { populate: { events: { fields: KEYS.EVENTS } } }, EVENTS: { sort: [`dateTime:asc`], populate: { host: { fields: KEYS.CLIENTS }, attendees: { fields: KEYS.CLIENTS } } } }
    
    private service = new BaseService(`${ this.URL }${this.ENDPOINTS.PREFIX}`, this.TOKEN)

    ping = async () => this.URL && this.TOKEN ? await this.service.ping(this.URL, {Authorization: `Bearer ${ this.TOKEN }`}) : { status: -1, statusText: 'Missing env variable!' }

    createEvent = async (data: IInputTypes['createEvent']) => await this.service.post<IStrapiResponse<IEvent>>(this.ENDPOINTS.EVENTS, data)

    getEvents = async () => await this.service.get<IStrapiResponse<IEvent>>(this.ENDPOINTS.EVENTS, this.POPULATE.EVENTS)

    attendEvent = async (id: IEvent['documentId'], data: IInputTypes['attendEvent']) => { return this.service.put<IStrapiResponse<IEvent>>(`${ this.ENDPOINTS.EVENTS }/${ id }`, data, this.POPULATE.EVENTS) }

    createClient = async (data: IInputTypes['createClient']) => await this.service.post<IStrapiResponse<IClient>>(this.ENDPOINTS.CLIENTS, data)
    
    getClients = async () => await this.service.get<IStrapiResponse<IClient>>(this.ENDPOINTS.CLIENTS, this.POPULATE.ClIENTS)

    getClient = async (token: IInputTypes['getClient']['token']) => await this.service.get<IStrapiResponse<IClient>>(this.ENDPOINTS.CLIENTS, { filters: { token: { $eq: token } } })
}