import type { InferGetServerSidePropsType, GetServerSideProps  } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { Group, Grid, TextInput, Text, NumberInput, createStyles } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useViewportSize } from '@mantine/hooks'
import { openConfirmModal } from '@mantine/modals'

import axiosConfig from '@/util/axiosConfig'
import { AppConfig } from '@/AppConfig'
import  { BackButton, EditButton, SaveButton, CreateButton, DeleteButton }   from '@/components/button'
import { ConfirmModal, getContentModal } from '@/components/modal/form'

const { apiUrl } = AppConfig

interface payloadProp {
  productCode: string;
  productName: string;
  unitPrice: number;
  unit: string|null;
}

const useStyles = createStyles(()=>({
  disbledInput: {
    "&:disabled": {
      backgroundColor: "white",
      opacity: 1,
      color: 'black'
    }
  },
}))

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { query } = context
  const { action, productId} = query
  const isEdit = action === 'edit'
  const initData = await ( async () => {
    switch(action) {
      case 'add': return null
      case 'edit': {
        const res = await axiosConfig.get(`${apiUrl}/product/service/product?productId=${productId}`)
        return res.data
      }
      default: return 404
    }
  })()
  
  if(initData === 404) return { notFound: true }

  return { props: { initData , readable: isEdit } }
}
const Product =({initData,readable}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [editForm, setEditForm] = useState(readable)
  const productUrl = '/product'
  const [ cfOpen, setCfOpened ] = useState(false)
  const [ context, setContext ] = useState({
      title: '',
      body: '',
      btn1: {label: "", cb: () => {''}},
      btn3: {label: ""}
    })

  const { width } = useViewportSize();
  const view = width < 768 ? true : false  

  const { classes } = useStyles();
  const payload:payloadProp = initData ? initData[0] : {
    productCode: '',
    productName: '',
    unitPrice: '',
    unit: '',
  }

  const form = useForm({
    initialValues: payload,
  })
  
  const checkcode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/[^A-Z0-9-]/gi, '');
    const setupper = result.toUpperCase()
    form.setFieldValue('productCode', setupper)
  };
  const checkname = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/[^A-Zก-๙]/gi, '');
    form.setFieldValue('productName', result)
  };
  const checkunit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/[^a-zก-๙]/gi, '');
    form.setFieldValue('unit', result)
  };

  const submitform = (value:payloadProp, isBack = false) => {

    const api = `${apiUrl}/product/service/product`
    const action = isBack ? 'backSave' : readable ? 'editSave' : 'create'
    const modalDetail = getContentModal(api, value, action)

    setContext(modalDetail)
    setCfOpened(true)
  }

  const deleteData = () => {
    const {productId, productCode} = initData[0]
    openConfirmModal({
      title: 'แจ้งเตือน',
      centered: true,
      children: (<Text size="sm"> คุณยืนยันที่จะลบ {productCode} นี้หรือไม่</Text>),
      labels: { confirm: 'ยืนยัน', cancel: "ยกเลิก" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await axiosConfig.delete(`${apiUrl}/product/service/product?productId=${productId}`)
        router.push(productUrl)
      },
    })
  }

  const eventBack = () => {
    if(!form.isDirty()) return router.push(productUrl)
    submitform(form.values, true)
  }

  return (
    <>
      <form onSubmit={form.onSubmit((values) => submitform(values))}>
      <Group position="left" style={{paddingBottom: '20px'}}>
        <Text weight={700} size={20} ml={2}>
          Products
        </Text>
      </Group>
      <Grid mb='xl' grow={view} >
          <Grid.Col  order={1} xs={6} sm={1}  style={view ? {}: {minWidth:'100px'}} >
            {editForm && <EditButton onClick={ () => setEditForm(false)}/>}
            {!editForm && readable  && <SaveButton/>}
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
            <TextInput label="Product Code :"  {...form.getInputProps('productCode')} classNames={{input: classes.disbledInput}} radius="md"  required  onChange={checkcode}disabled={editForm}/>
          </Grid.Col>
          <Grid.Col xs={6} md={6}>
            <TextInput label="Product Name :"  {...form.getInputProps('productName')} classNames={{input: classes.disbledInput}} radius="md"  required onChange={checkname}disabled={editForm}/>
          </Grid.Col>
          <Grid.Col xs={6} md={6}>
            <NumberInput label="Unit Price :" required hideControls {...form.getInputProps('unitPrice')} min={0} classNames={{input: classes.disbledInput}} radius="md" disabled={editForm} />
          </Grid.Col>
          <Grid.Col xs={6} md={6}>
            <TextInput label="Units :" required classNames={{input: classes.disbledInput}} {...form.getInputProps('unit')} radius="md" pattern="[a-z,A-Z]{3,}"
                  title="Enter three or more letters" onChange={checkunit} disabled={editForm}/>
          </Grid.Col>
        </Grid>
      </form>
      <ConfirmModal opened={cfOpen} onClose={() => setCfOpened(false)} context={context} pageRefer={productUrl}/>
    </>
  )
}
export default Product
