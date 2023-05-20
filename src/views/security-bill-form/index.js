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



const SecurityBillForm = () => {
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

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Username' placeholder='Sakal123' defaultValue='Sakal123' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Name' placeholder='Sakal' defaultValue='Sakal' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='House Number' placeholder='B12' defaultValue='B12' />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel>Security Type</InputLabel>
              <Select label='security-type' defaultValue='standard'>
                <MenuItem value='standard'>Standard</MenuItem>
                <MenuItem value='premium'>Premium</MenuItem>
                <MenuItem value='high-class'>High Class</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label='Total Bill'
              placeholder='120000r'
              defaultValue='120000'
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }}>
              Pay Now
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default SecurityBillForm
