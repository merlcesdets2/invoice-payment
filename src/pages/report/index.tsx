import { useEffect, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { Button, createStyles, Grid, Group, Modal, TextInput, Box, NavLink, Center, Loader } from '@mantine/core'
import { DateRangePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'

import { configInvoice, configCustomer } from '@/components/lov/config'
import { ListOfValue } from '@/components/lov/listOfValue'
import { IconRefresh, IconSearch, IconCloudDownload  } from '@tabler/icons'

import { Custom500 } from '@/components/error/500'
import axiosConfig from '@/util/axiosConfig'
import { dateToString } from '@/util/helper'
import { AppConfig } from '@/AppConfig'
import axios from 'axios'
import useSWRImmutable from 'swr/immutable'

const { apiUrl } = AppConfig

const useStyles = createStyles((theme) => ({
  buttonPreview: {
      backgroundColor: '#909296',
    '&:hover': {
      backgroundColor: '#A6A7AB',
    },
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },
  buttonDownload: {
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: 'green',
      opacity: 0.9
    },
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
},
  buttonreset: {
      backgroundColor: '#339AF0',
    '&:hover': {
      backgroundColor: '#4DABF7',
    },
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },
}))

export const getServerSideProps:GetServerSideProps = async () => {
  const customerData = await axiosConfig.get(`${apiUrl}/customer/service/customer`)
  return { props: { customerData: customerData.data } }
}

interface payloadProp {
  invoiceNo: string
  invoiceDate: Date[] | null[]
  customerId: string
  customerCode: string
}

const fetcher = (url:string) => axiosConfig.get(url).then(res => res.data)
const apiInvoice = `${apiUrl}/invoice/service/invoice`

const Report = ({ customerData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  const { data, error } = useSWRImmutable(apiInvoice, fetcher)

  const [ openedCus, setOpenedCus ] = useState(false)
  const [ invoiceData, setInvoiceData] = useState([])
  const { classes } = useStyles()
  const payload: payloadProp = {
    invoiceNo: '',
    invoiceDate: [null, null],
    customerId:'',
    customerCode: ''
  }
  const form = useForm({
    initialValues: payload,
  })

  useEffect(() => {
    if (data) setInvoiceData(data)
  }, [data])
  
  if(error?.response.status === 500 || customerData?.error) return <Custom500/>
  if (!data) return (
    <Center pt={'20vh'}>
      <Loader />
    </Center>
  )

  const cleanData = async () => {
    const [ invoiceStartDate, invoiceEndDate ] = form.values.invoiceDate
    const startData = invoiceStartDate && dateToString(invoiceStartDate)
    const endDate = invoiceEndDate && dateToString(invoiceEndDate)

    return [startData, endDate]
  }
  
  const submitform = async ({customerId}: payloadProp) => {

    const [startData, endDate] = await cleanData()
    const listData = await axiosConfig.get(`${apiInvoice}?customerId=${customerId}&invoiceStartDate=${startData}&invoiceEndDate=${endDate}`)
      setInvoiceData(listData.data)
  }

  const downloadData = async (type: string) => {
    const [startData, endDate] = await cleanData()
    const customerId = form.values.customerId

    const extend = type === 'PDF' ? 'pdf' : 'xlsx'

    await axios({
      url: `${apiUrl}/invoice-reporting/service/invoice/summary/report?fromDate=${startData}&toDate=${endDate}&customerId=${customerId}&fileType=${type}`,
      method: 'GET',
      headers: {
        accessToken: 'invoiceToken'
      },
      responseType: 'blob'
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `InvoiceTransactionReport.${extend}`);
        document.body.appendChild(link);
        link.click();
      }).catch((error) => console.log(error))
  }

  const handleSelectRowCustomer = function (returnVal: {customerId: string, customerCode: string}) {
    form.setFieldValue('customerId', returnVal.customerId)
    form.setFieldValue('customerCode', returnVal.customerCode)
    setOpenedCus(false)
  }

  const resetvalue = () => {
    setInvoiceData(data)
    form.reset()
  }

  return (
    <>
      <form onSubmit={form.onSubmit((values: payloadProp) => submitform(values))}>
        <Grid mb="xl">
          <Grid.Col sm={6} md={6}>
            <DateRangePicker
              label="InvoiceDate "
              {...form.getInputProps('invoiceDate')}
              allowSingleDateInRange="true"
              inputFormat="YYYY-MM-DD"
              radius="md"
            />
          </Grid.Col>
          <Grid.Col sm={6} md={6}>
            <TextInput
              label="Customer:"
              {...form.getInputProps('customerCode')}
              radius="md"
              onClick={() => setOpenedCus(true)}
            />
          </Grid.Col>
        </Grid>
        <Group position="right" style={{ marginBottom: 10, alignItems: 'flex-start' }}>
          <Button className={classes.buttonPreview} leftIcon={<IconSearch/>} type="submit" size='xs' >Preview</Button>
          <Box>
            <NavLink
              label="Download"
              icon={<IconCloudDownload size={16} stroke={1.5} />}
              variant="filled"
              color={'green'}
              py={5}
              className={classes.buttonDownload}
            >
              <NavLink onClick={() => downloadData('PDF')} label="PDF"/>
              <NavLink onClick={() => downloadData('EXCEL')} label="EXCEL"/>
            </NavLink>
          </Box>
          <Button className={classes.buttonreset} leftIcon={<IconRefresh/>} onClick={resetvalue} size='xs'>Reset</Button>
        </Group>
      </form>

      <Modal
        centered
        opened={openedCus}
        closeOnClickOutside={false}
        onClose={() => setOpenedCus(false)}
        title="List Customer "
        size="80%"
      >
        <ListOfValue
          listData={customerData}
          config={configCustomer}
          selectedRow={handleSelectRowCustomer}
        />
      </Modal>
        <ListOfValue listData={invoiceData} config={configInvoice} />
    </>
  )
}

export default Report
