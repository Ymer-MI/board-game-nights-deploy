'use client'

import styles from './createClientForm.module.css'
import { useActionState, useRef } from 'react'
import createClientAction, { ICreateClientState } from '@/actions/createClient'
import { Icon } from '@iconify/react'
import InputGroup from '@/components/InputGroup'
import MessageBox, { MESSAGETYPE } from '../MessageBox/MessageBox'

export const CREATE_CLIENT_INIT_STATE: ICreateClientState = {
    strapiErrors: undefined,
    errorMessage: undefined,
    successMessage: undefined,
    zodErrors: undefined,
    formData: { email: '', name: '', passWord: '', passConf: '' }
}

export default function CreateClientForm() {
    const [formState, formAction] = useActionState(createClientAction, CREATE_CLIENT_INIT_STATE), { zodErrors, errorMessage, successMessage } = formState,
    strapiErrors = formState.strapiErrors?.message, ref = useRef<HTMLFormElement>(null), { email, name, passWord, passConf } = formState.formData
    
    return <form id={ styles.createClient } ref={ ref } action={ formAction }>
        <div className={ styles.inputGroups }>
            <InputGroup required id='email' className={ styles.inputGroup } label='Email' type='email' defaultValue={{ value: email }} error={ zodErrors?.email }/>
            <InputGroup required id='name' className={ styles.inputGroup } label='Username' type='text' defaultValue={{ value: name }} error={ zodErrors?.name }/>
            <InputGroup required id='passWord' className={ styles.inputGroup } label='Password' type='password' defaultValue={{ value: passWord }} error={ zodErrors?.passWord }/>
            <InputGroup required id='passConf' className={ styles.inputGroup } label='Passsword Confirmation' type='password' defaultValue={{ value: passConf }} error={ zodErrors?.passConf }/>
        </div>
        <div className={ styles.buttonRow }>
            <button type='reset' onClick={() => { /*form.reset()*/ }}>Reset <Icon icon='system-uicons:reset'/></button>
            <button type='submit'>Create <Icon icon='system-uicons:mail-new' rotate={ 45 }/></button>
        </div>
        { (strapiErrors || errorMessage ) && <MessageBox msg={ `${ strapiErrors?.length && strapiErrors }${ strapiErrors?.length && errorMessage?.length && '\n'}${ errorMessage?.length && errorMessage }` } type={ MESSAGETYPE.ERROR }/> }
        { successMessage && <MessageBox msg={ successMessage } type={ MESSAGETYPE.SUCCESS }/> }
    </form>
}