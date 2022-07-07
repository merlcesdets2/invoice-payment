// import type { InferGetServerSidePropsType } from 'next'
import { Table, Group, Button, Input, Grid, TextInput, Select, ActionIcon, NumberInput, createStyles, Text, Center } from '@mantine/core'
import { AplicationContainer }  from '../components/layout/template'
import { Trash, GripVertical  } from 'tabler-icons-react';
import { DatePicker } from '@mantine/dates';
import { useForm, formList } from '@mantine/form';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, resetServerContext  } from 'react-beautiful-dnd';
import  istyle from '../../styles/invoice.module.css'


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

    const { classes } = useStyles();

    const payload:listDataProps = { productCode: '', name: '', unitPrice: undefined, quantity:1, price: 0 } 

    const form = useForm({
      initialValues: {
        product: formList([payload]),
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
      e.preventDefault();
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
              <GripVertical size={18} />
            </div>
            </td>
            <td>
              <Select
                placeholder="Product Code" 
                data={product}
                required
                {...form.getListInputProps('product', index, 'productCode')}
                onChange = {e => {
                  form.setListItem('product', index, { ...form.values.product[index], productCode: e, name: product.find(p => p.value === e)?.name })
                }} />
            </td>
            <td>
              <Input placeholder="Name" classNames={{input: classes.disbledInput}}
              required {...form.getListInputProps('product', index, 'name')} disabled/>
            </td>
            <td>
              <NumberInput 
                placeholder="Unit Price" 
                precision={2}
                hideControls
                required
                {...form.getListInputProps('product', index, 'unitPrice')}
                onChange = {async uPrice => {
                  const rowPrice =  uPrice ? uPrice * form.values.product[index].quantity : 0
                  form.setListItem('product', index, { ...form.values.product[index], price: rowPrice, unitPrice: uPrice})
                  calSummary(rowPrice, index)
                }}
              />
            </td>
            <td>
              <NumberInput placeholder="Quantity"
                required
                {...form.getListInputProps('product', index, 'quantity')}
                onChange = {async e => {
                  const uPrice = form.values.product[index].unitPrice
                  const rowPrice = uPrice && e ? e * uPrice : 0
                  form.setListItem('product', index, { ...form.values.product[index], price: rowPrice, quantity: e ? e : 0})
                  calSummary(rowPrice, index)
                }}/>
            </td>
            <td>
              <NumberInput precision={2} placeholder="Price" {...form.getListInputProps('product', index, 'price')} classNames={{input: classes.disbledInput}} disabled/>
            </td>
            <td>
              <Group>
                <ActionIcon onClick={async() => {
                    form.removeListItem('product', index)
                    calSummary(0, index)
                  }}>
                  <Trash size={30} strokeWidth={2} color={'black'}/>
                </ActionIcon>
              </Group>
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

    const inputSummarize = []

    for(const s in summarize) {
      inputSummarize.push(
        <tr key={s} className={istyle.summary}>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><Text align='right'>{summarize[s as keyof SummarizeProps]}:</Text></td>
        <td>
          <NumberInput precision={2} classNames={{input: classes.disbledInput}} value={summary.totalPrice} disabled/>
        </td>
      </tr>
      )
    }

    rows.push(...inputSummarize)

    return (
        <AplicationContainer title='Create Invoice' hideNav>
            <form onSubmit={submit}>
              <Grid mb='xl'>
                <Grid.Col span={4}>
                    <TextInput label="Invoice No:" radius="md" size="md" required />
                </Grid.Col>
                <Grid.Col span={4}>
                    <DatePicker label="Invoice Date" size="md" radius="md" required inputFormat="DD/MM/YYYY" defaultValue={new Date()}/>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Select  label="Customer:" radius="md" size="md" required data={['customer A', 'customer B', 'customer C']} searchable/>
                </Grid.Col>
              </Grid>
              <div>
                <Group  position='right' mt='md'>
                  <Button onClick={() => {form.addListItem('product', { productCode: '', name: '', unitPrice: undefined, quantity:1, price:0 })}}>Add</Button>
                </Group>
                <DragDropContext
                      onDragEnd={({ destination, source }) => {
                        if(destination) form.reorderListItem('product', { from: source.index, to: destination.index })
                      }}
                    >
                <Table striped>      
                    <thead>
                        <tr>
                            <th></th>
                            <th>*Product Code</th>
                            <th>Name</th>
                            <th>*Unit Price</th>
                            <th>*Quantity</th>
                            <th>Extended Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                      <Droppable droppableId="dnd-list" direction="vertical">
                        {(provided) => (
                          <tbody {...provided.droppableProps} ref={provided.innerRef}>
                          {rows}
                          {provided.placeholder}
                          </tbody>
                        )}
                      </Droppable>
                </Table>
                </DragDropContext>
                <Group  position='right' mt='md'>
                  <Button type='submit'>Save</Button>
                </Group>
              </div>
          </form>
        </AplicationContainer>
    )
}

export default CreateInvoice