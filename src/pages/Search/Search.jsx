import './Search.css'

// Hooks 
import { useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useResetComponentMessage} from '../../hooks/useResetComponentMessage'
import { useQuery } from '../../hooks/useQuery'

// Components
import PhotoItem from '../../components/PhotoItem/PhotoItem'
import { Link } from 'react-router-dom'

// Redux
import { searchPhoto, like } from '../../slices/photoSlice'

const Search = () => {
  const query = useQuery()
  const search = query.get('q')
  

  const dispatch = useDispatch()

  const resetMessage = useResetComponentMessage()

  const {user} = useSelector((state => state.auth))
  const {photos, loading} = useSelector((state => state.photo))

  //Search photo
  useEffect(() => {
    dispatch(searchPhoto(search))
  },[dispatch, search])

  //Like a photo
  const handleLike = (photo) => {
    dispatch(like(photo._id))

    resetMessage()
  }

  if(loading){
    return <p>Carregando...</p>
  }

  return (
    <div id="search-page">
      <h2>Você está buscando por: <span>{search}</span></h2>

      {photos && photos.map((photo) => (
        <div key={photo._id}>
          <PhotoItem photo={photo} user={user} handleLike={handleLike}/>
          
          <Link className="btn" to={`/photo/${photo._id}`}>
            Ver mais
          </Link>
        </div>
      ))}

      {photos && photos.length === 0 && (
        <h3 className='no-photos'>Não foram encontrados resultados para sua busca...</h3>
      )}
    </div>
  )
}

export default Search