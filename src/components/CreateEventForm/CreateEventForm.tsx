'use client'

import styles from './createEventForm.module.css'
import { useActionState, useEffect, useRef } from 'react'
import createEventAction, { ICreateEventState } from '@/actions/createEvent'
import { Icon } from '@iconify/react'
import InputGroup from '@/components/InputGroup'
import MessageBox, { MESSAGETYPE } from '@/components/MessageBox/MessageBox'
import { searchByName } from '@/helpers/serverFunctions'
import { IEvent } from '@/models/Event'

export const CREATE_EVENT_INIT_STATE: ICreateEventState = {
    strapiErrors: undefined,
    errorMessage: undefined,
    successMessage: undefined,
    zodErrors: undefined,
    formData: { token: '', location: '', dateTime: new Date(), gameID: 0, description: '', passWord: '', passConf: '', playersMin: undefined, playersMax: undefined },
    newEvent: undefined
}

export default function CreateEventForm({ addEvent }: { addEvent: (event: IEvent) => void }) {
    const [formState, formAction] = useActionState(createEventAction, CREATE_EVENT_INIT_STATE), { zodErrors, errorMessage, successMessage } = formState, strapiErrors = formState?.strapiErrors?.message,
    ref = useRef<HTMLFormElement>(null), { token, location, dateTime, gameID, description, passWord, passConf, playersMin, playersMax } = formState.formData

    useEffect(() => { formState.newEvent && addEvent(formState.newEvent) })
    
    return <form id={ styles.createEvent } ref={ ref } action={ formAction }>
        <div className={ styles.inputGroups }>
            <InputGroup required id='token' className={ styles.inputGroup } label='Host users token' type='text' defaultValue={{ value: token }} error={ zodErrors?.token }/>
            <InputGroup required id='location' className={ styles.inputGroup } label='Location' type='text' defaultValue={{ value: location }} error={ zodErrors?.location }/>
            <InputGroup required id='dateTime' className={ styles.inputGroup } label='Date & time' type='datetime-local' defaultValue={{ value: new Date(dateTime).toISOString().slice(0, 16) }} error={ zodErrors?.dateTime }/>
            <InputGroup kind='search-select' required id='gameID' className={ styles.inputGroup } label='Board game' defaultValue={ gameID } error={ zodErrors?.gameID } search={ async (q) => await searchByName(q) } maxResults={ 25 }/>
            <InputGroup required id='description' className={ styles.inputGroup } label='Description' type='text' defaultValue={{ value: description }} error={ zodErrors?.description }/>
            <InputGroup required id='passWord' className={ styles.inputGroup } label='Password' type='password' defaultValue={{ value: passWord }} error={ zodErrors?.passWord }/>
            <InputGroup required id='passConf' className={ styles.inputGroup } label='Passsword Confirmation' type='password' defaultValue={{ value: passConf }} error={ zodErrors?.passConf }/>
            <InputGroup id='playersMin' className={ styles.inputGroup } label='Minimum players (optional)' type='number' defaultValue={{ value: `${ playersMin }` }} error={ zodErrors?.playersMin }/>
            <InputGroup id='playersMax' className={ styles.inputGroup } label='Maximum players (optional)' type='number' defaultValue={{ value: `${ playersMax }` }} error={ zodErrors?.playersMax }/>
        </div>
        <div className={ styles.buttonRow }>
            <button type='reset' onClick={() => { /*form.reset()*/ }}>Reset <Icon icon='system-uicons:reset'/></button>
            <button type='submit'>Create <Icon icon='system-uicons:mail-new' rotate={ 45 }/></button>
        </div>
        { (strapiErrors || errorMessage ) && <MessageBox msg={ `${ strapiErrors?.length && strapiErrors }${ strapiErrors?.length && errorMessage?.length && '\n'}${ errorMessage?.length && errorMessage }` } type={ MESSAGETYPE.ERROR }/> }
        { successMessage && <MessageBox msg={ successMessage } type={ MESSAGETYPE.SUCCESS }/> }
    </form>
}