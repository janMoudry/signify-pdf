import React, { useEffect } from 'react'
import * as pdfjs from 'pdfjs-dist'

interface PDFViewerProps {
  file: File
  setNumberOfPages: React.Dispatch<React.SetStateAction<number>>
  currentPage: number
  setFileDimensions: React.Dispatch<
    React.SetStateAction<{
      width: number
      height: number
    }>
  >
  scale: number
  canvasRef: React.RefObject<HTMLCanvasElement>
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  setNumberOfPages,
  currentPage,
  setFileDimensions,
  scale,
  canvasRef
}) => {
  const [isFileLoading, setIsFileLoading] = React.useState(false)

  const handleClearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d') as CanvasRenderingContext2D
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  useEffect(() => {
    if (isFileLoading) return

    if (file) {
      setIsFileLoading(true)
      handleClearCanvas()

      pdfjs.getDocument(URL.createObjectURL(file)).promise.then((pdf) => {
        setNumberOfPages(pdf.numPages)

        pdf.getPage(currentPage).then((page) => {
          const viewport = page.getViewport({ scale })
          const canvas = canvasRef.current
          if (canvas) {
            const context = canvas.getContext('2d') as CanvasRenderingContext2D
            canvas.height = viewport.height
            canvas.width = viewport.width

            setFileDimensions({
              width: viewport.width * scale,
              height: viewport.height * scale
            })

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            }
            page.render(renderContext)
          }
        })
      })

      setIsFileLoading(false)
    }
  }, [file, currentPage, scale])

  return (
    <div>
      <canvas ref={canvasRef} key={`${file.name}-${currentPage}-${scale}`} />
    </div>
  )
}

export default PDFViewer
