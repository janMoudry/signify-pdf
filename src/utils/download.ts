import * as pdfjs from 'pdfjs-dist'
import jsPDF from 'jspdf'

type DownloadTypes = {
  file: File
  signatureRef: React.RefObject<HTMLCanvasElement>
  style: React.CSSProperties
  currentPage: number
  fileDimensions: {
    width: number
    height: number
  }
  canvasRef: React.RefObject<HTMLCanvasElement>
  scale: number
  customPdfDownloadFunction: null | ((pdf: jsPDF) => void)
  shouldDownload: boolean
}

const handleDownload = async ({
  file,
  signatureRef,
  style,
  currentPage,
  fileDimensions,
  canvasRef,
  scale,
  shouldDownload,
  customPdfDownloadFunction
}: DownloadTypes) => {
  if (!signatureRef.current) return
  if (!canvasRef.current) return

  const allPages: {
    pageNumber: number
    page: Promise<pdfjs.PDFPageProxy> | pdfjs.PDFPageProxy
  }[] = []

  await pdfjs.getDocument(URL.createObjectURL(file)).promise.then((pdf) => {
    const numberOfPages = pdf.numPages

    for (let i = 0; i <= numberOfPages; i++) {
      allPages.push({
        pageNumber: i,
        page: pdf.getPage(i)
      })
    }
  })

  const dpi = 300 // Adjust DPI value as needed for quality
  const scaleFactor = dpi / 96 // 96 is the default DPI

  // download pdf from replacePage
  // eslint-disable-next-line new-cap
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [
      fileDimensions.width / scaleFactor / scale,
      fileDimensions.height / scaleFactor / scale
    ]
  })

  for (let i = 1; i < allPages.length; i++) {
    if (!allPages[i].pageNumber) return

    pdf.setPage(i)
    const page = await allPages[i].page
    const viewport = page.getViewport({ scale })
    const canvas = canvasRef.current
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    canvas.height = viewport.height
    canvas.width = viewport.width

    await page.render({
      canvasContext: context,
      viewport
    }).promise

    const imgData = canvas.toDataURL('image/jpeg', 1.0)
    if (currentPage !== allPages[i].pageNumber) {
      pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        canvas.width / scaleFactor,
        canvas.height / scaleFactor
      )
    } else {
      // here I need to connect page with signature and add it to my new pdf file
      const signature = signatureRef.current

      const signaturePosition = {
        x: parseInt(style.left?.toString().replace('px', '') ?? '0'),
        y: parseInt(style.top?.toString().replace('px', '') ?? '0')
      }

      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        canvas.width / scaleFactor,
        canvas.height / scaleFactor
      )

      if (!signature) return

      pdf.addImage(
        signature,
        'PNG',
        signaturePosition.x / scaleFactor,
        signaturePosition.y / scaleFactor,
        signature.width / scaleFactor,
        signature.height / scaleFactor
      )
    }

    if (i < allPages.length - 1) pdf.addPage()
  }

  shouldDownload && pdf.save(file.name)

  if (customPdfDownloadFunction) {
    customPdfDownloadFunction(pdf)
  }
}

export default handleDownload
