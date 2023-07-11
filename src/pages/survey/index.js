// ** React Imports
import React, { useState, useEffect, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

// ** Icons Imports
import AccountBoxOutlined from '@mui/icons-material/AccountBoxOutlined'

import SurveyFormView from 'src/views/survey-form-field'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SettingsContext } from '../../../src/@core/context/settingsContext'

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

const Survey = () => {
  const [value, setValue] = useState('account')
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})
  const [selectedSurvey, setSelectedSurvey] = useState('')

  const handleSurveyChange = event => {
    setSelectedSurvey(event.target.value)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)

  const fetchAllSurveys = async () => {
    try {
      setLoading(true)

      const res = await axios({
        url: 'http://127.0.0.1:8000/api/surveys',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res)
      setLoading(false)
      setSurveys(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchSurveyById = async () => {
    console.log(selectedSurvey)
    if (selectedSurvey === 'None') {
      return
    }

    try {
      setLoading(true)
      const res = await axios({
        url: `http://127.0.0.1:8000/api/surveys/${selectedSurvey}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res)
      setData(res.data)
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchAllSurveys()
  }, [token])

  useEffect(() => {
    fetchSurveyById()
  }, [selectedSurvey])

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='account'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBoxOutlined />
                <TabName>Survey Form</TabName>
              </Box>
            }
          />
        </TabList>
        <Box m={5}>
          <TabPanel sx={{ p: 0 }} value='account'>
            <div>
              <Typography variant='h4' gutterBottom>
                Select Survey
              </Typography>

              <Box mt={4}>
                <FormControl fullWidth>
                  <InputLabel>Select a survey</InputLabel>
                  <Select label='Select Survey' value={selectedSurvey} onChange={handleSurveyChange}>
                    {surveys.length === 0 && <MenuItem value='None'>None</MenuItem>}
                    {surveys.map(survey => (
                      <MenuItem key={survey.id} value={survey.id}>
                        {survey.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </div>

            {loading === false && (
              <Box mt={4}>
                <SurveyFormView survey={data} />
              </Box>
            )}
          </TabPanel>
        </Box>
      </TabContext>
    </Card>
  )
}

export default Survey
