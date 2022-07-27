import { createStyles, Group, Table, UnstyledButton,Text} from '@mantine/core'
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
}));
interface ThProps {
  children: React.ReactNode;
}
function Th({ children}: ThProps) {
  const { classes } = useStyles();
  return (
    <th className={classes.th}>
      <UnstyledButton className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
        </Group>
      </UnstyledButton>
    </th>
  );
}

export const Receiptview = () => {
  const listData = [
    { ReceiptNo: 'INV100/13', OnDate: '22-Aug-2022', PaymentMethod: 'Cash', ReceiptAmount:200},
    { ReceiptNo: 'INV101/14', OnDate: '22-Jun-2022', PaymentMethod: 'Check', ReceiptAmount:100},
    { ReceiptNo: 'INV102/15', OnDate: '22-Oct-2022', PaymentMethod: 'Check', ReceiptAmount:400},
  ]
  const rows = listData.map((element,index) => (
    <tr key={index}>
        <td>{element.ReceiptNo}</td>
        <td>{element.OnDate}</td>
        <td>{element.PaymentMethod}</td>
        <td>{element.ReceiptAmount}</td>
        <td>
        </td>
    </tr>
  ))


  return (
    <div style={{overflow: 'auto'}}>
      <Table >
        <thead>
            <tr>
                <Th>ReceiptNo</Th>
                <Th>OnDate</Th>
                <Th>PaymentMethod</Th>
                <Th>ReceiptAmount</Th>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

    </div>
  )
}

