import styles from './messageBox.module.css'

export enum MESSAGETYPE {
    NORMAL = 'normal',
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error'
}

export default function MessageBox({ msg, type }: { msg: string | string[], type: MESSAGETYPE }) {
    return <p className={ `${ styles.msgBox } ${ type }` }>{ msg }</p>
}