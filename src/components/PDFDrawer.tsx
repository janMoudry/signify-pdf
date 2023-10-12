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
  onSave: () => void
  onReset: () => void
  texts?: {
    reset?: string
    save?: string
    close?: string
  }
  isOpen: boolean
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
  isOpen
}) => {
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
          type='button'
          value={texts?.reset ?? 'Reset'}
          className={styles.signatureButton}
          onClick={onReset}
        />
        <input
          type='button'
          value={texts?.save ?? 'Save'}
          className={styles.signatureButton}
          onClick={onSave}
        />
        <input
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
