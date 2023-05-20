// ** React Imports
import { useState } from 'react'

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

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

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

const EnvironmentalFormField = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [forMeStatus, setForMeStatus] = useState(true)

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
    }
  }

  const handleUserStatus = e => {
    const value = e.target.value
    console.log(value)
    setForMeStatus(value === 'for_me' ? true : false)
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel>For</InputLabel>
              <Select label='for' defaultValue='for_me' onChange={handleUserStatus}>
                <MenuItem value='for_me'>For me</MenuItem>
                <MenuItem value='for_other'>For other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {!forMeStatus ? (
            <>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Username' placeholder='johnDoe' defaultValue='johnDoe' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Name' placeholder='John Doe' defaultValue='John Doe' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='johnySinh@example.com'
                  defaultValue='johnySinh@example.com'
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label='category' defaultValue='Energy Efficiency'>
                <MenuItem value='Energy Efficiency'>Energy Efficiency</MenuItem>
                <MenuItem value='Waste Management'>Waste Management</MenuItem>
                <MenuItem value='house_hold'>House Hold Repair</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label='Problem'
              placeholder='Descripte your problem here'
              defaultValue='problem_description'
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
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Change
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} href='/submission-form'>
              Submit
            </Button>

          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default EnvironmentalFormField
