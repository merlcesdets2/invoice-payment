import type { InferGetServerSidePropsType } from 'next'
import { Table, Button, Group,createStyles ,UnstyledButton,Center ,Text,TextInput, ScrollArea, ActionIcon } from '@mantine/core'
import { AplicationContainer }  from '../../components/layout/template'
import Link from 'next/link';
import { Trash,Edit,Selector, ChevronDown, ChevronUp, Search  } from 'tabler-icons-react';
import {useState} from 'react'

export const getServerSideProps = async () => {

  const listData = [
    { InvoiceNo: 'INV100/13', InvoiceDate: '22-Aug-2022', CustomerCode: 'A', TotalAmount:400, Vat: 28.00,AmountDue: 428.00},
    { InvoiceNo: 'INV101/14', InvoiceDate: '25-Oct-2022', CustomerCode: 'B', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
    { InvoiceNo: 'INV102/15', InvoiceDate: '07-Oct-2022', CustomerCode: 'C', TotalAmount:300, Vat: 21.00,AmountDue: 321.00},
  ]

  return { props: { listData } }
}

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
  header: {
    position: 'sticky',
    top: 0,
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
}));

interface listDataProps {
  InvoiceNo: string ;
  InvoiceDate: string;
  CustomerCode: string;
  TotalAmount: number;
  Vat: number;
  AmountDue: number;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}



function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group>
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: listDataProps[], search: string) {
  const keys = Object.keys(data[0]);
  const query = search.toLowerCase().trim();
  return data.filter((item) => keys.some((key) => item[key as keyof listDataProps].toString().toLowerCase().includes(query)));
}


const Home = ({listData}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(listData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sortBy, setSortBy] = useState<keyof listDataProps | any>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  function sortData(
    data: listDataProps[],
    payload: { sortBy: keyof listDataProps; reversed: boolean; search: string}
  ) {
    if (!payload.sortBy) {
      return filterData(data, payload.search);
    }
  
    return filterData(
      [...data].sort((a, b) => {
        if (payload.reversed) {
          return b[payload.sortBy].toString().localeCompare(a[payload.sortBy].toString());
        }
  
        return a[payload.sortBy].toString().localeCompare(b[payload.sortBy].toString());
      }),
      payload.search
    );
  }

  const setSorting = (field: keyof listDataProps) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(listData, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(listData,{ sortBy, reversed: reverseSortDirection, search: value }));
  };
  const rows = sortedData.map((element,index) => (
    <tr key={index}>
      <td>
        <Group spacing={3}>
          <Link href={{ pathname: '/invoice', query: { InvoiceNo: element.InvoiceNo } }}>
            <ActionIcon style={{position: 'unset'}}>
              <Edit size={20} strokeWidth={2} />
            </ActionIcon>
          </Link>
            <ActionIcon style={{position: 'unset'}}>
              <Trash size={20} strokeWidth={2} onClick={() => {
                  listData.splice(index, 1)
                  setSortedData(listData.filter(item => item.InvoiceNo !== element.InvoiceNo))
                }}/>
            </ActionIcon>
        </Group>
      </td>
      <td>{element.InvoiceNo}</td>
      <td>{element.InvoiceDate}</td>
      <td>{element.CustomerCode}</td>
      <td>{element.TotalAmount}</td>
      <td>{element.Vat}</td>
      <td>{element.AmountDue}</td>
    </tr>
  ))


  return (
    <AplicationContainer title='List Invoice'>
      <Group position="left" style={{ marginBottom: 10 }}>
        <Link href='/invoice/add'>
          <Button variant="outline">เพิ่ม</Button>
        </Link>
      </Group>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<Search size={14} />}
        value={search}
        onChange={handleSearchChange}
      />
    <ScrollArea sx={{ height: 400 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table >
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th style={{fontWeight:500,color:'black'}}>Action</th>
                <Th 
                  sorted={sortBy === 'InvoiceNo'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('InvoiceNo')}
                >InvoiceNo</Th>
                <Th
                  sorted={sortBy === 'InvoiceDate'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('InvoiceDate')}
                >InvoiceDate</Th>
                <Th
                  sorted={sortBy === 'CustomerCode'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('CustomerCode')}
                >CustomerCode</Th>
                <Th
                sorted={sortBy === 'TotalAmount'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('TotalAmount')}
                >TotalAmount</Th>
                <Th
                sorted={sortBy === 'Vat'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('Vat')}
                >Vat</Th>
                <Th
                sorted={sortBy === 'AmountDue'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('AmountDue')}
                >AmountDue</Th>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      </ScrollArea>
    </AplicationContainer>
  )
}

export default Home
