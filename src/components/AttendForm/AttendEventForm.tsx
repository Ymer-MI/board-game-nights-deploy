import styles from './attendEventForm.module.css'
import { useActionState, useEffect, useRef } from 'react'
import attendEventAction, { IAttendEventState } from '@/actions/attendEvent'
import InputGroup from '@/components/InputGroup'
import { Icon } from '@iconify/react'
import { IEvent } from '@/models/Event'
import MessageBox, { MESSAGETYPE } from '../MessageBox/MessageBox'

export const ATTEND_EVENT_INIT_STATE: IAttendEventState = {
    strapiErrors: undefined,
    errorMessage: undefined,
    successMessage: undefined,
    zodErrors: undefined,
    formData: {
        event: undefined,
        token: ''
    },
    updatedEvent: undefined
} satisfies IAttendEventState

export default function AttendEventForm({ event, setEvent }: { event: IEvent, setEvent: React.Dispatch<React.SetStateAction<IEvent>> }) {
    const [formState, formAction] = useActionState(attendEventAction, ATTEND_EVENT_INIT_STATE), { zodErrors, errorMessage, successMessage, updatedEvent } = formState,
    strapiErrors = formState.strapiErrors?.message, ref = useRef<HTMLFormElement>(null), { token } = formState.formData

    useEffect(() => {
        if (updatedEvent) setEvent(updatedEvent)
    })

    return <div className={ styles.formContainer }>
        { (strapiErrors || errorMessage ) && <MessageBox msg={ strapiErrors && errorMessage ? `${ strapiErrors }\n${ errorMessage }` : strapiErrors ? strapiErrors : errorMessage ? errorMessage : '' } type={ MESSAGETYPE.ERROR }/> }
        { successMessage && <MessageBox msg={ successMessage } type={ MESSAGETYPE.SUCCESS }/> }
        <form className={ styles.attendEvent } ref={ ref } action={ formAction }>
            <div className={ styles.inputGroups }>
                <input hidden readOnly name='event' defaultValue={ JSON.stringify(event) } />
                <InputGroup required id='token' className={ styles.inputGroup } label='Attendee user token' type='text' defaultValue={{ value: token }} error={ zodErrors?.token }/>
            </div>
            <div className={ styles.buttonRow }>
                <button type='reset' onClick={() => { /*form.reset()*/ }}>Reset <Icon icon='system-uicons:reset'/></button>
                <button type='submit'>Attend <Icon icon='system-uicons:write'/></button>
            </div>
        </form>
    </div>
}