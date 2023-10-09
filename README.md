# pdf-sign-down

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/pdf-sign-down.svg)](https://www.npmjs.com/package/pdf-sign-down) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save pdf-sign-down
```

## Usage

```tsx
import { Pdf } from 'pdf-sign-down'
import 'pdf-sign-down/dist/index.css'
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

## Args

```tsx

open: boolean // open modal
onCLose: () => void // callback to close modal
file: File // pdf file
customStyles?:{
container?: CSSProperties
button?: CSSProperties
} // custom styles
texts?: {
signDown?: string // default: 'Sign down'
addSignature?: string // default: 'Add signature'
reset?: string // default: 'Reset'
save?: string // default: 'Save'
close?: string // default: 'Close'
download?: string // default: 'Download'
}
customPdfDownloadFunction?: (file: jsPDF) => void // default is download but you can send there your own function instead of download

```

## License

MIT © [moudryJan](https://github.com/moudryJan)
# signify-pdf
