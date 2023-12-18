import React from 'react'
import styles from '../styles.module.css'

interface PDFDrawerProps {
  signatureRef: React.RefObject<HTMLCanvasElement>
  handleSignDownCapture: () => void
  handleSignDownCaptureStop: () => void
  handleSignDown: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void
  handleSignDownMobile: (e: React.TouchEvent<HTMLCanvasElement>) => void
  isSigningDown: boolean
  onClose: () => void
  onSave: (width?: number) => void
  onReset: () => void
  texts?: {
    reset?: string
    save?: string
    close?: string
  }
  isOpen: boolean
  code?: string
  buttonStyles?: React.CSSProperties
}

const PDFDrawer: React.FC<PDFDrawerProps> = ({
  signatureRef,
  handleSignDownCapture,
  handleSignDownCaptureStop,
  handleSignDown,
  handleSignDownMobile,
  isSigningDown,
  onClose,
  onSave,
  onReset,
  texts = {},
  isOpen,
  code,
  buttonStyles
}) => {
  const drawCode = (codeText: string) => {
    try {
      const canvas = signatureRef.current
      if (canvas && codeText) {
        const context = canvas.getContext('2d')

        canvas.width = codeText.length * 4
        canvas.height = 30

        if (context) {
          context.font = '6px monospace' // Example font
          context.fillStyle = 'black' // Text color

          context.fillText(codeText, 0, 12, 5000)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  // useEffect hook to watch for changes in 'code' and draw it on the canvas
  React.useEffect(() => {
    if (code && signatureRef) {
      drawCode(code)
    }
  }, [])

  return (
    <div
      className={styles.signatureContainer}
      style={{
        display: isOpen ? 'flex' : 'none'
      }}
    >
      <canvas
        className={styles.signatureCanvas}
        id='signature'
        onMouseDown={handleSignDownCapture}
        onMouseUp={handleSignDownCaptureStop}
        onMouseMove={isSigningDown ? handleSignDown : () => {}}
        onTouchStart={handleSignDownCapture}
        onTouchEnd={handleSignDownCaptureStop}
        onTouchMove={isSigningDown ? handleSignDownMobile : () => {}}
        style={{
          zIndex: 100
        }}
        width='100%'
        height='100%'
        ref={signatureRef}
      />
      <div className={styles.signatureButtonsContainer}>
        <input
          style={buttonStyles ?? {}}
          type='button'
          value={texts?.reset ?? 'Reset'}
          className={styles.signatureButton}
          onClick={onReset}
        />
        <input
          style={buttonStyles ?? {}}
          type='button'
          value={texts?.save ?? 'Save'}
          className={styles.signatureButton}
          onClick={() => onSave(code ? code.length * 4 : undefined)}
        />
        <input
          style={buttonStyles ?? {}}
          type='button'
          value={texts?.close ?? 'Close'}
          className={styles.signatureButton}
          onClick={onClose}
        />
      </div>
    </div>
  )
}

export default PDFDrawer
