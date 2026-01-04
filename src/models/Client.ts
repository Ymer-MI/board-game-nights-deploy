import Event, { IEvent } from '@/models/Event'

export interface IClient {
    documentId: string
    name: string
    token: string
    events?: IEvent[]
}

export default class Client {
    private documentId: string
    private name: string
    private token: string
    private events?: Event[]

    constructor({ documentId, name, token, events }: IClient) {
        this.documentId = documentId
        this.name = name
        this.token = token
        this.events = events?.map(e => new Event(e))
    }

    getDocumentId = () => this.documentId
    getName = () => this.name
    getToken = () => this.token
    getEvents = () => this.events
}