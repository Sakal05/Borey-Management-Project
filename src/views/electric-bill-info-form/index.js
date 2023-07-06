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

const ElectricBillInfoForm = () => {
  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)
  const router = useRouter()
  const { category } = router.query
  const [loading, setLoading] = useState(true)
  const category_name =
    category === 'electric' ? 'Electric Bill Payment' : category === 'water' ? 'Water Bill Payment' : 'Unknown Category'

  const [electricInfo, setElectricInfo] = useState({
    id: '',
    user_id: '',
    fullname: '',
    payment_deadline: '',
    house_number: '',
    phone_number: '',
    price: ''
  })

  const getBillInfo = async () => {
    if (category === 'electric') {
      try {
        const res = await axios({
          url: 'http://localhost:8000/api/electricbills',
          method: 'GET',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
        console.log('electric info', res)
        if (res.data.length === 0) {
          toast.error('No data was found')
          setLoading(false)

          return
        } else if (res.data[0].payment_status === 'success') {
          toast.error('You have no payment this month')
          setLoading(false)

          return
        }
        setElectricInfo(res.data[0])
        setLoading(false)
        toast.success('Form submitted successfully')
      } catch (err) {
        console.error(err)
      }
    } else if (category === 'water') {
      try {
        const res = await axios({
          url: 'http://localhost:8000/api/waterbills',
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
        setElectricInfo(res.data[0])
        toast.success('Form submitted successfully')
        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    setLoading(false)
  }

  const handleUpdateStatus = async e => {
    e.preventDefault()
    let url
    if (category === 'electric') {
      url = `http://localhost:8000/api/electricbills/${electricInfo.id}`
    } else if (category === 'water') {
      url = `http://localhost:8000/api/waterbills/${electricInfo.id}`
    }

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

  useEffect(() => {
    getBillInfo()
  }, [category])

  console.log(electricInfo)
  // console.log('ele info: ', electricInfo)

  // const data = electricInfo

  const onSubmit = async e => {
    e.preventDefault()
    let url
    if (category === 'electric') {
      url = `http://localhost:8000/api/electricbills/${electricInfo.id}`
    } else if (category === 'water') {
      url = `http://localhost:8000/api/waterbills/${electricInfo.id}`
    }

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
        <form onSubmit={handleUpdateStatus}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6}>
              {/* <Typography variant='h5'> User Name</Typography>
            <Typography variant='body1'> {data.userName}</Typography> */}
              <TextField
                fullWidth
                label='User ID'
                InputProps={{
                  readOnly: true
                }}
                // name='userName'
                value={electricInfo.user_id}
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
                value={electricInfo.fullname}
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
                value={electricInfo.house_number}
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
                value={electricInfo.payment_deadline}
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
                value={category_name}
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
                value={electricInfo.price}
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

export default ElectricBillInfoForm
