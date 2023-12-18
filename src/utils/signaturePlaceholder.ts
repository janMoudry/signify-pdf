// eslint-disable-next-line no-unused-vars
import React from 'react'

class SignaturesPlaceholder {
  states: States
  isMobile: boolean
  wasPlaceholderMoved: boolean
  setPlaceholderMoved: React.Dispatch<React.SetStateAction<boolean>>

  constructor(
    states: States,
    isMobile: boolean,
    setPlaceholderMoved: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    this.states = states
    this.isMobile = isMobile
    this.setPlaceholderMoved = setPlaceholderMoved
  }

  handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    return e
  }

  handleDrop = (e: React.DragEvent<HTMLDivElement> | MouseEvent) => {
    const { pageX, pageY } = e

    if (!this.states.styles) return

    const offsetX =
      window.innerWidth / 2 -
      this.states.fileDimensions.width / 2 / this.states.scale
    const offsetY =
      document.documentElement.scrollHeight / 2 -
      this.states.fileDimensions.height / 2 / this.states.scale

    let x = pageX - offsetX - this.states.widthOfSignatures / 2
    let y = pageY - offsetY - this.states.heightOfSignatures / 2

    if (x < 0) x = 0
    if (y < 0) y = 0
    if (
      x >
      this.states.fileDimensions.width / this.states.scale -
        this.states.widthOfSignatures
    )
      x =
        this.states.fileDimensions.width / this.states.scale -
        this.states.widthOfSignatures

    if (
      y >
      this.states.fileDimensions.height / this.states.scale -
        this.states.heightOfSignatures
    )
      y =
        this.states.fileDimensions.height / this.states.scale -
        this.states.heightOfSignatures

    this.states.setStyles((prevState) => ({
      ...prevState,
      top: `${y}px`,
      left: `${x}px`
    }))

    this.setPlaceholderMoved(true)
  }
}

type States = {
  fileDimensions: {
    width: number
    height: number
  }
  scale: number
  widthOfSignatures: number
  heightOfSignatures: number
  setStyles: React.Dispatch<
    React.SetStateAction<{
      top: string
      left: string
      width: string
      height: string
    }>
  >
  styles: {
    top: string
    left: string
    width: string
    height: string
  }
}

export default SignaturesPlaceholder
