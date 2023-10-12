# pdf-sign-down

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/pdf-sign-down.svg)](https://www.npmjs.com/package/pdf-sign-down) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save pdf-sign-down
```

## Usage

```tsx
import { Pdf } from 'signify-pdf'
import 'signify-pdf/dist/index.css'
import { useState } from 'react'

const App = () => {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <div className='app'>
      {file && <button onClick={handleOpen}>Open</button>}
      <input
        type='file'
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0])
          }
        }}
        accept='application/pdf'
      />
      {file && (
        <Pdf
          open={open}
          onClose={() => {
            setOpen(false)
          }}
          file={file}
        />
      )}
    </div>
  )
}

export default App
```

## Props

```tsx
interface PDFProps {
  open: boolean // Modal visibility state
  onClose: () => void // Callback to close the modal
  file: File // PDF file
  customStyles?: {
    container?: CSSProperties // Custom styles for the container
    button?: CSSProperties // Custom styles for the buttons
  }
  texts?: {
    signDown?: string // Text for sign down button (default: 'Sign down')
    addSignature?: string // Text for add signature button (default: 'Add signature')
    reset?: string // Text for reset button (default: 'Reset')
    save?: string // Text for save button (default: 'Save')
    close?: string // Text for close button (default: 'Close')
    download?: string // Text for download button (default: 'Download')
  }
  customPdfDownloadFunction?: (file: jsPDF) => void // Custom function for PDF download (default: download)
}
```

## License

MIT © [moudryJan](https://github.com/moudryJan)

# signify-pdf
