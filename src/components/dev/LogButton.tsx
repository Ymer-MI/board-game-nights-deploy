'use client'

export const LogButton = ({ str }: { str: string }) => <button onClick={() => { navigator.clipboard.writeText(str) }}>Log DB</button>