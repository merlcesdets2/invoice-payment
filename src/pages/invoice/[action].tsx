// import type { InferGetServerSidePropsType } from 'next'
import { Table, Group, Button, Input, Grid, TextInput, Select, NumberInput, createStyles,Text,Tabs,Modal} from '@mantine/core'
import { AplicationContainer }  from '../../components/layout/template'
import { Trash, SwitchVertical  } from 'tabler-icons-react';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, resetServerContext  } from 'react-beautiful-dnd';
import  istyle from '../../../styles/invoice.module.css'
import { useModals } from '@mantine/modals';
import { Receiptview } from '../../components/receiptview'


interface listDataProps {
  productCode: string | null ;
  name: string | undefined;
  unitPrice: number | undefined;
  quantity: number;
  price: number;
}

interface ListProductProps {
  value: string;
  label: string;
  name: string;
}

const useStyles = createStyles({
  disbledInput: {
      "&:disabled": {
        backgroundColor: "white",
        opacity: 1,
        color: 'black'
      }
  }
})

export const getServerSideProps = async () => {
  resetServerContext() 
  return { props: { data: [] } }
}

// const CreateInvoice = ({listData}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const CreateInvoice = () => {
    const modals = useModals();
    const { classes } = useStyles();
    const [opened, setOpened] = useState(false);

    const form = useForm({
      initialValues: {
        product: [{ productCode: '', name: '', unitPrice: undefined, quantity:1, price: 0 }],
      },
    })

    const totalPriceValue = async (product: listDataProps[], index: number) => {
      return product.reduce((a:number, b:listDataProps, i) => {
        if(i === index) return a
        return a + b.price
      }, 0)
    }

    const [ summary, setSummary] = useState({totalPrice: 0, totalVat: 0, totalAmount: 0})

    const calSummary = async (rPrice:number, index:number) => {
      const otherTotal = await totalPriceValue(form.values.product, index)
      const totalPrice = otherTotal + rPrice
      const totalVat = totalPrice * 0.07
      const totalAmount = totalPrice + totalVat
      setSummary({ totalPrice, totalVat, totalAmount })
    }

    const submit = (e: React.FormEvent) => {
      modals.openConfirmModal({
        transition:'fade',
        title: 'Please confirm your create Invoice',
        centered: true,
        radius: 10,
        overlayBlur: 1,
        closeOnClickOutside: false,
        children: (
          <Text size="md">
            Do you want to Crate Invoice ?
          </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        confirmProps: { color: 'blue' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => senddata(),
      });
      e.preventDefault();
    }

    const senddata = () =>{
      setOpened(true)
    }

    const product:ListProductProps[] = [
      { value: '123', label: 'P123', name: 'AAAAA AAAAA' },
      { value: '234', label: 'P234', name: 'BBBBB BBBBB' },
      { value: '134', label: 'P134', name: 'CCCCC CCCCC' },
      { value: '431', label: 'P431', name: 'DDDDD DDDDD' },
    ]

    const rows = form.values.product.map((_, index) => (
      <Draggable key={index} index={index} draggableId={index.toString()}>
        {(provided) => (
          <tr ref={provided.innerRef} {...provided.draggableProps}>
            <td>
            <div {...provided.dragHandleProps}>
              <Group>
                  <Trash size={20} strokeWidth={2} color={'black'} onClick={async() => {
                    form.removeListItem('product', index)
                    calSummary(0, index)
                  }}/>
                <SwitchVertical  size={18} />
              </Group>
            </div>
            </td>
            <td>
              <Select
                placeholder="Product Code" 
                data={product}
                required
                {...form.getInputProps(`product.${index}.productCode`)}
                onChange = {e => {
                  form.setFieldValue(`product.${index}`, { ...form.values.product[index], productCode: e, name: product.find(p => p.value === e)?.name })
                }}
                searchable/>
            </td>
            <td>
              <Input placeholder="Name" classNames={{input: classes.disbledInput}}
              required {...form.getInputProps(`product.${index}.name`)} disabled/>
            </td>
            <td>
              <NumberInput 
                placeholder="Unit Price" 
                precision={2}
                hideControls
                required
                {...form.getInputProps(`product.${index}.unitPrice`)}
                onChange = {async uPrice => {
                  const rowPrice =  uPrice ? uPrice * form.values.product[index].quantity : 0
                  form.setFieldValue(`product.${index}`, { ...form.values.product[index], price: rowPrice, unitPrice: uPrice})
                  calSummary(rowPrice, index)
                }}
              />
            </td>
            <td>
              <NumberInput placeholder="Quantity"
                min={1}
                required
                {...form.getInputProps(`product.${index}.quantity`)}
                onChange = {async e => {
                  const uPrice = form.values.product[index].unitPrice
                  const rowPrice = uPrice && e ? e * uPrice : 0
                  form.setFieldValue(`product.${index}`, { ...form.values.product[index], price: rowPrice, quantity: e ? e : 0})
                  calSummary(rowPrice, index)
                }}/>
            </td>
            <td>
              <NumberInput precision={2} placeholder="Price" {...form.getInputProps(`product.${index}.price`)} classNames={{input: classes.disbledInput}} disabled/>
            </td>
          </tr>
        )}
      </Draggable>
    ))

    interface SummarizeProps {
      totalPrice: string;
      totalVat: string;
      totalAmount: string
    }

    const summarize:SummarizeProps = {
      totalPrice: 'Total Price', totalVat: 'Vat', totalAmount: 'Amount Due'
    }

    const inputSummarize:  JSX.Element[] = []

    for(const s in summarize) {
      inputSummarize.push(
        <tr key={s} className={istyle.summary}>
        <td className={istyle.actiontable}></td>
        <td ></td>
        <td className={istyle.nametable}></td>
        <td></td>
        <td><Text align='right'>{summarize[s as keyof SummarizeProps]}:</Text></td>
        <td>
          <NumberInput 
            precision={2} 
            classNames={{input: classes.disbledInput}} 
            value={summary[s as keyof SummarizeProps]} 
            disabled/>
        </td>
      </tr>
      )
    }

    return (
        <AplicationContainer title='Create Invoice' >
          <form onSubmit={submit}>
            <Grid mb='xl'>
              <Grid.Col sm={6} md={6}>
                  <TextInput label="Invoice No:" radius="md" size="md" required />
              </Grid.Col>
              <Grid.Col sm={6} md={6}>
                  <DatePicker label="Invoice Date" size="md" radius="md" required inputFormat="DD/MM/YYYY" defaultValue={new Date()}/>
              </Grid.Col>
              <Grid.Col sm={6} md={6}>
                  <Select  label="Customer:" radius="md" size="md" required data={['customer A', 'customer B', 'customer C']} searchable/>
              </Grid.Col>
            </Grid>
            <Tabs variant="outline" defaultValue="productSold">
              <Tabs.List>
                <Tabs.Tab value='productSold'>Product Sold</Tabs.Tab>
                <Tabs.Tab value='receipt'>Receipts View</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="productSold" pt="xs">
                <Group  position='left' mt='md' m='xs'>
                    <Text style={{marginLeft: 2,fontWeight:'bold',fontSize:'20px'}}>Products</Text>
                    <Button onClick={() => {form.insertListItem('product', { productCode: '', name: '', unitPrice: undefined, quantity:1, price:0 })}}>Add</Button>
                </Group>
                <div style={{overflow: 'auto'}}>
                  <DragDropContext
                        onDragEnd={({ destination, source }) => {
                          if(destination) form.reorderListItem('product', { from: source.index, to: destination.index })
                        }}
                      >
                    <Table striped>      
                        <thead>
                            <tr>
                                <th className={istyle.actiontable}>Action</th>
                                <th className={istyle.producttable}>*Product Code</th>
                                <th className={istyle.nametable}>Name</th>
                                <th>*Unit Price</th>
                                <th>*Quantity</th>
                                <th>Extended Price</th>
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
                </div>
                <Group  position='right' mt='md'>
                  <Button type='submit'>Save</Button>
                </Group>
              </Tabs.Panel>
              <Tabs.Panel value="receipt" pt="xs">
                <Receiptview />
              </Tabs.Panel>
            </Tabs>
          </form>
          <Grid mb='xl'>
              <Grid.Col offset={6} sm={6} md={6}>
                <Modal centered 
                  transitionDuration={600}
                  closeOnEscape
                  closeOnClickOutside={false}
                  withCloseButton={false}
                  opened={opened}
                  onClose={() => setOpened(false)}
                >
                  <Text style={{marginBottom:'20px'}}>Success To Create </Text>
                  <Group position="center">
                    <Button color="blue" onClick={() => setOpened(false)}>Close</Button>
                  </Group>
                </Modal>
              </Grid.Col>
            </Grid>
        </AplicationContainer>
    )
}

export default CreateInvoice