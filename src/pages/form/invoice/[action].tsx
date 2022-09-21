import type { InferGetServerSidePropsType, GetServerSideProps  } from 'next'
import { Table, Group, Button, Input, Grid, TextInput, NumberInput, createStyles,Text,Tabs, Tooltip, Modal, ScrollArea } from '@mantine/core'
import { IconTrash, IconSwitchVertical, IconPlaylistAdd, IconSearch, IconPrinter } from '@tabler/icons'
import { DatePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, resetServerContext  } from 'react-beautiful-dnd'
import  istyle from '../../../../styles/invoice.module.css'
import { useViewportSize } from '@mantine/hooks';
import { AppConfig } from '@/AppConfig'
import { useRouter } from 'next/router'
import axiosConfig from '@/util/axiosConfig'
import dayjs from 'dayjs'

import { ListOfValue } from '@/components/lov/listOfValue'

import { configCustomer } from '@/components/lov/config'
import { configProduct } from '@/components/lov/config'
import  { BackButton, EditButton, SaveButton, CreateButton, DeleteButton }   from '@/components/button'
import { dateToString } from '@/util/helper'
import { Custom500 } from '@/components/error/500'
import { ConfirmModal, getContentModal, confirmDelete } from '@/components/modal/form'

const { apiUrl } = AppConfig

interface listDataProps {
  productCode: string  ;
  productName: string ;
  unitPrice: number ;
  quantity: number;
  extendedPrice: number;
}

interface payloadProp {
  invoiceNo: string,
  invoiceDate: Date,
  customerId: string,
  customerCode: string,
  totalPrice: number,
  vat: number,
  amountDue: number,
  invoiceLineItem: listDataProps[],
}

const useStyles = createStyles((theme)=>({
  disbledInput: {
      "&:disabled": {
        backgroundColor: "white",
        opacity: 1,
        color: 'black'
      }
  },
  fontEditMode:{
    "&:disabled": {
      color: '#000000',
      opacity: 1,
    }
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
  button: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%'
    },
  },
  scrollbar: {marginTop: '35px', marginBottom: '140px'},
  rootScrollbar: { height: 600 }
  
}))

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { query } = context
  const { action, invoiceId} = query
  const isEdit = action === 'edit'
  const initData = await ( async () => {
    switch(action) {
      case 'add': return null
      case 'edit': {
        const res = await axiosConfig.get(`${apiUrl}/invoice/service/invoice?invoiceId=${invoiceId}`)
        return res.data
      }
      default: return 404
    }
  })()

  if(initData === 404) return { notFound: true }

  const resCus = await axiosConfig.get(`${apiUrl}/customer/service/customer`)
  const listDataCus = resCus.data ? resCus.data : resCus
  const configCus = configCustomer
  const resProduct = await axiosConfig.get(`${apiUrl}/product/service/product`)
  const listDataProduct = resProduct.data ? resProduct.data : resProduct
  const configPro = configProduct
  const findCustomer = await listDataCus.find((data: { customerId: string; }) => {
    if(initData)
    return data.customerId === initData[0].customerId
  })
  const customerName = findCustomer ? findCustomer.customerName : 'Customer Not Found'

  resetServerContext()

  return { props: {
    initData,
    readable: isEdit,
    listDataCus,
    listDataProduct,
    configPro,
    configCus,
    getCusname: isEdit ? customerName : ''
  }}
}

