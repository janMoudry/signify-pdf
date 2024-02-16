// import * as pdfjs from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'

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
  customPdfDownloadFunction: null | ((pdf: any) => void)
  shouldDownload: boolean
}

const handleDownload = async (params: DownloadTypes) => {
  if (!params.signatureRef.current || !params.file) return

  // Load the PDF document from the file
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(params.file)
  fileReader.onload = async () => {
    const arrayBuffer = fileReader.result
    if (!arrayBuffer) return // Add this line to check if arrayBuffer is null

    const pdfDoc = await PDFDocument.load(arrayBuffer as ArrayBuffer) // Cast arrayBuffer as ArrayBuffer
    // Convert the signature canvas to a PNG image
    const signatureCanvas = params.signatureRef.current

    if (!signatureCanvas) return

    const signatureDataUrl = signatureCanvas.toDataURL('image/png')
    const signatureImageBytes = await fetch(signatureDataUrl).then((res) =>
      res.arrayBuffer()
    )

    // Embed the PNG image in the PDF document
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes)

    // Calculate scale for the image based on the canvas and PDF page size
    const page = pdfDoc.getPage(params.currentPage - 1) // Adjust for zero-based index

    // Position the image on the page (example: bottom-right corner)
    page.drawImage(signatureImage, {
      x:
        parseInt(params.style.left?.toString().replace('px', '') ?? '0', 10) /
        params.scale,
      y:
        page.getHeight() -
        parseInt(params.style.top?.toString().replace('px', '') ?? '0', 10) /
          params.scale -
        50,
      width: 50,
      height: 50
    })

    // Serialize the PDFDocument to bytes and trigger the download
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = params.file.name || 'download.pdf' // Custom file name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

// // Main function to handle the download process
// const handleDownload = async (params: DownloadTypes) => {
//   if (!params.signatureRef.current || !params.canvasRef.current) return

//   const pdfDocument = await loadPDFDocument(params.file)
//   if (!pdfDocument) return

//   const pdf = initializePDF(params.fileDimensions, params.scale)

//   await renderPDFPages(pdf, pdfDocument, params)

//   if (params.shouldDownload) pdf.save(params.file.name)
//   if (params.customPdfDownloadFunction) params.customPdfDownloadFunction(pdf)
// }

// // Load PDF document from the file
// const loadPDFDocument = async (file: File) => {
//   try {
//     const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise
//     return pdf
//   } catch (error) {
//     console.error('Error loading PDF document:', error)
//     return null
//   }
// }

// // Initialize a new jsPDF instance
// const initializePDF = (
//   _fileDimensions: { width: number; height: number },
//   _scale: number
// ) => {
//   // const dpi = 300 // High-quality output
//   // const scaleFactor = dpi / 96

//   return new JsPDF({
//     orientation: 'portrait',
//     unit: 'px',
//     format: 'a4'
//   })
// }

// // Render all PDF pages and handle signatures
// const renderPDFPages = async (
//   pdf: JsPDF,
//   pdfDocument: pdfjs.PDFDocumentProxy,
//   params: DownloadTypes
// ) => {
//   const { currentPage, canvasRef, scale, signatureRef, style } = params

//   for (let i = 1; i <= pdfDocument.numPages; i++) {
//     const page = await pdfDocument.getPage(i)

//     // Apply the scale to the viewport
//     page.getViewport({ scale: 1 }) // Use scale 1 for original size
//     const scaledViewport = page.getViewport({ scale }) // Apply the intended scale
//     const canvas = canvasRef.current!
//     const context = canvas.getContext('2d')!

//     // Use the scaled dimensions for the canvas
//     canvas.height = scaledViewport.height
//     canvas.width = scaledViewport.width

//     // Render the page at full resolution, but with the viewport scaled
//     await page.render({ canvasContext: context, viewport: scaledViewport })
//       .promise

//     const imgData = canvas.toDataURL('image/png', 1.0)
//     addPageToPDF(
//       pdf,
//       imgData,
//       i,
//       currentPage,
//       canvas,
//       // scale,
//       signatureRef,
//       style
//     )

//     if (i < pdfDocument.numPages) pdf.addPage()
//   }
// }

// // Add a single page to the PDF, including signature if applicable
// const addPageToPDF = (
//   pdf: JsPDF,
//   imgData: string,
//   pageNumber: number,
//   currentPage: number,
//   canvas: HTMLCanvasElement,
//   // scale: number,
//   signatureRef: React.RefObject<HTMLCanvasElement>,
//   style: React.CSSProperties
// ) => {
//   const dpi = 300
//   const scaleFactor = dpi / 96

//   if (pageNumber !== currentPage) {
//     pdf.addImage(
//       imgData,
//       'PNG',
//       0,
//       0,
//       canvas.width / scaleFactor,
//       canvas.height / scaleFactor
//     )
//   } else {
//     const signatureCanvas = signatureRef.current!
//     const signatureImgData = signatureCanvas.toDataURL('image/png')
//     const signaturePosition = {
//       x: parseInt(style.left?.toString().replace('px', '') ?? '0', 10),
//       y: parseInt(style.top?.toString().replace('px', '') ?? '0', 10)
//     }

//     pdf.addImage(
//       imgData,
//       'PNG',
//       0,
//       0,
//       canvas.width / scaleFactor,
//       canvas.height / scaleFactor
//     )

//     pdf.addImage(
//       signatureImgData,
//       'PNG',
//       signaturePosition.x / scaleFactor,
//       signaturePosition.y / scaleFactor,
//       signatureCanvas.width / scaleFactor,
//       signatureCanvas.height / scaleFactor
//     )
//   }
// }

export default handleDownload
