// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useState } from 'react'

// ** MUI Imports for tab panel
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import NewsFeedCard from './newsFeedCard'

const NewsFeed = () => {
  // ** State
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <ApexChartWrapper sx={{ alignContent: 'center', alignItems: 'center' }}>
      <Grid container spacing={6} m={5} sx={{ display: 'flex', justifyContent:'center', alignItems: 'center'}}>
        <Typography variant='h3' sx={{ alignItems: 'center', fontWeight: 700}}>
          NewsFeed
        </Typography>
      </Grid>
      <Grid container spacing={6} sx={{ m: 'auto', display: 'flex', justifyContent:'center', alignItems: 'center' }}>
        <Card>
          <TabContext value={value}>
            <TabList centered onChange={handleChange} aria-label='card navigation example'>
              <Tab value='1' label='For You'  sx={{ fontWeight: '900' }}/>
              <Tab value='2' label='Promotion'  sx={{ fontWeight: '900' }}/>
            </TabList>
            <CardContent sx={{ textAlign: 'center' }}>
              <TabPanel value='1' sx={{ p: 0 }}>
                <Grid spacing={5} m={5}>
                  <NewsFeedCard></NewsFeedCard>
                </Grid>
                <Grid spacing={5} m={5}>
                  <NewsFeedCard></NewsFeedCard>
                </Grid>

                {/* <Typography variant='h6' sx={{ marginBottom: 2 }}>
                  Header One
                </Typography>
                <Typography variant='body2' sx={{ marginBottom: 4 }}>
                  Pudding tiramisu caramels. Gingerbread gummies danish chocolate bar toffee marzipan. Wafer wafer cake
                  powder danish oat cake.
                </Typography> */}
                {/* <Button variant='contained'>Button One</Button> */}
              </TabPanel>
              <TabPanel value='2' sx={{ p: 0 }}>
                <Grid spacing={5} m={5}>
                  <NewsFeedCard></NewsFeedCard>
                </Grid>
              </TabPanel>
            </CardContent>
          </TabContext>
        </Card>
      </Grid>
    </ApexChartWrapper>
  )
}

export default NewsFeed