const CreateInvoice = ({
  initData,
  readable,
  listDataCus,
  listDataProduct,
  configPro,
  configCus,
  getCusname
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [editForm, setEditForm] = useState<boolean>(readable)
  const router = useRouter();
  const [openedCus, setOpenedCus] = useState(false);
  const [openedProduct, setOpenedProduct] = useState(false);
  const [indexproduct,setindexProduct] =useState(0)
  const [cusName,setcusName] = useState(getCusname)
  const [ cfOpen, setCfOpened ] = useState(false)
  const [ context, setContext ] = useState({
      title: '',
      body: '',
      btn1: {label: "", cb: () => {''}},
      btn3: {label: ""}
    })

  const { width } = useViewportSize();
  const view = width < 768 ? true  : false  
  const invoiceUrl = '/invoice'

  const { classes, cx } = useStyles();

  if(readable) initData[0].invoiceDate = dayjs(initData[0].invoiceDate).toDate()

  const payload:payloadProp = initData ? initData[0] : {
    invoiceNo: '',
    invoiceDate: '',
    customerId: '',
    customerCode: '',
    totalPrice: '',
    vat: '',
    amountDue: '',
    invoiceLineItem: [{ productId: '',productCode: '', productName: '', unitPrice: 0, quantity:1, extendedPrice: 0 }],
  }

  const form = useForm({
    initialValues: payload,
  })
  
  if(listDataCus.error || listDataProduct.error) return <Custom500/>

  const totalPriceValue = async (product: listDataProps[], index: number) => {
    return product.reduce((a:number, b:listDataProps, i) => {
      if(i === index) return a
      return a + b.extendedPrice
    }, 0)
  }

  const calSummary = async (rPrice:number, index:number) => {
    const TAX = 0.07
    const otherTotal = await totalPriceValue(form.values.invoiceLineItem, index)
    const totalPrice = otherTotal + rPrice
    const sumvat = (totalPrice * TAX).toFixed(2)
    const vat = parseFloat(sumvat)
    const sumamountDue = (totalPrice + vat).toFixed(2)
    const amountDue = parseFloat(sumamountDue)
    form.setFieldValue('totalPrice', totalPrice)
    form.setFieldValue('vat',vat)
    form.setFieldValue('amountDue', amountDue)
  }

  const submitform = async (value:payloadProp, isBack = false) => {
    const api = `${apiUrl}/invoice/service/invoice`
    const tDate = dateToString(value.invoiceDate)
    const newValue = {...value, invoiceDate: tDate}
    const action = isBack ? 'backSave' : readable ? 'editSave' : 'create'
    const modalDetail = getContentModal(api, newValue, action)

    setContext(modalDetail)
    setCfOpened(true)
  }

  const deleteRow = async(index: number) => {
    const text = 'ยืนยันการลบข้อมูล'
    const cb = () => {
      form.removeListItem('invoiceLineItem', index)
      calSummary(0, index)
    }
    confirmDelete(text, cb)
  }

  const rows = form.values.invoiceLineItem.map((_, index) => (
    <Draggable key={index} index={index} draggableId={index.toString()}>
      {(provided) => (
        <tr ref={provided.innerRef} {...provided.draggableProps}>
          <td>
            <Group>
              <div {...provided.dragHandleProps} style={{paddingTop:'4px'}}>
              <IconSwitchVertical  size={18} />
              </div>
                {!editForm && <IconTrash size={20} strokeWidth={2} color={'black'} onClick={() => deleteRow(index)}/>}
            </Group>
          </td>
          <td>
            <TextInput {...form.getInputProps(`invoiceLineItem.${index}.productCode`)} 
              classNames={{input: classes.disbledInput}}
              style={{minWidth:'160px'}} 
              radius="md" 
              required
              onClick={() => searchProduct(index)}
              rightSection={
                  <Tooltip label="Search Product" withArrow>
                    <div>
                    <IconSearch size={18} style={{ display: 'block', opacity: 0.5 }} />
                    </div>
                  </Tooltip>
                }
              styles={{ rightSection: { pointerEvents: 'none' }}}
              disabled={editForm}
            />
          </td>
          <td>
            <Input placeholder="Name" style={{minWidth:'160px'}} classNames={ editForm ? { input: classes.disbledInput } : {input: classes.fontEditMode }}          
            required {...form.getInputProps(`invoiceLineItem.${index}.productName`)} disabled/>
          </td>
          <td>
            <NumberInput 
              placeholder="Unit Price" 
              style={{minWidth:'160px'}}
              classNames={ editForm ? { input: classes.disbledInput } : {input: classes.fontEditMode }}
              disabled
              required
              {...form.getInputProps(`invoiceLineItem.${index}.unitPrice`)}
            />
          </td>
          <td>
            <NumberInput placeholder="Quantity"
              min={1}
              required
              disabled={editForm}
              style={{minWidth:'160px'}}
              classNames={{ input: classes.disbledInput }} 
              {...form.getInputProps(`invoiceLineItem.${index}.quantity`)}
              onChange = {async e => {
                const uPrice = form.values.invoiceLineItem[index].unitPrice
                const rowPrice = uPrice && e ? e * uPrice : 0
                form.setFieldValue(`invoiceLineItem.${index}`, { ...form.values.invoiceLineItem[index], extendedPrice: rowPrice, quantity: e ? e : 0})
                calSummary(rowPrice, index)
              }}/>
          </td>
          <td>
            <NumberInput style={{minWidth:'160px'}} placeholder="Price" {...form.getInputProps(`invoiceLineItem.${index}.extendedPrice`)} classNames={ editForm ? { input: classes.disbledInput } : {input: classes.fontEditMode }} disabled/>
          </td>
        </tr>
      )}
    </Draggable>
  ))

  const summarize = {
    totalPrice: { label: 'Total Price', positionFix: '6em'}, 
    vat: { label: 'Vat', positionFix: '3em' },
    amountDue: { label: 'Amount Due', positionFix: '0'}
  }

  const inputSummarize:  JSX.Element[] = []

  for(const s in summarize) {

    const stylePosition = {
      position: 'sticky' as const,
      bottom: summarize[s as keyof typeof summarize].positionFix
    }

    inputSummarize.push(
      <tr key={s} className={istyle.summary} style={stylePosition}>
      <td className={istyle.actiontable}></td>
      <td ></td>
      <td className={istyle.nametable}></td>
      <td></td>
      <td><Text align='right'>{summarize[s as keyof typeof summarize].label}:</Text></td>
      <td>
        <NumberInput
          hideControls
          classNames={ editForm ? { input: classes.disbledInput } : {input: classes.fontEditMode }}
          {...form.getInputProps(s)}
          disabled/>
      </td>
    </tr>
    )
  }
  const searchProduct = (index: number) =>{
    setindexProduct(index)
    setOpenedProduct(true)
  }

  const handleSelectRowCustomer = function({ customerId, customerCode, customerName }: {customerId: string, customerCode: string, customerName: string}) {
    form.setFieldValue('customerId', customerId)
    form.setFieldValue('customerCode', customerCode)
    setcusName(customerName)
    setOpenedCus(false)
  }

  const handleSelectRowProduct = function({ productId, productCode, productName, unitPrice}
    : { productId: string, productCode: string, productName: string, unitPrice: number}) {
    setOpenedProduct(false)
    const uPrice =  unitPrice
    const rowPrice =  uPrice ? uPrice * form.values.invoiceLineItem[indexproduct].quantity : 0
    const total = form.values.invoiceLineItem[indexproduct].quantity
    form.setFieldValue(`invoiceLineItem.${indexproduct}`, { 
      productId: productId, 
      productCode: productCode,
      productName: productName,
      unitPrice: uPrice,
      quantity:total,
      extendedPrice: rowPrice})
    calSummary(rowPrice, indexproduct)
  }

  const deleteData = () => {
    const { invoiceId, invoiceNo } = initData[0]
    const text = `คุณยืนยันที่จะลบ ${invoiceNo} นี้หรือไม่`
    const cb = () => {
      axiosConfig.delete(`${apiUrl}/invoice/service/invoice?invoiceId=${invoiceId}`)
      router.push(invoiceUrl)
    }
    confirmDelete(text, cb)
  }

  const eventBack = () => {
    if(!form.isDirty()) return router.push(invoiceUrl)
    submitform(form.values, true)
  }

  return (
      <>
        <form onSubmit={form.onSubmit((values) => submitform(values))}>
        <Group  position='left' style={{paddingBottom: '20px'}}>
                  <Text weight={700} size={20} ml={2}>Invoice</Text>
        </Group>
        <Grid mb='xl' grow={view} >
              <Grid.Col order={1} xs={6} sm={1}  style={view ? {}: {minWidth:'100px'}} >
                {editForm && <EditButton onClick={ () => setEditForm(false)}/>}
                {!editForm && readable && <SaveButton/>}
                {!readable &&<CreateButton/>}
              </Grid.Col>                           
              <Grid.Col order={2} xs={6} sm={1} style={view ? {}: {minWidth:'100px'}} >
                <BackButton onClick={eventBack}/>
              </Grid.Col>                    
              {editForm && <Grid.Col  order={3}xs={6}sm={1} style={view ? {}: {minWidth:'100px'}}>
                  <Button className={classes.button} variant="outline" leftIcon={<IconPrinter/>} size='xs' >Print</Button>
              </Grid.Col>}
              {readable && <Grid.Col order={4} xs={6} sm={1}  style={view ? {}: {minWidth:'100px'}} >
                <DeleteButton onClick={deleteData} />
              </Grid.Col>}                                          
        </Grid>         
        
            <Grid mb='xl'style={{borderTop: '1px solid gray'}}>
              <Grid.Col sm={6} md={6}>
                  <TextInput label="Invoice No:" {...form.getInputProps('invoiceNo')} classNames={ editForm ? { input: classes.disbledInput } : {input: classes.fontEditMode }}  radius="md" disabled/>
              </Grid.Col>
              <Grid.Col sm={6} md={6}>
                  <DatePicker label="Invoice Date" {...form.getInputProps('invoiceDate')} classNames={{input: classes.disbledInput}}  inputFormat="YYYY-MM-DD"  radius="md" required disabled={editForm}/>
              </Grid.Col>
              <Grid.Col sm={3} md={3}>
                <TextInput label="Customer:"
                  component="input"
                  {...form.getInputProps('customerCode')} 
                  classNames={{input: classes.disbledInput}}
                  radius="md" required
                  onClick={() => setOpenedCus(true)}
                  rightSection={
                    <Tooltip label="Search Customer" position="top-end" withArrow onClick={() => setOpenedCus(true)}>
                      <div>
                        <IconSearch size={18} style={{ display: 'block', opacity: 0.5 }} />
                      </div>
                    </Tooltip>
                  }
                  styles={{ 
                    rightSection: { cursor: 'pointer' },
                    input: {
                      '&:disabled': {
                        cursor: 'pointer',
                      }
                    }
                  }}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col sm={3} md={3}>
                <TextInput label="Customer Name" classNames={ editForm ? { input: classes.disbledInput } : {input: classes.fontEditMode }}  value={cusName} radius="md" disabled /> 
              </Grid.Col>
            </Grid>
            <Modal
              centered 
              opened={openedCus}
              closeOnClickOutside={false}
              onClose={() => setOpenedCus(false)}
              title="List Customer "
              size="80%"
            >
                <ListOfValue listData={listDataCus} config={configCus} selectedRow={handleSelectRowCustomer}/>
            </Modal>
            <Modal
              centered
              opened={openedProduct}
              closeOnClickOutside={false}
              onClose={() => setOpenedProduct(false)}
              title="List Product "
              size="80%"
            >
              <ListOfValue listData={listDataProduct} config={configPro} selectedRow={handleSelectRowProduct}/>
            </Modal>
          <Tabs variant="outline" defaultValue="productSold">
            <Tabs.List>
              <Tabs.Tab value='productSold'>Product Sold</Tabs.Tab>
              {!editForm && <Button ml={10} leftIcon={<IconPlaylistAdd/>} size='xs' onClick={() => {form.insertListItem('invoiceLineItem', { productCode: '', productName: '', unitPrice: 0, quantity:1, extendedPrice: 0 })}}>Add</Button>}
            </Tabs.List>
            <Tabs.Panel value="productSold" pt="xs">
            <ScrollArea classNames={{root:classes.rootScrollbar, scrollbar: classes.scrollbar}} px={10}>
                <DragDropContext
                      onDragEnd={({ destination, source }) => {
                        if(destination) form.reorderListItem('invoiceLineItem', { from: source.index, to: destination.index })
                      }}
                    >
                  <Table striped>
                      <thead className={cx(classes.header)}>
                          <tr >
                              <th style={{minWidth:'100px'}}>Action</th>
                              <th style={{minWidth:'128px'}}>*Product Code</th>
                              <th style={{minWidth:'128px'}}>Name</th>
                              <th style={{minWidth:'128px'}}>*Unit Price</th>
                              <th style={{minWidth:'128px'}}>*Quantity</th>
                              <th style={{minWidth:'128px'}}>Extended Price</th>
                          </tr>
                      </thead>
                        <Droppable droppableId="dnd-list" direction="vertical">
                          {(provided) => (
                            <tbody {...provided.droppableProps} ref={provided.innerRef}>
                            {rows}
                            {provided.placeholder}
                            {inputSummarize}
                            </tbody>
                          )}
                        </Droppable>
                  </Table>
                </DragDropContext>
                </ScrollArea>
            </Tabs.Panel>
          </Tabs>
        </form>
        <ConfirmModal opened={cfOpen} onClose={() => setCfOpened(false)} context={context} pageRefer={invoiceUrl}/>
      </>
  )
}

export default CreateInvoice

