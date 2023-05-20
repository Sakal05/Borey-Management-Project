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
      <Typography variant='h3' sx={{ alignItems: 'center' }}>
        NewsFeed
      </Typography>
      <Grid container spacing={6} sx={{ m: 'auto', alignItems: 'center' }}>
        <Card>
          <TabContext value={value}>
            <TabList centered onChange={handleChange} aria-label='card navigation example'>
              <Tab value='1' label='For You' />
              <Tab value='2' label='Promotion' />
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
