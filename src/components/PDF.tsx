/* eslint-disable no-unused-vars */
import React from 'react'
import CloseIcon from './CloseIcon'
import styles from '../styles.module.css'
import PDFViewer from './PDFViewer'
import * as T from '../models/controls'
import ControlsFunctions from '../utils/controlFunctions'
import PDFInfo from './PDFInfo'
import PDFDrawer from './PDFDrawer'
import SignaturesControls from '../utils/signaturesControls'
import PDFDrawerPlaceholder from './PDFDrawerPlaceholder'
import SignaturesPlaceholder from '../utils/signaturePlaceholder'
import handleDownload from '../utils/download'
import jsPDF from 'jspdf'

interface PDFProps {
  open: boolean
  onClose: () => void
  customStyles?: {
    container?: React.CSSProperties
    button?: React.CSSProperties
  }
  showControls?: T.Controls
  file: File
  signWithCode?: boolean
  code?: string
  getCurrentPosition?: (pos: { x: number; y: number }) => unknown
  getFileDimmeension?: (dimension: {
    w: number
    h: number
    scale: number
  }) => void
  texts?: {
    signDown?: string
    addSignature?: string
    reset?: string
    save?: string
    close?: string
    download?: string
    placeHolderTooltip?: string
  }
  customPdfDownloadFunction?: (file: jsPDF) => void
}

const PDF: React.FC<PDFProps> = ({
  open,
  onClose,
  customStyles = {},
  file,
  texts,
  code,
  // getCurrentPosition,
  getFileDimmeension,
  customPdfDownloadFunction
  // showControls = T.Controls
}) => {
  const [numberOfPages, setNumberOfPages] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [fileDimensions, setFileDimensions] = React.useState({
    width: 0,
    height: 0
  })
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [isSigningDown, setIsSigningDown] = React.useState(false)

  const signatureRef = React.useRef(null)
  const viewerCanvasRef = React.useRef(null)
  const [placeholderMoved, setPlaceholderMoved] = React.useState(false)

  const isMobile = window.innerWidth <= 768

  const [placeholderStyles, setPlaceholderStyles] = React.useState({
    width: isMobile ? '50px' : '100px',
    height: isMobile ? '50px' : '100px',
    top: '50%',
    left: '50%'
  })

  React.useEffect(() => {
    if (code) {
      setPlaceholderStyles((prev) => ({
        ...prev,
        width: `${code.length * 4}px`,
        height: '20px'
      }))
    }
  }, [])

  const [showPlaceholder, setShowPlaceholder] = React.useState(false)
  const [isSigned, setIsSigned] = React.useState(false)

  const getScale = () => {
    if (isMobile) return 0.66
    return 1
  }

  const [scale, setScale] = React.useState(getScale())

  if (!open) return null
  if (!file) return null

  const controlsFunc = new ControlsFunctions({
    totalPages: numberOfPages,
    currentPage,
    setCurrentPage,
    setScale,
    scale,
    setPlaceholderStyles,
    isMobile
  })

  const signatureControls = new SignaturesControls(
    {
      isSigningDown,
      setIsSigningDown,
      scale,
      isMobile,
      setOpen: setOpenDrawer,
      mainCanvasRef: viewerCanvasRef,
      styles: placeholderStyles,
      setSigned: setIsSigned
    },
    signatureRef
  )
  const signaturePlaceholder = new SignaturesPlaceholder(
    {
      styles: placeholderStyles,
      setStyles: setPlaceholderStyles,
      fileDimensions,
      scale,
      widthOfSignatures: parseInt(placeholderStyles.width.replace('px', '')),
      heightOfSignatures: parseInt(placeholderStyles.height.replace('px', ''))
    },
    isMobile,
    setPlaceholderMoved
  )

  const handleShowPlaceholder = () => {
    setShowPlaceholder(true)
  }

  const handleOpenDrawer = () => {
    setOpenDrawer(true)
  }

  const onDownloadClick = () => {
    handleDownload({
      file,
      signatureRef,
      style: placeholderStyles,
      currentPage,
      fileDimensions,
      canvasRef: viewerCanvasRef,
      scale,
      customPdfDownloadFunction: customPdfDownloadFunction ?? null
    })
  }

  return (
    <div className={styles.pdfModal} style={customStyles.container}>
      <CloseIcon onClick={onClose} />
      {!isSigned ? (
        <PDFInfo
          currentPage={currentPage}
          numberOfPages={numberOfPages}
          onNextPage={controlsFunc.handleNextPage}
          onPreviousPage={controlsFunc.handlePrevPage}
          onZoomIn={controlsFunc.handleZoomIn}
          onZoomOut={controlsFunc.handleZoomOut}
          isMobile={isMobile}
        />
      ) : (
        <input
          type='button'
          value={texts?.download ?? 'Download'}
          onClick={onDownloadClick}
          className={styles.downloadButton}
        />
      )}
      {!showPlaceholder ? (
        <input
          type='button'
          value={texts?.addSignature ?? 'Add signature'}
          className={styles.addSignatureButton}
          onClick={handleShowPlaceholder}
          style={customStyles.button}
        />
      ) : (
        <input
          type='button'
          value={texts?.signDown ?? 'Sign down'}
          className={styles.signDownButton}
          onClick={handleOpenDrawer}
          style={customStyles.button}
        />
      )}
      <div style={{ position: 'relative' }}>
        <PDFViewer
          file={file}
          setNumberOfPages={setNumberOfPages}
          currentPage={currentPage}
          setFileDimensions={setFileDimensions}
          scale={scale}
          canvasRef={viewerCanvasRef}
          getFileDimmeension={getFileDimmeension}
        />
        {showPlaceholder && (
          <PDFDrawerPlaceholder
            onDrop={signaturePlaceholder.handleDrop}
            styles={placeholderStyles}
            isMobile={isMobile}
          />
        )}
      </div>
      {!placeholderMoved && showPlaceholder && (
        <div className={styles.placeholderTooltip}>
          <h5>
            {texts?.placeHolderTooltip ??
              'move to place where you want to sign down'}{' '}
          </h5>
        </div>
      )}

      <PDFDrawer
        signatureRef={signatureRef}
        handleSignDownCapture={signatureControls.handleSignDownCapture}
        handleSignDownCaptureStop={signatureControls.handleSignDownCaptureStop}
        handleSignDown={signatureControls.handleWebSignDownCapture}
        handleSignDownMobile={signatureControls.handleMobileSignDownCapture}
        isSigningDown={isSigningDown}
        onReset={signatureControls.clearCanvas}
        onClose={signatureControls.handleClose}
        onSave={signatureControls.handleSave}
        isOpen={openDrawer}
        code={code}
      />
    </div>
  )
}

export default PDF
