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

  const router = useRouter()

  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)
  const [uploadingImage, setUploadingImage] = useState('')

  const [formData, setFormData] = useState({
    fullname: userInfo.fullname,
    email: userInfo.email,
    category: '',
    problem_description: '',
    image: '',
    general_status: 'pending'
  })

  const pinFileToIPFS = async file => {
    // console.log(src)
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

    try {
      setUploadingImage('true')
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
          Authorization: `Bearer ${JWT}`
        }
      })
      console.log(res.data)
      const image_cid = res.data.IpfsHash
      console.log(image_cid)
      // setImage_cid(image_cid);
      setFormData(prevState => ({
        ...prevState,
        image: image_cid
      }))
      setUploadingImage('false')
    } catch (err) {
      setUploadingImage('')
      toast.error('Not able to upload file')
    }
  }

  const fetchUploadedImage = async cid => {
    // const ipfsGateway = 'https://gateway.ipfs.io/ipfs/'
    if (formData.image !== '') {
      try {
        const response = await fetch(`https://gateway.ipfs.io/ipfs/${cid}`)
        if (!response.ok) {
          throw new Error('Failed to fetch image from IPFS')
        }
        const blob = await response.blob()
        const imageURL = URL.createObjectURL(blob)
        setImagePath(imageURL)
        // Use the fetched blob as needed (e.g., display it in an image element)
        // Example: document.getElementById('imageElement').src = URL.createObjectURL(blob);
      } catch (error) {
        toast.error('Unable to load image')
        console.error(error)
      }
    }
  }

  const onChangeFile = async e => {
    const file = e.target.files[0]
    console.log(file)

    await pinFileToIPFS(file)
  }

  const handleChangeFile = async e => {
    const file = e.target.files[0]
    console.log(file);
    try {
      const res = await axios({
        method: 'delete',
        url: `https://api.pinata.cloud/pinning/unpin/${formData.image}`,
        headers: {
          Authorization: `Bearer ${process.env.JWT}`
        }
      })
      console.log(res);
      await pinFileToIPFS(file);
      toast.success("Image change successfully")
    } catch (e) {
      toast.error("Please update your image before updating")
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

    if (forMeStatus) {
      console.log('isForMe')

      setFormData(prevState => ({
        ...prevState,
        fullname: 'Sakal Samnang',
        email: 'sakal05@gmail.com',
        general_status: 'pending'
      }))
    }
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
        setUploadingImage('')
        toast.success('Form submitted successfully')
        imageInputRef.current.value = ''
      } catch (err) {
        const res = await axios({
          method: 'delete',
          url: `https://api.pinata.cloud/pinning/unpin/${formData.image}`,
          headers: {
            Authorization: `Bearer ${process.env.JWT}`
          }
        })
        console.log(res)
        toast.error('Fail to create form, please try again!')
        console.log(err)
      }
    } else {
      toast.error('Please fill in the form')
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
    fetchUploadedImage(formData.image)
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
                    ref={imageInputRef}
                    hidden
                    type='file'
                    onChange={onChangeFile}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled component='label' color='error' variant='outlined'>
                  Change
                  <input
                    // ref={imageInputRef}
                    hidden
                    type='file'
                    onChange={handleChangeFile}
                    accept='image/png, image/jpeg'
                    id='account-upload-image'
                  />
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 2MB.
                </Typography>
              </Box>
            </Box>
            {imagePath && uploadingImage !== '' && (
              <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }} >
                <img src={imagePath} alt='Image' style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </Box>
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
