// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Image Module Import MUI
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'

// ** Icons Imports
import Heart from 'mdi-material-ui/Heart'
import ShareVariant from 'mdi-material-ui/ShareVariant'
import itemData from '../../dummyData'

const dummyData = itemData;

const NewsFeedCard = () => {
  return (
    <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
              Sakal Samnang
            </Typography>
          </Box>
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
          Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as
          well.
        </Typography>
        <ImageList sx={{ width: '100%', height: 450 }} cols={3} rowHeight={164}>
          {dummyData.map(item => (
            <ImageListItem key={1}>
              <img
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                loading='lazy'
                alt='er'
              />
            </ImageListItem>
        ))}
        </ImageList>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
              <Heart sx={{ marginRight: 1.25 }} />
              <Typography variant='body2' sx={{ color: 'common.white' }}>
                1.2k
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShareVariant sx={{ marginRight: 1.25 }} />
              <Typography variant='body2' sx={{ color: 'common.white' }}>
                80
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default NewsFeedCard
