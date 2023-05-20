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
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'

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

const SurveyFormField = () => {
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
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Description goes here for the survey form</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant='h5'>Question 1: Satisfation Rate for Fixing Service</Typography>
            <form onSubmit={'handleSubmit'}>
              <FormControl sx={{ m: 3 }} error={'error'} variant='standard'>
                <RadioGroup aria-labelledby='demo-error-radios' name='quiz' value={'best'} onChange={'handleRadioChange'}>
                  <FormControlLabel value='best' control={<Radio />} label='The best!' />
                  <FormControlLabel value='worst' control={<Radio />} label='The worst.' />
                </RadioGroup>
              </FormControl>
            </form>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant='h5'>Question 2: Satisfation Rate for E-Suggestion Service</Typography>
            <form onSubmit={'handleSubmit'}>
              <FormControl sx={{ m: 3 }} error={'error'} variant='standard'>
                <RadioGroup aria-labelledby='demo-error-radios' name='quiz' value={'value'} onChange={'handleRadioChange'}>
                  <FormControlLabel value='best' control={<Radio />} label='The best!' />
                  <FormControlLabel value='worst' control={<Radio />} label='The worst.' />
                </RadioGroup>
              </FormControl>
            </form>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant='h5'>Question 3: Satisfation Rate for Electric Bill Payment Service</Typography>
            <form onSubmit={'handleSubmit'}>
              <FormControl sx={{ m: 3 }} error={'error'} variant='standard'>
                <RadioGroup aria-labelledby='demo-error-radios' name='quiz' value={'value'} onChange={'handleRadioChange'}>
                  <FormControlLabel value='best' control={<Radio />} label='The best!' />
                  <FormControlLabel value='worst' control={<Radio />} label='The worst.' />
                </RadioGroup>
              </FormControl>
            </form>
          </Grid>

          

          

          
        </Grid>
      </form>
    </CardContent>
  )
}

export default SurveyFormField
