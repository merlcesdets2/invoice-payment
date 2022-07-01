import type { InferGetServerSidePropsType } from 'next'
import { Table, Group, Button, Input, Grid, TextInput, Select, ActionIcon, NumberInput  } from '@mantine/core'
import { AplicationContainer }  from '../components/layout/template'
import { useState } from 'react'
import { Trash, RowInsertTop } from 'tabler-icons-react';
import { DatePicker } from '@mantine/dates';

interface listDataProps {
  productCode: string | null ;
  name: string | null;
  unitPrice: number | null;
  quantity: number | null
}

export const getServerSideProps = async () => {
  
    const listData: listDataProps[] = [
      { productCode: '', name: '', unitPrice: null, quantity:null },
    ]
  
    return { props: { listData } }
  }

const CreateInvoice = ({listData}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [list, updateList] = useState(listData)
    let checknum = list.length   

    function addRow() {
        listData.splice(checknum, 0,{productCode: '', name: '', unitPrice: null, quantity: null});
        updateList(listData.filter(item => item.productCode !==undefined));
    }

    const submit = (e: React.FormEvent) => {
      e.preventDefault();
    }

    const handleProductionCode = (event: any) => {
      console.log(event)
      let data = [...list];
      // data[index].productCode = value
    }

    const rows = list.map((input,index) => (
        <tr key={index}>
          <td>
            <Select
              placeholder="productCode" 
              name='productCode' 
              data={[
                { value: '123', label: 'P123' },
                { value: '234', label: 'P234' },
                { value: '134', label: 'P134' },
                { value: '431', label: 'P431' },
              ]}
              value={input.productCode}
              required
              onChange={handleProductionCode} />
          </td>
          <td>
            <Input placeholder="Name" name='name' required />
          </td>
          <td>
            <NumberInput 
              placeholder="UnitPrice" 
              name='unitprice' 
              precision={2}
              hideControls
              required 
            />
          </td>
          <td>
            <NumberInput  placeholder="Quantity" name='quantity' defaultValue={1} min={0} required/>
          </td>
          <td>
            <Input placeholder="Price" name='price' />
          </td>
          <td>
            <Group noWrap>
              <ActionIcon>
                <Trash size={30} strokeWidth={2} color={'black'} onClick={() => {
                  if(listData.length!==1){
                      listData.splice(index, 1);
                      updateList(listData.filter(item => item.productCode !== null));
                  }
                  }}/>
              </ActionIcon>
              {/* <ActionIcon>
                <RowInsertTop size={30} strokeWidth={2} color={'black'} onClick={() => {
                  listData.splice(index, 0,{productCode: '', name: '', unitPrice: null, quantity: null});
                  updateList(listData.filter(item => item.productCode === input.productCode));
                  }}/>
              </ActionIcon> */}
            </Group>
          </td> 
        </tr>
      ))
    return(
        <AplicationContainer title='Create Invoice' hideNav>
        <div>
            <form onSubmit={submit}>
              <Grid mb='xl'>
                <Grid.Col span={4}>
                    <TextInput label="Invoice No:" radius="md" size="md" required />
                </Grid.Col>
                <Grid.Col span={4}>
                    <DatePicker label="Invoice Date" size="md" radius="md" required inputFormat="DD/MM/YYYY" />
                </Grid.Col>
                <Grid.Col span={4}>
                    <Select  label="Customer:" radius="md" size="md" required data={['customer A', 'customer B', 'customer C']} searchable/>
                </Grid.Col>
              </Grid>
              <div>
                <Group  position='right' mt='md'>
                  <Button onClick={addRow}>Add</Button>
                </Group>
                <Table striped>      
                    <thead>
                        <tr>
                            <th>*Product Code</th>
                            <th>Name</th>
                            <th>*Unit Price</th>
                            <th>*Quantity</th>
                            <th>Extended Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
                <Group  position='right' mt='md'>
                  <Button type='submit'>Save</Button>
                </Group>
              </div>
          </form>
        </div>
        </AplicationContainer>
    )
}

export default CreateInvoice