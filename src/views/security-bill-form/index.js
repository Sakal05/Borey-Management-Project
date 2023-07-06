// ** React Imports
import { useState, useEffect, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { SettingsContext } from '../../../src/@core/context/settingsContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CircularProgress from '@mui/material/CircularProgress'

const SecurityBillForm = () => {
  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [securityInfo, setSecurityInfo] = useState({
    id: '',
    user_id: '',
    fullname: '',
    payment_deadline: '',
    house_number: '',
    phone_number: '',
    price: ''
  })

  const getBillInfo = async () => {
      try {
        const res = await axios({
          url: 'http://localhost:8000/api/securitybills',
          method: 'GET',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
        console.log(res)

        if (res.data.length === 0) {
          toast.error('No data was found')
          setLoading(false)
          return
        } else if (res.data[0].payment_status === 'success') {
          toast.error('You have no payment this month')
          setLoading(false)
          return
        }
        //res.data[0]
        setSecurityInfo(res.data[0])
        toast.success('Form submitted successfully')
        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    
    setLoading(false);
  }

  useEffect(() => {
    getBillInfo()
  }, [token]);

  console.log(securityInfo)
  // console.log('ele info: ', securityInfo)

  // const data = securityInfo

  const onSubmit = async e => {
    e.preventDefault()
    let url = `http://localhost:8000/api/securitybills/${securityInfo.id}`;
   

    try {
      const res = await axios({
        url: url,
        method: 'POST',
        data: { payment_status: 'success' },
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Pay Successfully')
      console.log(res)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <CardContent>
      {loading ? (
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
        <form onSubmit={onSubmit}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6}>
              {/* <Typography variant='h5'> User Name</Typography>
            <Typography variant='body1'> {data.userName}</Typography> */}
              <TextField
                fullWidth
                label='User ID'
              
                // name='userName'
                value={securityInfo.user_id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='name'
                InputProps={{
                  readOnly: true
                }}
                name='Name'
                value={securityInfo.fullname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='House Number'
                InputProps={{
                  readOnly: true
                }}
                name='house_number'
                value={securityInfo.house_number}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Payment Deadline'
                InputProps={{
                  readOnly: true
                }}
                name='payment_deadline'
                value={securityInfo.payment_deadline}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Category'
                InputProps={{
                  readOnly: true
                }}
                name='Category'
                value={securityInfo.category}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Total Bill'
                InputProps={{
                  readOnly: true
                }}
                name='totalBill'
                value={securityInfo.price}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' sx={{ marginRight: 3.5 }} type='submit'>
                Pay Now
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </CardContent>
  )
}

export default SecurityBillForm