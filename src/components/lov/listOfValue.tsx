import { Table, Group, createStyles ,UnstyledButton,Center ,Text,TextInput, ScrollArea, ActionIcon, Pagination, Select } from '@mantine/core'
import Link from 'next/link';
import { IconEdit, IconSelector, IconChevronDown, IconChevronUp, IconSearch  } from '@tabler/icons';
import {useEffect, useMemo, useState} from 'react';
import { useCheckPermission } from '@/util/helper';


const useStyles = createStyles((theme) => ({
    control: {
      minWidth: 'max-content',
      padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
      color: 'white',
      paddingRight: 0
    },
  
    icon: {
      width: 21,
      height: 21,
      borderRadius: 21,
    },

    header: {
      position: 'sticky',
      top: 0,
      backgroundColor: theme.colors[theme.primaryColor][6],
      color: 'white',
      zIndex:1,
    },

    firstHeader: {
      fontWeight: 500,
      left: 0,
      position: 'sticky',
      backgroundColor:'#164a80'
    },

    firstCol: {
      position: 'sticky',
      backgroundColor: '#f8f9fa',
      minWidth: '60px',
      width: '60px',
      left: 0
    }
}));
  
interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
    type?: string
}
  
  
  
function Th({ children, reversed, sorted, onSort, type }: ThProps) {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    const p0 = { padding: 0 }
    const isNumber = type === 'number'
    return (
      <th style={ isNumber ? {textAlign: 'right', ...p0} : p0}>
        <UnstyledButton onClick={onSort} className={classes.control} >
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

interface HeaderProps {
  key: string
  label: string
  type?: string
}

interface ConfigProps {
  nameTable: string
  primaryKey: string
  header: HeaderProps[],
}

interface TablePropsOld<listDataProps> {
  listData: listDataProps[]
  config: ConfigProps
  selectedRow?(val: listDataProps): void
  selectPerpage?: boolean,
  edit?: boolean
}


export function ListOfValue<listDataProps>({listData, config, selectedRow, selectPerpage = false, edit = false }: TablePropsOld<listDataProps>) {
  console.log(listData)
    const { nameTable, primaryKey, header: headerTable} = config
    const [search, setSearch] = useState('')
    const [sortedData, setSortedData] = useState(listData);
    useEffect(() => {
      setSortedData(listData);
    }, [listData]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [sortBy, setSortBy] = useState<keyof listDataProps | any>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const { classes } = useStyles()

    const [activePage, setPage] = useState(1)
    const [perPage, setPerPage] = useState<string | null>('10')
    const numPerPage = perPage === 'ALL' ? listData.length : Number(perPage)

    const currentTableData = useMemo(() => {
      const firstPageIndex = (activePage - 1) * numPerPage;
      const lastPageIndex = firstPageIndex + numPerPage;
      return sortedData.slice(firstPageIndex, lastPageIndex)
    }, [activePage, sortedData, numPerPage])

    const totalPage = Math.ceil(sortedData.length / numPerPage)

    function filterData(data: listDataProps[], search: string) {
      const keys = Object.keys(data[0])
      const query = search.toLowerCase().trim()
      return data.filter((item) => keys.some((key) => {
        const val = item[key as keyof listDataProps]
        if(typeof val === 'string' || typeof val === 'number') return val.toString().toLowerCase().includes(query)
      }));
    }
  
    function sortData(
      data: listDataProps[],
      payload: { sortBy: keyof listDataProps; reversed: boolean; search: string }
    ) {
      const { sortBy } = payload;
      if (!sortBy) {
        return filterData(data, payload.search);
      }
    
      return filterData(
        [...data].sort((a, b) => {
          const aa = String(b[sortBy])
          const bb = String(a[sortBy])
          if (payload.reversed) {
            return aa.localeCompare(bb, undefined, {numeric: true, sensitivity: 'base'});
          }
    
          return bb.localeCompare(aa, undefined, {numeric: true, sensitivity: 'base'});
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
    }

    const isAdmin = useCheckPermission()

    const rows = currentTableData.map((element,index) => (
      <tr key={index} style={selectedRow ? {cursor: 'pointer'}:{cursor: 'context-menu'}} onClick={ selectedRow ? () => selectedRow(element) : undefined }>
        { edit && isAdmin &&
          <td className={classes.firstCol}>
            <Group sx={{justifyContent: 'center'}}>
              <Link href={{ pathname: `/form/${nameTable}/edit`, query: { [primaryKey]: String(element[primaryKey as keyof listDataProps]) } }}>
                <ActionIcon>
                  <IconEdit size={20}/>
                </ActionIcon>
              </Link>
            </Group>
          </td>
        }
        {headerTable.map(column => {
          const isColTypeNum = column.type === 'number' ? true : false
          const valCheck = element[column.key as keyof listDataProps]
          const val = isColTypeNum ? Number(valCheck).toFixed(2) : String(valCheck)
          return <td key={column.key} style={isColTypeNum ? {textAlign: 'right'} : {}}>{ isColTypeNum ? String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : val}</td>
        })}
      </tr>
    ))
  
    return (
      <>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size={14} />}
          value={search}
          onChange={handleSearchChange}
        />
      <ScrollArea sx={{ height: 350 }} px={10}>
        <Table highlightOnHover>
          <thead className={classes.header}>
              <tr>
                {edit && isAdmin && <th className={classes.firstHeader}><Text align='center' color={'white'} weight={500} size="sm" >Action</Text></th>}
                {headerTable.map(column => {
                  return <Th key={column.key} sorted={sortBy === column.key}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting(column.key as keyof listDataProps)}
                    type={column?.type}>{column.label}</Th>
                })}
              </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
        <Group position="apart" mt={8}>
          {selectPerpage ? <Select ml={10}
            defaultValue={perPage}
            rightSection={<IconChevronDown size={14} />}
            rightSectionWidth={30}
            styles={{ rightSection: { pointerEvents: 'none' }, input: { width: '120px' } }}
            data={[
              { value: '10', label: '10 / page' },
              { value: '20', label: '20 / page' },
              { value: '50', label: '50 / page' },
              { value: '100', label: '100 / page' },
              { value: 'ALL', label: 'SHOW ALL'}
            ]}
            value={perPage} onChange={(val) => {
              setPage(1)
              setPerPage(val)
            }}
          /> : <div></div>}
          <Pagination position={'right'} total={totalPage} page={activePage} onChange={setPage} size="sm" radius="md"/>
        </Group>
      </>
    )
}
