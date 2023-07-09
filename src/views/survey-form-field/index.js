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


const SurveyFormView = ({ survey }) => {
  const { title, description, questions } = survey;
  console.log(questions)
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {description}
      </Typography>

      {questions.map((question) => (
        <Box key={question.id} mt={4}>
          <Typography variant="h6" gutterBottom>
            {question.question}
          </Typography>

          {question.type === 'mcq' && (
            <FormControl component="fieldset">
              <RadioGroup>
                {question.answers.map((answer) => (
                  <FormControlLabel key={answer.id} value={answer.id.toString()} control={<Radio />} label={answer.answer} />
                ))}
              </RadioGroup>
            </FormControl>
          )}

          {question.type === 'text' && (
            <TextField variant="outlined" fullWidth label="Answer" />
          )}
        </Box>
      ))}

      <Box mt={4}>
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default SurveyFormView;