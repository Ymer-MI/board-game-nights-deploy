'use client'

import styles from './page.module.css'
import { IEvent } from '@/models/Event'
import { getEvents } from '@/helpers/serverFunctions'
import { useEffect, useState } from 'react'
import { LogButton } from '@/components/dev/LogButton'
import ServerStatus from '@/components/dev/ServerStatus'
import GamesList from '@/components/dev/GamesList'
import EventList from '../components/EventList/EventList'
import CreateClientForm from '@/components/CreateClientForm/CreateClientForm'
import CreateEventForm from '@/components/CreateEventForm/CreateEventForm'
import Modal, { IModalContent } from '@/components/Modal/Modal'
import { Icon } from '@iconify/react'
import UsagePage from './usage/page'

interface IModalState {
    isOpen: boolean
    content: IModalContent | null
}

const DEFAULT_MODAL_STATE = {
    isOpen: false,
    content: null
} as IModalState

export default function Home() {
    const [events, setEvents] = useState<IEvent[]>([]), [modalState, setModalState] = useState<IModalState>(DEFAULT_MODAL_STATE), modal = {
        close: () => { setModalState(DEFAULT_MODAL_STATE) },
        open: (content: IModalContent) => { setModalState({ isOpen: true, content: Object.assign(content, { title: ['event', 'client'].includes(content.title.toLowerCase()) ? `Create ${ content.title }` : content.title, cancelButtonText: content.cancelButtonText ?? 'Close' }) }) }
    }, addEvent = (event: IEvent) => { setEvents([...events, event]) }, createIcon = <Icon icon='system-uicons:mail-new' rotate={ 45 }/>

    useEffect(() => { !events.length && (async () => { setEvents((await getEvents()).data as IEvent[]) })() })

    return <section>
        <h1>Board Game Nights</h1>
        {/* <ServerStatus status={ await (async () => { const r = await DB.Strapi.ping(); r.status.toString().match(/^-1$/) && console.error('Error pinging server:', r.statusText); return r.status.toString().startsWith('2') && r.statusText.match(/^OK$/) ? 'Online' : 'Offline' })() }/> */}
        {/* <GamesList BGGDB={ BGGDB } itemsToDisplay={ 5 }/> */}
        {/* <LogButton str={JSON.stringify(BGGDB.getDB())}/> */}
        <div className={ styles.buttonRow }>
            <button onClick={() => modal.open({ title: 'User', content: <CreateClientForm /> })}>Create User { createIcon }</button>
            <button onClick={() => modal.open({ title: 'Event', content: <CreateEventForm addEvent={ addEvent } /> })}>Create Event { createIcon }</button>
            <button onClick={() => modal.open({ title: 'How To Use:', content: <UsagePage /> })}>How To Use <Icon icon='system-uicons:question-circle'></Icon></button>
        </div>
        <EventList events={ events }/>
        { modalState.isOpen && modalState.content && <Modal title={ modalState.content.title } content={ modalState.content.content } cancelButtonText={ modalState.content.cancelButtonText } successButton={ modalState.content.successButton } onclose={ modal.close } /> }
    </section>
}