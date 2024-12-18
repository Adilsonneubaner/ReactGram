import './Profile.css'

import { uploads } from '../../utils/config'

// Components
import Message from '../../components/Message/Message'
import { Link } from 'react-router-dom'
import { BsFillEyeFill, BsPencilFill, BsXLg } from 'react-icons/bs'
import InputFIle from '../../components/InputFile/InputFIle'

// Hooks
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage'

// Redux
import { getUserDetails} from '../../slices/userSlice'
import{publishPhoto, getUserPhotos, deletePhoto, updatePhoto} from '../../slices/photoSlice'

const Profile = () => {
    const {id} = useParams()

    const dispatch = useDispatch
    ()

    const {user, loading} = useSelector((state) => state.user)
    const {user: userAuth} = useSelector((state) => state.auth)
    const {
      photos,
      loading: loadingPhoto,
      message: messagePhoto,
      error: errorPhoto
    } = useSelector((state) => state.photo)

    const [title, setTitle] = useState('')
    const [image, setImage] = useState('')

    const [editId, setEditId] = useState('')
    const [editImage, setEditImage] = useState('')
    const [editTitle, setEditTitle] = useState('')

    const resetMessage = useResetComponentMessage(dispatch)

    // New form and edi form ref
    const newPhotoForm = useRef()
    const editPhotoForm = useRef()

    // Load user data
    useEffect(() => {
      dispatch(getUserDetails(id))

      dispatch(getUserPhotos(id))
    },[dispatch, id])


    // Select a photo
    const handleFile = (file) => {
      setImage(file)
    }


    // Delete a photo
    const handleDelete = (photoId) => {
      dispatch(deletePhoto(photoId))

      resetMessage()
    }

    const handleSubmit = async (e) => {
      e.preventDefault()

      const photoData = {
        title,
        image
      }

      // Build form data
      const formData = new FormData()

      Object.keys(photoData).forEach((key) => formData.append(key, photoData[key]))

      formData.append("user", photoData)

      await dispatch(publishPhoto(formData))

      setTitle('')

      setImage('')

      resetMessage()
    }



    // Show or hide forms
    const hideOrShowForms = () => {
      newPhotoForm.current.classList.toggle("hide")
      editPhotoForm.current.classList.toggle("hide")
    }

    // Open edit photo
    const handleEdit = (photo) => {
      if(editPhotoForm.current.classList.contains("hide")){
        hideOrShowForms()
      }

      setEditId(photo._id)
      setEditTitle(photo.title)
      setEditImage(photo.image)
    }

    //Update a photo
    const handleUpdate = (e) => {
      e.preventDefault()

      const photoData = {
        title: editTitle,
        id: editId
      }

      dispatch(updatePhoto(photoData))

      resetMessage()
      console.log('reset update')
    }

    const handleCancelEdit = () => {
      hideOrShowForms()
    }

    if(loading){
      return <p>Carregando...</p>
    }

  return (
    <div id="profile">
      <div className="profile-header">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}

        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>

      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>

            <form onSubmit={handleSubmit}>
              <label>
                <span>Título para a foto:</span>
                <input type="text" placeholder='Insira um título' onChange={(e) => setTitle(e.target.value)} value={title || ''}/>
              </label>

              <InputFIle handleFile = {handleFile}/>

              {!loading && <input type="submit" value="Postar" />}
              {loading && <input type="submit" value="Aguarde..." disabled/>}
            </form>
          </div>

          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>
            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
            )}

            <form onSubmit={handleUpdate}>
              <input type="text" placeholder='Insira um título' onChange={(e) => setEditTitle(e.target.value)} value={editTitle || ''}/>

              <input type="submit" value="Alterar" />

              <div className='cancel-btn cancel-edit' onClick={handleCancelEdit}>Cancelar edição</div>
            </form>
          </div>

          {errorPhoto && <Message msg={errorPhoto} type='error'/>}
          {messagePhoto && <Message msg={messagePhoto} type='success'/>}
        </>
      )}

      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos &&
           photos.map((photo) => (
            <div className="photo" key={photo._id}>
              {photo.image && (
                <img
                 src={`${uploads}/photos/${photo.image}`}
                  alt={photo.title}
                />
                )}

                {id === userAuth._id ? (
                  <div className="actions">
                    <Link to={`/photo/${photo._id}`}>
                      <BsFillEyeFill/>
                    </Link>

                    <BsPencilFill onClick={() => handleEdit(photo)}/>

                    <BsXLg onClick={() => handleDelete(photo._id)}/>
                  </div>
                ) : (
                  <Link className='btn' to={`photos/${photo._id}`}>
                    Ver
                  </Link>
                )}

                {photos.length === 0 && <p>Ainda não há fotos publicadas</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile