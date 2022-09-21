import type { InferGetServerSidePropsType, GetServerSideProps  } from 'next'
import { useState } from 'react'
import { useRouter } from "next/router"

import { Group, Grid, TextInput,Text,Select, NumberInput, createStyles} from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { useForm } from '@mantine/form'

import { AppConfig } from '@/AppConfig'
import axiosConfig from '@/util/axiosConfig'

import { BackButton, EditButton, SaveButton, CreateButton, DeleteButton }   from '@/components/button'
import { useViewportSize } from '@mantine/hooks'
import { ConfirmModal, getContentModal } from '@/components/modal/form'

const { apiUrl } = AppConfig

const useStyles = createStyles(()=>({
  disbledInput: {
    "&:disabled": {
      backgroundColor: "white",
      opacity: 1,
      color: 'black'
    }
  },
}))

interface payloadProp {
  customerCode: string;
  customerName: string;
  creditLimit: number;
  tel: string;
  addressLine: string;
  tambolId: string;
  amphurId: string;
  provinceId: string
}

interface provinceProp {
  provinceId: string;
  provinceName: string
}

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { query } = context
  const { action, customerId} = query
  const isEdit = action === 'edit'
  
  const initData = await ( async () => {
    switch(action) {
      case 'add': return null
      case 'edit': {
        const listData = await axiosConfig.get(`${apiUrl}/customer/service/customer?customerId=${customerId}`)
        return listData.data
      }
      default: return 404
    }
  })()

  if(initData === 404) return { notFound: true }
  
  const listData = await axiosConfig.get(`${apiUrl}/util/service/province`)
  const provinces = listData.data.map((province:provinceProp) => {
    return {
      value: province.provinceId,
      label: province.provinceName
    }
  })

  const [Amphur, Tambol] = isEdit ? await Promise.all([
      getDistrict(initData[0].provinceId), getSubDistrict(initData[0].provinceId, initData[0].amphurId)
    ]) : [[], []]

  return { props: { provinces, amphurdata: Amphur || [], tumboldata: Tambol || [], initData, readable: isEdit } }
}

const getDistrict = async (proviceId: string) => 
{
  const district = await axiosConfig.get(`${apiUrl}/util/service/amphur?provinceId=${proviceId}`)
  return district.data.map((amphur:{amphurId: string, amphurName: string}) => {
    return {
      value: amphur.amphurId,
      label: amphur.amphurName
    }
  })
}

const getSubDistrict = async (proviceId: string, districtId: string) => {
  const subDistrict = await axiosConfig.get(`${apiUrl}/util/service/tambol?provinceId=${proviceId}&amphurId=${districtId}`)
  return subDistrict.data.map((tambol:{tambolId: string, tambolName: string}) => {
    return {
      value: tambol.tambolId,
      label: tambol.tambolName
    }
  })
}

const ActionCustomer = ({ provinces,amphurdata,tumboldata, initData, readable }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [amphurValue, setAmphurValue] = useState(amphurdata)
  const [tambolValue, setTambolValue] = useState(tumboldata)
  const [editForm, setEditForm] = useState(readable)
  const router = useRouter();
  const { width } = useViewportSize();
  const [ cfOpen, setCfOpened ] = useState(false)
  const [ context, setContext ] = useState({
      title: '',
      body: '',
      btn1: {label: "", cb: () => {''}},
      btn3: {label: ""}
    })
  const view = width < 768 ? true  : false  

  const { classes } = useStyles();
  const customerUrl = '/customer'
  const payload:payloadProp = initData ? initData[0] : {
    customerCode: '',
    customerName: '',
    creditLimit: '',
    tel: '',
    addressLine: '',
    tambolId: '',
    amphurId: '',
    provinceId: ''
  }

  const form = useForm({
    initialValues: payload,
  })

  const checkcode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/[^A-Z0-9-]/gi, '');
    const setupper = result.toUpperCase()
    form.setFieldValue('customerCode', setupper)
  };
  const checkname = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/[^A-Zก-๙ .,]/gi, '');
    form.setFieldValue('customerName', result)
  };
  const checkaddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/[^0-9A-Zก-๙ ./-]/gi, '');
    form.setFieldValue('addressLine', result)
  };
  const checktel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/[^0-9]/gi, '');
    form.setFieldValue('tel', result)
  };
  
  const submitform = (value:payloadProp, isBack = false) => {

    const api = `${apiUrl}/customer/service/customer`
    const action = isBack ? 'backSave' : readable ? 'editSave' : 'create'
    const modalDetail = getContentModal(api, value, action)

    setContext(modalDetail)
    setCfOpened(true)
  }
  const deleteData = () => {
    const {customerId, customerCode} = initData[0]
    openConfirmModal({
      title: 'แจ้งเตือน',
      centered: true,
      children: (<Text size="sm"> คุณยืนยันที่จะลบ {customerCode} นี้หรือไม่</Text>),
      labels: { confirm: 'ยืนยัน', cancel: "ยกเลิก" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await axiosConfig.delete(`${apiUrl}/customer/service/customer?customerId=${customerId}`)
        router.push(customerUrl)
      },
    })
  }


  const eventBack = () => {
    if(!form.isDirty()) return router.push(customerUrl)
    submitform(form.values, true)
  }


  return (
      <>
        <form onSubmit={form.onSubmit((values) => submitform(values))}>
          <Group  position='left'style={{paddingBottom: '20px'}}>
            <Text weight={700} size={20} ml={2}>Customer</Text>
          </Group>
          <Grid mb='xl' grow={view} >
                <Grid.Col order={1} xs={6} sm={1} style={view ? {}: {minWidth:'100px'}} >
                {editForm  && <EditButton onClick={ () => setEditForm(false)}/>}
                {!editForm && readable && <SaveButton/>}
                {!readable && <CreateButton/>}
                </Grid.Col>                           
                <Grid.Col order={2} xs={6} sm={1} style={view ? {}: {minWidth:'100px'}} >
                  <BackButton onClick={eventBack}/>
                </Grid.Col>
                {readable && <Grid.Col order={3} xs={6} sm={1} style={view ? {}: {minWidth:'100px'}} >
                  <DeleteButton onClick={deleteData} />
                </Grid.Col>}
          </Grid>   
          <Grid mb="xl" gutter="sm" style={{marginTop: '20px',borderTop: '1px solid gray'}}>
            <Grid.Col xs={6} md={6}>
                <TextInput 
                  label="Customer Code:" 
                  radius="md"
                  required 
                  {...form.getInputProps('customerCode')}
                  classNames={{input: classes.disbledInput}}
                  onChange={checkcode}
                  disabled={editForm}/>
            </Grid.Col>             
            <Grid.Col xs={6} md={6}>
                <NumberInput 
                  label="Credit limit:" 
                  hideControls
                  radius="md"
                  min={0}
                  required 
                  {...form.getInputProps('creditLimit')}
                  classNames={{input: classes.disbledInput}}
                  disabled={editForm}/>
            </Grid.Col>
            <Grid.Col xs={12} md={12}>
                <TextInput 
                  label="Name:" 
                  radius="md"
                  required 
                  {...form.getInputProps('customerName')}
                  classNames={{input: classes.disbledInput}}
                  onChange={checkname}
                  disabled={editForm}/>
            </Grid.Col>
            <Grid.Col xs={12} md={12}>
                <TextInput 
                  label="Address:" 
                  radius="md"
                  required 
                  {...form.getInputProps('addressLine')}
                  classNames={{input: classes.disbledInput}}
                  onChange={checkaddress}
                  disabled={editForm}/>
            </Grid.Col>
            <Grid.Col xs={6} md={6}>
                <TextInput 
                  label="Telephone:" 
                  radius="md"
                  pattern="[0][6,8,9][0-9]{8}"
                  title="Phone number with 06,08,09 and remaing 8 digit with 0-9"
                  maxLength={10}
                  required 
                  {...form.getInputProps('tel')}
                  classNames={{input: classes.disbledInput}}
                  onChange={checktel}
                  disabled={editForm}/>
            </Grid.Col>   
            <Grid.Col xs={6} md={6}>
                <Select 
                  label="Province:" 
                  radius="md"
                  required 
                  
                  data={provinces}
                  {...form.getInputProps('provinceId')}
                  onChange={async e => {
                    if(e) { 
                      form.setFieldValue('provinceId', e)
                      const amphurs = await getDistrict(e)
                      form.setFieldValue('amphurId', '')
                      setAmphurValue(amphurs)
                      form.setFieldValue('tambolId', '')
                      setTambolValue([])
                    }
                  }}
                  searchable
                  classNames={{input: classes.disbledInput}}
                  disabled={editForm}/>
            </Grid.Col>
            <Grid.Col xs={6} md={6}>
                <Select 
                  label="District:" 
                  radius="md"
                  required 
                  
                  data={amphurValue}     
                  {...form.getInputProps('amphurId')}
                  onChange={async e => {
                    if(e) {
                      form.setFieldValue('amphurId', e)
                      const tambols = await getSubDistrict(form.values.provinceId, e)
                      form.setFieldValue('tambolId', '')
                      setTambolValue(tambols)
                    }
                  }}
                  searchable 
                  classNames={{input: classes.disbledInput}}
                  disabled={editForm}/>
            </Grid.Col>
            <Grid.Col xs={6} md={6}>
                <Select 
                  label="Sub-District:" 
                  radius="md"
                  required 
                  
                  data={tambolValue}
                  searchable 
                  {...form.getInputProps('tambolId')}
                  classNames={{input: classes.disbledInput}}
                  disabled={editForm}/>
            </Grid.Col>
          </Grid>
        </form>
        <ConfirmModal opened={cfOpen} onClose={() => setCfOpened(false)} context={context} pageRefer={customerUrl}/>
      </>
  )
}

export default ActionCustomer