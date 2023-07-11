// ** React Imports
import { forwardRef, useState, useEffect, useContext, useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControlLabel from '@mui/material/FormControlLabel'
import { SettingsContext } from 'src/@core/context/settingsContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { InformationSlabSymbol } from 'mdi-material-ui'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

const TabInfo = props => {
  const { info } = props
  // console.log('info para', info)
  // ** State
  const [userInfoId, setUserInfoId] = useState(null)
  const [date, setDate] = useState(null)
  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)

  const [currentInfo, setCurrentInfo] = useState(info)

  /* 
  'image_cid' => 'required',
            'dob' => 'required',
            'gender' => 'required|string|max:255',
            'phonenumber' => 'required|string|max:255',
            'house_type' => 'required|string|max:255',
            'house_number' => 'required|string|max:255',
            'street_number' => 'required|string|max:255',
  */

 

  const onChangeDate = e => {
    console.log(e)
    setDate(e)
    const formattedDate = moment(e).format('YYYY-MM-DD')
    setCurrentInfo(prevState => ({
      ...prevState,
      dob: formattedDate
    }))
  }

  const handleInput = e => {
    const fieldName = e.target.name
    const fieldValue = e.target.value
    // console.log(fieldName, fieldValue)
    setCurrentInfo(prevState => ({
      ...prevState,
      [fieldName]: fieldValue
    }))
    console.log(currentInfo)
  }

  const handleSumbit = async e => {
    e.preventDefault()
    try {
      const res = await axios({
        url: `http://localhost:8000/api/user_infos/${info.id}`,
        method: 'POST',
        data: currentInfo,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res)
      await fetchUser()
    } catch (err) {
      console.error(err)
    }
  }

  const handleReset = () => {
    setCurrentInfo({
      dob: '',
      phonenumber: '',
      gender: '',
      house_type: '',
      house_number: '',
      street_number: ''
    })
  }

  const fetchUser = async () => {
    try {
      const res = await axios({
        method: 'GET',
        // baseURL: API_URL,
        url: 'http://127.0.0.1:8000/api/loggedUserInfo',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('UserInfo: ', res.data.user)
      setCurrentInfo(res.data.user)
      setUserInfoId(res.data.user.id)
      const formattedDate = new Date(res.data.user.dob)
      setDate(formattedDate)
    } catch (err) {
      if ( err.response.data.message === "Unauthenticated.") {
        console.log("Log in pleam kdmv");
        router.push("/pages/u/login")
      }
      console.log(err)
    }
  }
  useEffect(() => {
    setCurrentInfo(prevState => ({
      ...prevState,
      ...info
    }));
    const formattedDate = new Date(info.dob)
    setDate(formattedDate)

    console.log(info)
  }, [])

  return (
    <CardContent>
      <form onSubmit={handleSumbit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <DatePicker
                selected={date}
                showYearDropdown
                showMonthDropdown
                id='account-settings-date'
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput />}
                onChange={onChangeDate}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label='Phone'
              name='phonenumber'
              placeholder='016 126 629'
              value={currentInfo.phonenumber}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='House Number'
              name='house_number'
              placeholder='B99'
              value={currentInfo.house_number}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>house_type</InputLabel>
              <Select
                label='House Type'
                defaultValue='1'
                name='house_type'
                onChange={handleInput}
                value={currentInfo.house_type}
              >
                <MenuItem value='1'>Villa</MenuItem>
                <MenuItem value='2'>Twin</MenuItem>
                <MenuItem value='3'>Teas anh</MenuItem>
                <MenuItem value='4'>Teas neak jit khang</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Street Number'
              name='street_number'
              placeholder='B99'
              value={currentInfo.street_number}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
              <RadioGroup row aria-label='gender' name='gender' onChange={handleInput} value={currentInfo.gender}>
                <FormControlLabel value='male' label='Male' control={<Radio />} />
                <FormControlLabel value='female' label='Female' control={<Radio />} />
                <FormControlLabel value='other' label='Other' control={<Radio />} />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} type='submit'>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary' onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabInfo
