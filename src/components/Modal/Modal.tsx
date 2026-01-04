import styles from './modal.module.css'
import { Icon } from '@iconify/react'

export interface IModalContent {
    title: HTMLHeadingElement['innerHTML']
    content: React.ReactNode
    cancelButtonText?: HTMLButtonElement['innerHTML']
    successButton?: React.ReactNode
}

export default function Modal({ title, content, onclose, cancelButtonText = 'Cancel', successButton}: IModalContent & { onclose: () => void }) {
    const closeIcon = <Icon icon='system-uicons:close' fontWeight={ 'bold' } height={ '1.5em' }/>

    return <section className={ styles.modal }>
        <div className={ styles.topRow }>
            <h3>{ title }</h3>
            <button onClick={ onclose }> { closeIcon }</button>
        </div>
        <div className={ styles.content }>
            { content }
        </div>
        <div className={ styles.buttonRow }>
            <button className={ `${ styles.actionButton } ${ styles.secondary }` } onClick={ onclose }>{ cancelButtonText } { closeIcon }</button>
            { successButton }
        </div>
    </section>
}