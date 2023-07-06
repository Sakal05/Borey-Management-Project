// ** React Imports
import { useState, useEffect, useContext, useRef } from 'react'

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
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { SettingsContext } from 'src/@core/context/settingsContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CircularProgress from '@mui/material/CircularProgress'
const JWT = process.env.JWT

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { CompareArrows } from '@mui/icons-material'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

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

const TabAccount = props => {
  const { info } = props
  console.log('info para', info)

  // console.log(info.user)
  // ** State
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [imagePath, setImagePath] = useState(null)
  const [uploadingImage, setUploadingImage] = useState('')
  const [imageSrc, setImageSrc] = useState(null)
  const [imageURL, setImageURL] = useState('');
 
  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)

  // const [currentUser, setCurrentUser] = useState({
  //   username: '',
  //   fullname: '',
  //   role_id: '',
  //   email: '',
  //   company_id: ''
  // })

  const [currentUser, setCurrentUser] = useState(null)
  const [companiesId, setcompaniesId] = useState()

  /* 
  'image_cid' => 'required',
            'dob' => 'required',
            'gender' => 'required|string|max:255',
            'phonenumber' => 'required|string|max:255',
            'house_type' => 'required|string|max:255',
            'house_number' => 'required|string|max:255',
            'street_number' => 'required|string|max:255',
  */

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
      setImagePath(image_cid)
      const imageURL = `https://gateway.ipfs.io/ipfs/${image_cid}`
      setImageURL(imageURL);
      setUploadingImage('false')
      setCurrentUser(prevState => ({
        ...prevState,
        image_cid: image_cid
      }))
    } catch (err) {
      toast.error('Not able to upload file')
    }
  }

  const fetchUploadedImage = async cid => {
    // const ipfsGateway = 'https://gateway.ipfs.io/ipfs/'
    if (cid !== null) {
      try {
        const response = await fetch(`https://gateway.ipfs.io/ipfs/${cid}`)
        if (!response.ok) {
          throw new Error('Failed to fetch image from IPFS')
        }
        const blob = await response.blob()
        const imageURL = URL.createObjectURL(blob)
        console.log(imageURL)
        setImageSrc(imageURL)
        // Use the fetched blob as needed (e.g., display it in an image element)
        // Example: document.getElementById('imageElement').src = URL.createObjectURL(blob);
      } catch (error) {
        console.error(error)
        // Handle error
        return null
      }
    } else {
      console.log('No image')
    }
  }

  const onChangeFile = async e => {
    const file = e.target.files[0]
    console.log(file)

    await pinFileToIPFS(file)
  }

  const handleInput = e => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    if (fieldName === 'fullname' || 'company_id') {
      setCurrentUser(prevState => ({
        ...prevState,
        user: {
          ...prevState.user,
          [fieldName]: fieldValue
        },
        image_cid: imagePath
      }))
    } else if (fieldName === 'company_id') {
      toast.error('Field cannot be changed')
    }
  }

  const handleSumbit = async e => {
    console.log(currentUser)
    e.preventDefault()
    try {
      const res = await axios({
        url: `http://localhost:8000/api/user_infos/${currentUser.id}`,
        method: 'POST',
        data: currentUser,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Change saved')
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAllCompaniesId = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/companiesId')
    console.log(res)
    setcompaniesId(res.data)
  }

  useEffect(() => {
    setCurrentUser(info)
    setImagePath(info.image_cid)
    setImageURL(`https://gateway.ipfs.io/ipfs/${info.image_cid}`)
    if (token !== null) {
      // fetchUser()
    }
  }, [token])
  
  // useEffect(() => {
  //   if (info !== null) {
  //     // setImageURL(`https://gateway.ipfs.io/ipfs/${info.image_cid}`)
  //   }
  // }, [info])

  useEffect(() => {
    fetchUploadedImage();
  }, [imagePath])

  useEffect(() => {
    fetchAllCompaniesId();
    
  }, [])

  return (
    <CardContent>
      {currentUser === null ? (
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
            Please wait, loading user info...
          </Typography>
        </div>
      ) : (
        <form onSubmit={handleSumbit}>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imageURL === null ? imgSrc : imageURL} alt='Profile Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      onChange={onChangeFile}
                      accept='image/png, image/jpeg'
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => setImgSrc('/images/avatars/1.png')}
                  >
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={
                  <Box>
                    <Typography variant='body5'>Username</Typography>
                    <Typography variant='body5' color='red'>
                      {' (Cannot be changed)'}
                    </Typography>
                  </Box>
                }
                value={currentUser.user.username}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Name'
                name='fullname'
                value={currentUser.user.fullname}
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='email'
                label={
                  <Box>
                    <Typography variant='body5'>Email</Typography>
                    <Typography variant='body5' color='red'>
                      {' (Cannot be changed)'}
                    </Typography>
                  </Box>
                }
                value={currentUser.user.email}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={
                  <Box>
                    <Typography variant='body5'>Role</Typography>
                    <Typography variant='body5' color='red'>
                      {' (Cannot be changed)'}
                    </Typography>
                  </Box>
                }
                value={currentUser.user.role_id === 3 ? 'House Owner' : 'Unknown'}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              {companiesId && (
                <FormControl fullWidth sx={{ marginBottom: 4 }}>
                  <InputLabel>Company</InputLabel>
                  <Select label='Company' name='company_id' value={currentUser.user.company_id} onChange={handleInput}>
                    {Object.entries(companiesId).map(([companyId, userName]) => (
                      <MenuItem value={companyId}>{userName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {!companiesId && (
                'Loading...'
              )}
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' sx={{ marginRight: 3.5 }} type='submit'>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </CardContent>
  )
}

export default TabAccount
