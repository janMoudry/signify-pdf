/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
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
import * as pdfjs from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'
// import ValidationFunctionClass from '../utils/validationFunctions'

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
    readPdfHelper?: string
    reded?: string
  }
  customPdfDownloadFunction?: (file: PDFDocument) => void
  getSignatureInfo?: (info: {
    speed: number
    time: number
    presure: number
  }) => void
  shouldDownload?: boolean
  readerTimer?: number
  skipReading?: boolean
  hideReaderToolbar?: boolean
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
  customPdfDownloadFunction,
  // showControls = T.Controls
  // getSignatureInfo
  shouldDownload = true,
  readerTimer = 5000,
  skipReading = false
  // hideReaderToolbar = false
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
  const [isPdfReaded, setIsPdfReaded] = React.useState(false)
  const [unableToSign, setUnableToSign] = React.useState(true)

  const isMobile = window.innerWidth <= 1024

  const [placeholderStyles, setPlaceholderStyles] = React.useState({
    width: isMobile ? '50px' : '100px',
    height: isMobile ? '50px' : '100px',
    top: '50%',
    left: '50%'
  })

  // const [validationInfo, setValidationInfo] = React.useState<{
  //   speed: number
  //   time: number
  //   presur e: number
  //   numberOfPoints: number
  // }>({
  //   speed: 0,
  //   time: 0,
  //   presure: 0,
  //   numberOfPoints: 0
  // })

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

  const getScale = async () => {
    const referenceNumber = 1

    await pdfjs.getDocument(URL.createObjectURL(file)).promise.then((pdf) => {
      pdf.getPage(currentPage).then((page) => {
        const viewport = page.getViewport({ scale: referenceNumber })

        const widthF = viewport.width
        const heightF = viewport.height

        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight

        const widthRatio = screenWidth / widthF
        const heightRatio = screenHeight / heightF

        const ratio = Math.min(widthRatio, heightRatio) * 0.8

        setScale(ratio)
      })
    })
  }

  const [scale, setScale] = React.useState<number>(1)

  useEffect(() => {
    getScale()
  }, [file])

  useEffect(() => {
    if (!skipReading) {
      const timeout = setTimeout(() => {
        setUnableToSign(false)
      }, readerTimer)

      return () => {
        clearTimeout(timeout)
      }
    }

    return () => {}
  }, [])

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden'
      document.addEventListener(
        'touchmove',
        function (e) {
          e.preventDefault()
        },
        { passive: false }
      )
    }

    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener(
        'touchmove',
        function (e) {
          e.preventDefault()
        },
        {}
      )
    }
  }, [])

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

  // const validationFunctions = new ValidationFunctionClass({
  //   setValidationInfo
  // })

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
    // validationFunctions
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
      customPdfDownloadFunction: customPdfDownloadFunction ?? null,
      shouldDownload,
      code
    })
  }

  // useEffect(() => {
  //   getSignatureInfo && getSignatureInfo(validationInfo)
  // }, [
  //   validationInfo.speed,
  //   validationInfo.time,
  //   validationInfo.presure,
  //   getSignatureInfo
  // ])

  if (!isPdfReaded && !skipReading) {
    return (
      <div
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100svh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          left: 0,
          top: 0
        }}
      >
        {/* <iframe
          src={URL.createObjectURL(file)}
          style={{ width: '100%', height: '100vh', border: 'none' }}
          frameBorder='0'
        /> */}
        <embed
          src={URL.createObjectURL(file)}
          type='application/pdf'
          width='100%'
          height='100%'
        />

        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '5px',
            visibility: unableToSign ? 'visible' : 'hidden'
          }}
        >
          <p
            style={{
              color: 'black'
            }}
          >
            {texts?.readPdfHelper ??
              'Please read the document before you can sign it'}
          </p>
        </div>
        <button
          onClick={() => {
            setIsPdfReaded(true)
          }}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            padding: '10px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
          disabled={unableToSign}
        >
          {texts?.reded ?? 'Readed'}
        </button>
      </div>
    )
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
          style={customStyles.button}
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
        !isSigned && (
          <input
            type='button'
            value={texts?.signDown ?? 'Sign down'}
            className={styles.signDownButton}
            onClick={handleOpenDrawer}
            style={customStyles.button}
          />
        )
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
        {showPlaceholder && !isSigned && (
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
        texts={texts}
        buttonStyles={customStyles.button}
        // countTimeStart={validationFunctions.countTimeStart}
        // countTimeEnd={validationFunctions.countTimeEnd}
      />
    </div>
  )
}

export default PDF
