import React from 'react'
import styles from '../styles.module.css'

interface PDFInfoProps {
  currentPage: number
  numberOfPages: number
  onNextPage: () => void
  onPreviousPage: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  isMobile: boolean
}

const PDFInfo: React.FC<PDFInfoProps> = ({
  currentPage,
  numberOfPages,
  onNextPage,
  onPreviousPage,
  onZoomIn,
  onZoomOut,
  isMobile
}) => {
  return (
    <div className={styles.pdfInfo}>
      <div className={styles.pdfInfoInnerContainer}>
        {!isMobile && <button onClick={onZoomOut}>-</button>}
        <button disabled={currentPage === 1} onClick={onPreviousPage}>
          {'<'}
        </button>
        <span>
          Page {currentPage} of {numberOfPages}
        </span>
        <button disabled={currentPage === numberOfPages} onClick={onNextPage}>
          {'>'}
        </button>
        {!isMobile && <button onClick={onZoomIn}> + </button>}
      </div>
    </div>
  )
}

export default PDFInfo
