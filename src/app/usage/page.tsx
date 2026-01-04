import styles from './page.module.css'

export default function UsagePage() {
  return (
    <section id={ styles.howToUse }>
      <h2>How to use:</h2>
      <ul>
        <li>
            <h4>If you don't already have a user token:</h4>
            <ol>
                <li>Click on the "Create User" button.</li>
                <li>Fill out the form.</li>
                <li>Click on the "Create" button.</li>
                <li>Upon successfull creation you'll recieve a token. Copy the generated token and save it for later use.</li>
            </ol>
        </li>
        <li>
            <h4>If you want to create an event:</h4>
            <ol>
                <li>Click on the "Create Event" button.</li>
                <li>Fill out the form.</li>
                <li>Click on the "Create" button.</li>
                <li>Upon successfull creation you'll recieve a token. Copy the generated token and save it for later use.</li>
            </ol>
        </li>
        <li>
            <h4>If you want to attend an event:</h4>
            <ol>
                <li>Click on the details button to expand the event.</li>
                <li>Enter the token for the user that should attend the event.</li>
                <li>Click on the "Attend" button to confirm your attendance.</li>
            </ol>
        </li>
      </ul>
    </section>
  )
}