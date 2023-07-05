import { useState, useContext, useRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import SubmissionForm from '../../pages/submission-form'
import { SettingsContext } from '../../../src/@core/context/settingsContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline'
const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const RequestFormField = () => {
  const JWT = process.env.JWT
  const imageInputRef = useRef(null)
  const [uploadingImage, setUploadingImage] = useState('')
  // const [collapse, setCollapse] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [imageCIDs, setImageCIDs] = useState([])
  const [data, setData] = useState({
    category: '',
    request_description: '',
    image: '',
    request_status: ''
  })
  /* 
    'category' => 'required|string|max:255',
    'request_description' => 'required',
    'image' => 'required', // Restrict the file types and size
    'request_status' => 'required',
  */
  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)

  const onChangeInput = e => {
    setData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const pinFilesToIPFS = async files => {
    // console.log(src)
    const uploadedImageURLs = []
    const uploadedImageCIDs = []
    try {
      for (const file of files) {
        const form = new FormData()

        form.append('file', file)

        const metadata = JSON.stringify({
          name: file.name
        })

        form.append('pinataMetadata', metadata)

        const options = JSON.stringify({
          cidVersion: 0
        })
        form.append('pinataOptions', options)

        setUploadingImage('true')
        const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
            Authorization: `Bearer ${JWT}`
          }
        })

        console.log(res.data)
        //set image cid to get it store in backend
        const image_cid = res.data.IpfsHash
        console.log(image_cid)
        uploadedImageCIDs.push(image_cid)

        const imageURL = `https://gateway.ipfs.io/ipfs/${image_cid}`
        uploadedImageURLs.push(imageURL)
        setUploadedImages(uploadedImageURLs)

        //display success message
        setImageCIDs(uploadedImageCIDs)
        toast.success('Upload image successfully')
        setUploadingImage('false')
      }
    } catch (err) {
      setUploadingImage('')
      console.error(err)
      toast.error('Not able to upload file')
    }
  }

  const onChangeFile = async e => {
    const files = Array.from(e.target.files)
    console.log(files)

    await pinFilesToIPFS(files)
  }

  const handleRemoveImage = async index => {
    const updatedImages = [...uploadedImages]
    updatedImages.splice(index, 1)
    setUploadedImages(updatedImages)

    const updateImageCIDs = [...imageCIDs]
    updateImageCIDs.splice(index, 1)
    setImageCIDs(updateImageCIDs)

    try {
      const res = await axios({
        method: 'delete',
        url: `https://api.pinata.cloud/pinning/unpin/${updateImageCIDs[index]}`,
        headers: {
          Authorization: `Bearer ${process.env.JWT}`
        }
      })
      console.log(res)
      toast.success('Image removed successfully')
    } catch (e) {
      toast.error('Failed to remove image')
      console.error(e)
    }
  }

  const submitForm = async e => {
    e.preventDefault()

    const imageCidsString = imageCIDs.join(',')
    /*
             'category' => 'required|string|max:255',
            'request_description' => 'required',
            'image' => 'required', // Restrict the file types and size
            'request_status' => 'required',
    */

    console.log(imageCidsString)

    const form = new FormData()
    form.append('image', imageCidsString)
    form.append('category', data.category)
    form.append('request_description', data.request_description)
    form.append('request_status', 'pending')

    try {
      const res = await axios({
        url: 'http://localhost:8000/api/requestforms',
        method: 'POST',
        data: form,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res)
      toast.success('Request Form Submit successfully')
      setUploadedImages([])
      setImageCIDs([])
      setData({
        category: '',
        request_description: '',
        image: '',
        request_status: ''
      })
    } catch (err) {
      console.error(err)
      toast.error('Request Form Submit Failed')
      return
    }
  }

  useEffect(() => {
    const handleBeforeUnload = event => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <CardContent>
      {uploadingImage === 'true' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 9999
          }}
        >
          <CircularProgress />
          <Typography variant='body1' style={{ marginLeft: '1rem' }}>
            Please wait, uploading image...
          </Typography>
        </div>
      )}
      <form onSubmit={submitForm}>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel>Request Category</InputLabel>
              <Select label='category' name='category' value={data.category} onChange={onChangeInput}>
                <MenuItem value='house'>House Material Request</MenuItem>
                <MenuItem value='road'>Road Request</MenuItem>
                <MenuItem value='environment'>Environment Request</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label='Request Description'
              name='request_description'
              value={data.request_description}
              placeholder='Descripte your problem here'
              onChange={onChangeInput}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload Photo Here
                  <input
                    hidden
                    type='file'
                    multiple
                    onChange={onChangeFile}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 2MB.
                </Typography>
              </Box>
            </Box>
            <Box>
              {uploadedImages.length > 0 && (
                <ImageList cols={3} rowHeight={160}>
                  {uploadedImages.map((imageURL, index) => (
                    <ImageListItem key={index}>
                      <img src={imageURL} alt={`Uploaded Image ${index}`} />
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        style={{ position: 'absolute', top: 5, right: 5, color: 'red' }}
                      >
                        <RemoveCircleOutline />
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} type='submit' disabled={uploadingImage === 'true'}>
              Submit
            </Button>
            <Typography
              variant='body2'
              color={data.request_description === '' || data.category === '' ? 'red' : 'green'}
            >
              {uploadingImage === 'false' ? 'Ready to submit' : 'Please fill in the field before submit'}
            </Typography>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default RequestFormField
