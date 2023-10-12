// eslint-disable-next-line no-unused-vars
import React from 'react'

class ControlsFunctions {
  states: States

  constructor(states: States) {
    this.states = states
  }

  handleNextPage = () => {
    if (this.states.currentPage + 1 <= this.states.totalPages) {
      this.states.setCurrentPage((prevState) => prevState + 1)
    }
  }

  handlePrevPage = () => {
    if (this.states.currentPage - 1 > 0) {
      this.states.setCurrentPage((prevState) => prevState - 1)
    }
  }

  handleZoomIn = () => {
    this.states.setScale(
      (prevState) => Math.round((prevState + 0.1) * 100) / 100
    )

    // this.correctScale()
  }

  handleZoomOut = () => {
    if (this.states.scale > 0) {
      this.states.setScale(
        (prevState) => Math.round((prevState - 0.1) * 100) / 100
      )
    }

    // this.correctScale()
  }

  correctScale = (scale: number) => {
    this.states.setPlaceholderStyles((prevState) => ({
      ...prevState,
      width: this.states.isMobile ? `${50 * scale}px` : `${100 * scale}px`,
      height: this.states.isMobile ? `${50 * scale}px` : `${100 * scale}px`
    }))
  }
}

type States = {
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  setScale: React.Dispatch<React.SetStateAction<number>>
  scale: number
  setPlaceholderStyles: React.Dispatch<
    React.SetStateAction<React.CSSProperties>
  >
  isMobile: boolean
}

export default ControlsFunctions
