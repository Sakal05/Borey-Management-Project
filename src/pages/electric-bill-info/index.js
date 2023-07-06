// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import ElectricBillList from 'src/views/electric-list'
import ElectricBillInfoForm from 'src/views/electric-bill-info-form'
//src/views/electric-list

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const EnvironmentFixing = () => {
  const [value, setValue] = useState('form')

  const handleChange = (event, newValue) => {
    console.log(newValue)
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          onChange={handleChange}
        >
          <Tab value='form' label={<><AccountOutline />
          <TabName>Electric/Water Bill Information</TabName></>} />
          <Tab value='formList' label={<><AccountOutline /><TabName>Electric/Water Bill List</TabName></>} />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='form'>
          <ElectricBillInfoForm />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='formList'>
          <ElectricBillList/>
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default EnvironmentFixing
