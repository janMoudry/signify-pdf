import React from 'react'

interface PDFDrawerPlaceholderProps {
  onDrop: (e: React.DragEvent<HTMLDivElement> | MouseEvent) => void
  styles: React.CSSProperties
  isMobile: boolean
}

const PDFDrawerPlaceholder: React.FC<PDFDrawerPlaceholderProps> = ({
  onDrop,
  styles,
  isMobile
}) => {
  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    onDrop(e)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()

    const { pageX, pageY } = e.touches[0]

    onDrop({
      pageX,
      pageY
    } as any)
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (isMobile) {
      document.body.style.overflow = 'scroll'

      document.removeEventListener('touchmove', function (e) {
        e.preventDefault()
      })
    }
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (isMobile) {
      document.body.style.overflow = 'hidden'

      document.addEventListener(
        'touchmove',
        function (e) {
          e.preventDefault()
        },
        {
          passive: false
        }
      )
    }
  }

  return (
    <div
      style={{
        ...styles,
        outline: '2px dotted black',
        position: 'absolute'
      }}
      onDragEnd={handleDragDrop}
      onDragOver={handleDragDrop}
      draggable
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    />
  )
}

export default PDFDrawerPlaceholder
