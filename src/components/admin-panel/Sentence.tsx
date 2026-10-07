import { Fragment, type ReactNode } from 'react'
import { MARK } from './sentenceSlots'

function Sentence({ template, parts }: { template: string; parts: Record<string, ReactNode> }) {
  return (
    <>
      {template.split(MARK).map((piece, i) => (
        <Fragment key={i}>{i % 2 === 1 ? (parts[piece] ?? piece) : piece}</Fragment>
      ))}
    </>
  )
}

export default Sentence
