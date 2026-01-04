'use client'

import styles from './eventList.module.css'
import { IBGGDBRow } from '@/models/BGGDB'
import Event, { IEvent } from '@/models/Event'
import { useEffect, useState } from 'react'
import { getGameByID } from '@/helpers/serverFunctions'
import EventItem from '@/components/EventList/EventItem'

interface IGameList extends Omit<IBGGDBRow, 'yearPublished' | 'isExpansion'> {}

export default function EventList({ events }: { events: IEvent[] }) {
    const [gameList, setGameList] = useState<IGameList[]>([])

    useEffect(() => {
        !gameList.length && events.length && Promise.all(events.map(async e => getGameByID(e.gameID).then(n => ({ id: e.gameID, name: n ?? '' } satisfies IGameList)))).then(setGameList)
    })

    return <section>
        <h2>Events:</h2>
        <ul className={ styles.dateList }>
            { Object.entries(Event.groupByDate(events)).map(([ date, events ]) => <li className={ styles.date } key={ date }>
                <h3>{ date.slice(2).split('-').reverse().join('-').replace(/-/, '/') }</h3>
                <ul className={ styles.eventList }>
                    { events.map(e => <EventItem key={ e.documentId } eventIn={ e } gameName={ gameList.find(g => g.id === e.gameID)?.name ?? 'Game name not found' }/>) }
                </ul>
            </li> ) }
        </ul>
    </section>
}