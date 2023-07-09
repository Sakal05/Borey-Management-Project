// ** React Imports
import { forwardRef, useState, useEffect, useContext, Fragment } from 'react'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { SettingsContext } from '../../@core/context/settingsContext'
import { FormatListBulleted } from 'mdi-material-ui'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// ** Third Party Imports

import moment from 'moment'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Payment Deadline' fullWidth {...props} />
})

const GeneralFormList = () => {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [selectedRow, setSelectedRow] = useState(null) // Add selectedRow state
  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const handleCategoryFilterChange = event => {
    setSelectedCategory(event.target.value)
  }

  const handleCompanyFilterChange = event => {
    setSelectedCompany(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleViewDetail = async row => {
    console.log('row', row)
    setSelectedRow(row)
    // const { row } = props
    console.log(row.path)
 
  }

  const fetchGeneralForm = async () => {
    try {
      const res = await axios({
        url: 'http://localhost:8000/api/form_generals',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('user electric bill: ',res.data)
      setLoading(false)
      setData(res.data)
    } catch (e) {
      console.log(e)
      toast.error(e.message)
    }
  }

  const verifyLogin = token => {
    if (token === null) {
      return false
    } else {
      return true
    }
  }

  const handleViewImage = (url) => {
    // router.push(`https://gateway.ipfs.io/ipfs/${selectedRow.path}`)
   
    window.open(url, '_blank')
  }

  useEffect(() => {
    const t = localStorage.getItem('token')
    token = t
    console.log('token here inside curent page', token)
    if (!verifyLogin(t)) {
      toast.error('Please Login')
      router.push('pages/a/login')
    }
    fetchGeneralForm()
  }, [])

  return (
    <CardContent>
      <form>
        <Grid container spacing={6}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label='sticky table' sx={{ margin: 5 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 50, maxWidth: 200 }}>
                        <FormControl fullWidth>
                          <Select
                            value={selectedCategory}
                            onChange={handleCategoryFilterChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Company' }}
                          >
                            <MenuItem value=''>All</MenuItem>
                            <MenuItem value='success'>Success</MenuItem>
                            <MenuItem value='pending'>Pending</MenuItem>
                            {/* {data &&
                              data.length > 0 &&
                              Array.from(new Set(data.map(info => info.user.companies.company_name))).map(company => (
                                <MenuItem value={company} key={company}>
                                  {company}
                                </MenuItem>
                              ))} */}
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell sx={{ minWidth: 80 }}>Form Id</TableCell>
           
                      <TableCell sx={{ minWidth: 100 }}>Category</TableCell>
                      <TableCell sx={{ minWidth: 50 }}>Created at</TableCell>
                      <TableCell sx={{ minWidth: 50 }}>Status</TableCell>         
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data &&
                      data.length > 0 &&
                      data
                        .filter(info => selectedCategory === '' || info.general_status === selectedCategory)


                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(info => {
                          console.log(info)
                          return (
                            <Fragment key={info.id}>
                              <TableRow hover role='checkbox' tabIndex={-1} onClick={() => handleViewDetail(info)}>
                                <TableCell align='left'></TableCell>
                                <TableCell align='left'>{info.id}</TableCell>
                                <TableCell align='left'>{info.category}</TableCell>
                                
                                <TableCell align='left'> {moment(info.created_at).format('YYYY-MM-DD')}</TableCell>
                                <TableCell align='left'>{info.general_status}</TableCell>
                              </TableRow>
                            </Fragment>
                          )
                        })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Grid>
      </form>
    </CardContent>
  )
}

export default GeneralFormList
