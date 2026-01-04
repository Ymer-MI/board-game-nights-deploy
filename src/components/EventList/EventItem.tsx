import styles from './eventList.module.css'
import buttonStyles from './detailsButton.module.css'
import { IEvent } from '@/models/Event'
import React, { useState } from 'react'
import { IBGGDBRow } from '@/models/BGGDB'
import DetailsButton from './DetailsButton'
import AttendEventForm from '@/components/AttendForm/AttendEventForm'

export default function EventItem({ eventIn, gameName }: { eventIn: IEvent, gameName: IBGGDBRow['name'] }) {
    const [event, setEvent] = useState(eventIn), [isDetailsOpened, setIsDetailsOpened] = useState(false), toggleDetails = () => { setIsDetailsOpened(!isDetailsOpened) }

    return <li id={ event.documentId } className={ styles.event }>
        <h4>{ gameName } @{ event.location }</h4>
        <div className={ styles.infoRow }>
            <div>
                <span className={ styles.bannerDetail }>Time: { new Date(event.dateTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit'}) }</span>
                <span className={ styles.bannerDetail }>Players: { event.playersMin } - { event.playersMax }</span>
                <span className={ styles.bannerDetail }>Host: { event.host?.name }</span>
            </div>
            <div>
                <DetailsButton className={ isDetailsOpened && buttonStyles.hidden } icon='system-uicons:pull-down' onClick={ toggleDetails }/>
            </div>
        </div>
        <div className={ `${ styles.description } ${ !isDetailsOpened && styles.hidden }` }>
            <p>
                { event.description }
            </p>
            <div className={ styles.attendeeRow }>
                <p>Attending: { event.attendees?.map((c, i, a) => <React.Fragment key={ c.documentId }><span>{ c.name }</span>{ i !== a.length - 1 && ', '}</React.Fragment>) }</p>
                <div>
                    <div>
                        <DetailsButton icon='system-uicons:push-up' onClick={ toggleDetails }/>
                    </div>
                    <div className={ styles.attendContainer }>
                        <AttendEventForm event={ event } setEvent={ setEvent }/>
                    </div>
                </div>
            </div>
        </div>
    </li>
}