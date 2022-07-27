import { Table, Button, Group,createStyles ,UnstyledButton,Center ,Text,TextInput, ScrollArea, ActionIcon } from '@mantine/core'
import { AplicationContainer }  from '../../components/layout/template'
import Link from 'next/link';
import { Trash,Edit,Selector, ChevronDown, ChevronUp, Search  } from 'tabler-icons-react';
import {useState} from 'react'
import { openConfirmModal } from '@mantine/modals';
import { AppConfig } from '../../AppConfig'


const { apiCustomer } = AppConfig

export const getServerSideProps = async () => {

  // const res = await fetch(`${apiCustomer}/customer/service/customer`, { 
  //   method: 'get', 
  //   headers: { 'accessToken': 'invoiceToken'}
  // })
  // const listData = await res.json()

  const list = { data: [
    {
      "customerId": "2",
      "customerCode": "CUS002",
      "customerName": "Apple Co., Ltd.",
      "creditLimit": "40000000",
      "tel": "024992377",
      "addressLine": "212 Rama 4 Road",
      "tambolId": "2",
      "tambolName": "",
      "amphurId": "1",
      "amphurName": "",
      "provinceId": "1",
      "provinceName": ""
    },
    {
      "customerId": "6",
      "customerCode": "CUS009",
      "customerName": "apple Co., Ltd.",
      "creditLimit": "40000000",
      "tel": "024992377",
      "addressLine": "212 Rama 4 Road",
      "tambolId": "1",
      "tambolName": "",
      "amphurId": "1",
      "amphurName": "",
      "provinceId": "1",
      "provinceName": ""
    },
    {
      "customerId": "7",
      "customerCode": "CUS006",
      "customerName": "Banana Co., Ltd.",
      "creditLimit": "40000000",
      "tel": "024992377",
      "addressLine": "212 Rama 4 Road",
      "tambolId": "1",
      "tambolName": "",
      "amphurId": "1",
      "amphurName": "",
      "provinceId": "1",
      "provinceName": ""
    }
  ] }

  return { props: { listData: list.data } }
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
  customerId: string
  customerCode: string ;
  customerName: string;
  creditLimit: number;
  tel: string;
  addressLine: string;
  tambolName: string;
  amphurName: string;
  provinceName:string;
}

interface TableCusProp {
  listData: listDataProps[]
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



const Customer = ({listData}: TableCusProp) => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(listData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sortBy, setSortBy] = useState<keyof listDataProps | any>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

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

  const openDeleteModal = (index:number, element:listDataProps) => openConfirmModal({
    title: 'แจ้งเตือน',
    centered: true,
    children: (<Text size="sm"> คุณยืนยันที่จะลบ {element.customerName}</Text>),
    labels: { confirm: 'ยืนยัน', cancel: "ยกเลิก" },
    confirmProps: { color: 'red' },
    onConfirm: async () => {
      listData.splice(index, 1)
      setSortedData(listData.filter(item => item.customerId !== element.customerId))
      const del = await fetch(`${apiCustomer}/customer/service/customer?customerId=${element.customerId}`, { 
        method: 'delete', 
        headers: new Headers({ 'accessToken': 'invoiceToken'})
      })
      console.log(del)
    },
  });

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
  const rows = sortedData.map((element, index) => (
    <tr key={index}>
      <td>
          <Group spacing={1}>
            <Link href={{ pathname: '/customer/add', query: { Code: element.customerCode }}}>
              <ActionIcon style={{position: 'unset'}}>
                <Edit size={20} strokeWidth={2}/>
              </ActionIcon>
            </Link>
              <ActionIcon style={{position: 'unset'}}>
                <Trash size={20} strokeWidth={2} onClick={() => {
                  openDeleteModal(index, element)
                }}/>
              </ActionIcon>
          </Group>  
        </td>
        <td>{element.customerCode}</td>
        <td>{element.customerName}</td>
        <td>{element.creditLimit}</td>
        <td>{element.tel}</td>
        <td>{element.addressLine}</td>
        <td>{element.tambolName}</td>
        <td>{element.amphurName}</td>
        <td>{element.provinceName}</td>
    </tr>
  ))


  return (
    <AplicationContainer title='Customer' >
      <Group position="left" style={{ marginBottom: 10 }}>
        <Link href='/customer/add'>
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
                sorted={sortBy === 'customerCode'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('customerCode')}
              >Code</Th>
              <Th
                sorted={sortBy === 'customerName'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('customerName')}
              >CustomerName</Th>
              <Th
                sorted={sortBy === 'creditLimit'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('creditLimit')}
              >CreditLimit</Th>
              <Th
              sorted={sortBy === 'tel'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('tel')}
              >Telephone</Th>
              <Th
              sorted={sortBy === 'addressLine'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('addressLine')}
              >Address</Th>
              <Th
              sorted={sortBy === 'tambolName'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('tambolName')}
              >SubDistrict</Th>
              <Th
              sorted={sortBy === 'amphurName'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('amphurName')}
              >District</Th>
              <Th
              sorted={sortBy === 'provinceName'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('provinceName')}
              >Province</Th>
          </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
    </ScrollArea>
    </AplicationContainer>
  )
}

export default Customer
