import '../InputFile/InputFIle.css'

import { useState } from 'react'

const InputFIle = ({handleFile}) => {
    const [file, setFile] = useState('')

    const selectFile = (e) => {
        setFile(e.target.files[0])

        handleFile(e.target.files[0])
    }

  return (
    <div className='file'>
        <label htmlFor='fileInput'>Escolher arquivo</label>
        <input type="file" onChange={selectFile} id='fileInput'/>
        {!file && <p>Nenhum arquivo selecionado</p>}
        {file && <p>{file.name}</p>}
    </div>
  )
}

export default InputFIle