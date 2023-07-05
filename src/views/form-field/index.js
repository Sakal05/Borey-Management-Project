// ** React Imports
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
import AlertTitle from '@mui/material/AlertTitle'
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

const FormField = () => {
  const JWT = process.env.JWT
  // ** State
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const imageInputRef = useRef(null)
  const [forMeStatus, setForMeStatus] = useState(true)
  const [imagePath, setImagePath] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageCIDs, setImageCIDs] = useState([]);
  const [uploadingImage, setUploadingImage] = useState('')

  const router = useRouter()

  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)

  const [formData, setFormData] = useState({
    fullname: userInfo.fullname,
    email: userInfo.email,
    category: '',
    problem_description: '',
    image: '',
    general_status: 'pending'
  })

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
        setImageCIDs(uploadedImageURLs);
        toast.success('Upload image successfully');
        setUploadingImage('false');
      }
      const imageCidsString = uploadedImageCIDs.join(',')
      setFormData(prevState => ({
        ...prevState,
        image: imageCidsString
      }))
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

  const handleInput = e => {
    const fieldName = e.target.name
    const fieldValue = e.target.value
    console.log(formData)
    setFormData(prevState => ({
      ...prevState,
      [fieldName]: fieldValue
    }))
  }

  const submitForm = async e => {
    // We don't want the page to refresh
    e.preventDefault()

    console.log(formData.category)
    console.log(formData.problem_description)
    if (formData.category !== '' && formData.problem_description !== '') {
      try {
        console.log('Image Field: ', formData.image)
        const res = await axios({
          url: 'http://localhost:8000/api/form_generals',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
        console.log(res)

        setFormData({
          fullname: '',
          email: '',
          general_status: 'pending',
          category: '',
          problem_description: '',
          image: ''
        })
        setUploadedImages([])
        toast.success('Form submitted successfully')
        imageInputRef.current.value = ''
      } catch (err) {
        // const res = await axios({
        //   method: 'delete',
        //   url: `https://api.pinata.cloud/pinning/unpin/${formData.image}`,
        //   headers: {
        //     Authorization: `Bearer ${process.env.JWT}`
        //   }
        // })
        // console.log(res)
        // toast.error('Fail to create form, please try again!')
        console.log(err)
      }
    } else {
      toast.error('Please fill in the form')
      return
    }
  }

  const fetchUser = async () => {
    try {
      const res = await axios({
        url: 'http://localhost:8000/api/loggeduser',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUserInfo(res.data.user)
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchUser();
  }, [formData])

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
              <InputLabel>Category</InputLabel>
              <Select label='category' name='category' value={formData.category} onChange={handleInput}>
                <MenuItem value='electric'>Electric Repair</MenuItem>
                <MenuItem value='water_supply'>Water Repair</MenuItem>
                <MenuItem value='house_hold'>House Hold Repair</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label='Problem'
              name='problem_description'
              value={formData.problem_description}
              placeholder='Descripte your problem here'
              onChange={handleInput}
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
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} type='submit' disabled={uploadingImage === 'true'}>
              Submit
            </Button>
            <Typography
              variant='body2'
              color={
                formData.problem_description === '' || formData.category === '' || formData.image === ''
                  ? 'red'
                  : 'green'
              }
            >
              {uploadingImage === 'false' ? 'Ready to submit' : 'Please fill in the field before submit'}
            </Typography>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default FormField
