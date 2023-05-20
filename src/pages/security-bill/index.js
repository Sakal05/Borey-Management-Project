// ** MUI Imports
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'

// ** Icons Imports
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

const ElectricBill = () => {
  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
        }}
      >
        <Avatar
          sx={{ width: 50, height: 50, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
        >
          <HelpCircleOutline sx={{ fontSize: '2rem' }} />
        </Avatar>
        <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
          Security Bill
        </Typography>
        <Grid item xs={12} sm={12}>
            <InputLabel>User ID</InputLabel>
            <TextField
              fullWidth
              placeholder='Enter user ID'
              defaultValue='Enter user ID'
            />
          </Grid>

        <Button variant='contained' sx={{ padding: theme => theme.spacing(1.75, 5.5), marginTop: 5 }} href='/security-bill-info'>
          Next
        </Button>
      </CardContent>
    </Card>
  )
}

export default ElectricBill
