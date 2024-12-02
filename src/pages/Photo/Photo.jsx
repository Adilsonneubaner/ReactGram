import './Photo.css'

import { uploads } from '../../utils/config'

import { BsHeart, BsHeartFill } from "react-icons/bs";

// Components
import Message from '../../components/Message/Message'
import { Link } from 'react-router-dom'
import PhotoItem from '../../components/PhotoItem/PhotoItem'

// Hooks
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom' 
import {useResetComponentMessage} from '../../hooks/useResetComponentMessage'   

// Redux
import { getPhoto, like, comment } from '../../slices/photoSlice'


const Photo = () => {
    const {id} = useParams()

    const dispatch = useDispatch()

    const resetMessage = useResetComponentMessage(dispatch)

    const {user} = useSelector((state) => state.auth)
    const {photo, loading, error, message} = useSelector((state) => state.photo)

    console.log(photo.likes)


    const [commentText, setCommentText] = useState('')

    // Load photo
    useEffect(() => {
      dispatch(getPhoto(id))

    },[dispatch, id])

    // Like a photo
    const handleLike = () => {
      dispatch(like(photo._id))
        
      resetMessage()
    }

    // Insert a comment
    const handleComment = (e) => {
      e.preventDefault()

      const commentData = {
        comment: commentText,
        id: photo._id
      }

      dispatch(comment(commentData))

      setCommentText('')

      resetMessage()
    }
    

    if (loading) {
      return <p>Carregando...</p>
    }

  return (
    <div id="photo">
      <PhotoItem  photo={photo} user={user} handleLike={handleLike}/>

      <div className="message-container">
        {error && <Message msg={error} type='error'/>}
        {message && <Message msg={message} type='success'/>}
      </div>

      {photo.comments && (
        <>
          <div className="comments">
            <h3>Comentários: ({photo.comments.length})</h3>

            <form onSubmit={handleComment}>
              <input type="text" placeholder='Insira o seu comentário...' onChange={(e) => setCommentText(e.target.value)} value={commentText || ''}/>

              <input type="submit" value='Enviar'/>
            </form>

            {photo.comments.length === 0 && <p>Não há comentários...</p>}
            {photo.comments.map((comment) => (
              <div className="comment" key={comment.comment}>
                <div className="author">
                  <Link to={`/users/${comment.userId}`}>
                    {comment.userImage && (
                      <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName}/>
                    )}

                    <p>{comment.userName}</p>
                  </Link>
                </div>

                <p>{comment.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Photo