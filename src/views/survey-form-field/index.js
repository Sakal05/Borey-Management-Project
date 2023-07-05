// ** React Imports
import { useState, useEffect } from 'react'

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
import tempQuestionForm from 'src/dummyData/formDummyData'
import axios from 'axios'

const SurveyFormField = () => {
  console.log('SurveyFormField', tempQuestionForm);
  const [formData, setFormData] = useState([]);
  
  const fetchSurveyForm = async () => {
    const token = localStorage.getItem('token')
    const res = await axios({
      url: `http://localhost:8000/api/surveys`,
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setFormData(res)
    console.log(res)
  }

  useEffect(() => {
    fetchSurveyForm
  })

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          {tempQuestionForm.map((form, index) => (
            <Grid item xs={12} sm={12} key={index}>
              <Typography variant='h5'>{form.question.questionText}</Typography>
              <FormControl sx={{ m: 3 }}>
                <RadioGroup
                  aria-labelledby='demo-error-radios'
                  name={`quiz-${index}`} // Provide a unique name for each group
                >
                  {form.answers.answerOptions.map((answerOption, optionIndex) => (
                    <FormControlLabel
                      key={optionIndex}
                      value={answerOption.answerNum}
                      control={<Radio />}
                      label={answerOption.answerText}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          ))}
        </Grid>
      </form>
    </CardContent>
  )
}

export default SurveyFormField
