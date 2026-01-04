import styles from './detailsButton.module.css'
import { Icon } from '@iconify/react'
import { MouseEventHandler } from 'react'

export default function DetailsButton({ className, icon, onClick }: { className?: string | boolean, icon: string, onClick: MouseEventHandler<HTMLButtonElement> }) {
    return <button className={ `${ styles.detailsButton } ${ className }` } onClick={ onClick }>Details <Icon icon={ icon }></Icon></button>
}