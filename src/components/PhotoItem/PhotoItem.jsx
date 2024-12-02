import './PhotoItem.css'

import { uploads } from '../../utils/config'

import { Link } from 'react-router-dom'

import { BsHeart, BsHeartFill } from "react-icons/bs";

const PhotoItem = ({ photo, user, handleLike }) => {
  
  return (
    <div className="photo-item">
        {photo.image && (
            <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
        )}
        <h2>{photo.title}</h2>

        <div className="author-like">
          
          <p className="photo-author">
              Publicada por:
              <Link to={`/users/${photo.userId}`}> {photo.userName}</Link>
          </p>

          <div className="like">
            {photo.likes && user && (
              <>
                {photo.likes.includes(user._id) ? (
                  <BsHeartFill />
                ) : (
                  <BsHeart onClick={() => handleLike(photo)} />
                )}
                <p>{photo.likes.length} like(s)</p>
              </>
            )}
          </div>
        </div>
    </div>
  )
}

export default PhotoItem