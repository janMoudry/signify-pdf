/* eslint-disable no-unused-vars */
import React from 'react'
import ValidationFunctionClass from './validationFunctions'

class SignaturesControls {
  states: states
  isSigningDown: boolean
  validationFunctions: ValidationFunctionClass
  numberOfPoints: number
  vectors: {
    x: number
    y: number
  }[]

  canvas: React.RefObject<HTMLCanvasElement>

  constructor(
    states: states,
    ref: React.RefObject<HTMLCanvasElement>
    // validationFunctionClass: ValidationFunctionClass
  ) {
    this.states = states
    this.canvas = ref
    this.isSigningDown = false
    this.vectors = []
    // this.validationFunctions = validationFunctionClass
    this.numberOfPoints = 0
  }

  handleDraw({ x, y }: { x: number; y: number }) {
    const lines = 2
    // console.log('handleDraw', this.numberOfPoints)
    this.numberOfPoints = this.numberOfPoints + 1

    if (this.vectors.length <= lines) {
      this.vectors.push({ x, y })

      return
    }

    const firstVector = this.vectors[0]
    const lastVector = this.vectors[this.vectors.length - 1]

    this.vectors = []

    for (let i = 0; i < 20; i++) {
      const x = firstVector.x + ((lastVector.x - firstVector.x) / 20) * i
      const y = firstVector.y + ((lastVector.y - firstVector.y) / 20) * i

      this.vectors.push({ x, y })
    }

    this.handleDrawIntoCanvas()
  }

  handleDrawIntoCanvas = () => {
    const canvas = this.canvas.current as HTMLCanvasElement
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    context.strokeStyle = 'black'
    context.lineWidth = 0.5

    context.beginPath()

    const widthCoefficient = this.states.isMobile ? 0.75 : 0.25

    for (let i = 1; i < this.vectors.length; i++) {
      const absoluteWidthOfSignatures = window.innerWidth * widthCoefficient
      const absoluteHeightOfSignatures = window.innerWidth * widthCoefficient

      const xOffset = window.innerWidth / 2 - absoluteWidthOfSignatures / 2
      const yOffset = window.innerHeight / 2 - absoluteHeightOfSignatures / 2

      const x =
        ((this.vectors[i].x - xOffset) / absoluteWidthOfSignatures) * 100
      const y =
        ((this.vectors[i].y - yOffset) / absoluteHeightOfSignatures) * 100

      context.lineTo(x, y)
      context.moveTo(x, y)
    }
    context.stroke()

    const lastVector = this.vectors[this.vectors.length - 1]
    this.vectors = [lastVector]
  }

  handleSignDownCapture = () => {
    if (this.states.isMobile) {
      document.body.style.overflow = 'hidden'
      document.addEventListener(
        'touchmove',
        function (e) {
          e.preventDefault()
        },
        { passive: false }
      )
    }

    this.states.setIsSigningDown(true)
  }

  handleSignDownCaptureStop = () => {
    if (this.states.isMobile) {
      document.body.style.overflow = 'auto'

      document.removeEventListener('touchmove', function (e) {
        e.preventDefault()
      })
    }

    this.states.setIsSigningDown(false)
  }

  handleMobileSignDownCapture = (e: React.TouchEvent<HTMLCanvasElement>) => {
    this.handleDraw({ x: e.touches[0].pageX, y: e.touches[0].pageY })
  }

  handleWebSignDownCapture = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    this.handleDraw({ x: e.pageX, y: e.pageY })
  }

  clearCanvas = () => {
    const canvas = this.canvas.current as HTMLCanvasElement
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  handleClose = () => {
    this.clearCanvas()
    this.states.setOpen(false)

    if (this.states.isMobile) {
      document.body.style.overflow = 'scroll'

      document.removeEventListener('touchmove', function (e) {
        e.preventDefault()
      })
    }
  }

  handleSave = (widthC?: number) => {
    this.states.setOpen(false)
    this.states.setSigned(true)

    if (this.canvas.current) {
      const canvas = this.states.mainCanvasRef.current as HTMLCanvasElement
      const context = canvas.getContext('2d') as CanvasRenderingContext2D
      const signature = this.canvas.current

      const signaturePosition = {
        x: parseInt(
          this.states.styles.left?.toString().replace('px', '') ?? '0'
        ),
        y: parseInt(this.states.styles.top?.toString().replace('px', '') ?? '0')
      }

      const width = !widthC ? (this.states.isMobile ? 50 : 100) : widthC
      const height = widthC ? 30 : this.states.isMobile ? 50 : 100

      context.drawImage(
        signature,
        signaturePosition.x,
        signaturePosition.y,
        width,
        height
      )
    }
  }
}

type states = {
  isSigningDown: boolean
  setIsSigningDown: React.Dispatch<React.SetStateAction<boolean>>
  scale: number
  isMobile: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  mainCanvasRef: React.RefObject<HTMLCanvasElement>
  styles: {
    top: string
    left: string
  }
  setSigned: React.Dispatch<React.SetStateAction<boolean>>
}

export default SignaturesControls
