// ** React Imports
import { useState, Fragment, useContext, useEffect } from 'react'

// ** Next Import
import { Router, useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import { SettingsContext } from 'src/@core/context/settingsContext'
import axios from 'axios'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  const [currentUser, setCurrentUser] = useState({
    fullname: '',
    role_id: ''
  })

  const {
    contextTokenValue: { token, clearAuthToken }
  } = useContext(SettingsContext);

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const [image_cid, setImage_cid] = useState(null)

  // ** Hooks
  const router = useRouter()

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleLogOut = async () => {
    console.log('Token in log out page: ', token);

    try {
      await axios({
        method: 'POST',
        // baseURL: API_URL,
        url: 'http://localhost:8000/api/logout',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        console.log(res)
      })

      console.log('Log out successfully')
      clearAuthToken();
      router.push('/pages/u/login')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (token !== null) {
        try {
          const res = await axios({
            method: 'GET',
            // baseURL: API_URL,
            url: 'http://127.0.0.1:8000/api/loggedUserInfo',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          console.log(res)
          setCurrentUser(res.data.user.user)
          setImage_cid(`https://gateway.ipfs.io/ipfs/${res.data.user.image_cid}`)
        } catch (err) {
          if ( err.response.data.message === "Unauthenticated.") {
            console.log("Log in pleam kdmv");
            router.push("/pages/u/login")
          }
          console.log(err)
        }
      }
    }
    if (token !== null) {
      fetchUser();
    }
  }, [token])

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={image_cid === null ? '/images/avatars/1.png' : image_cid}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt='Err Anh' src={image_cid === null ? '/images/avatars/1.png' : image_cid} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{currentUser.fullname}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
              {currentUser.role_id === 3 ? 'USER' : "UNKNOWN"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles} onClick={() => router.push('/account-settings')}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem> */}
        <MenuItem sx={{ py: 2 }} onClick={handleLogOut}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
