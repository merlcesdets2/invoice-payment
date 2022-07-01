import type { InferGetServerSidePropsType } from 'next'
import { Table, Button, Group, ActionIcon  } from '@mantine/core'
import { AplicationContainer }  from '../components/layout/template'
import Link from 'next/link';
import { Trash,Edit } from 'tabler-icons-react';
import {useState} from 'react'

export const getServerSideProps = async () => {

  const listData = [
    { InvoiceNo: 'INV100/13', InvoiceDate: '22-Aug-2022', CustomerCode: 'A', TotalAmount:400, Vat: 28.00,AmountDue: 428.00},
    { InvoiceNo: 'INV100/13', InvoiceDate: '25-Oct-2022', CustomerCode: 'B', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV100/13', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
  ]

  return { props: { listData } }
}

const Home = ({listData}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [list, updateList] = useState(listData);

  const rows = listData.map((element,index) => (
    <tr key={index}>
        <td>{element.InvoiceNo}</td>
        <td>{element.InvoiceDate}</td>
        <td>{element.CustomerCode}</td>
        <td>{element.TotalAmount}</td>
        <td>{element.Vat}</td>
        <td>{element.AmountDue}</td>
        <td>
          <Group>
            <Link href={{ pathname: '/invoice', query: { InvoiceNo: element.InvoiceNo } }}>
              <ActionIcon>
                <Edit size={30} strokeWidth={2} color={'black'} />
              </ActionIcon>
            </Link>
            <ActionIcon>
              <Trash size={30} strokeWidth={2} color={'black'} onClick={() => {
                  listData.splice(index, 1)
                  updateList(listData.filter(item => item.InvoiceNo !== element.InvoiceNo))
                }}/>
            </ActionIcon>
          </Group>  
        </td>
    </tr>
  ))


  return (
    <AplicationContainer title='List' hideNav>
    <div>
      <Table>
        <thead>
            <tr>
                <th>InvoiceNo</th>
                <th>InvoiceDate</th>
                <th>CustomerCode</th>
                <th>TotalAmount</th>
                <th>Vat</th>
                <th>AmountDue</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Group position="right" style={{ marginTop: 10 }}>
        <Link href='/invoice'>
          <Button variant="outline">เพิ่ม</Button>
        </Link>
      </Group>
    </div>
    </AplicationContainer>
  )
}

export default Home
