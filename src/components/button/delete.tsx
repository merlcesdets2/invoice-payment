import { Button, createStyles } from '@mantine/core'
import { IconTrash } from '@tabler/icons';


const useStyles = createStyles((theme) => ({
    deleteButton: {
        backgroundColor: theme.colors.red[8],
      '&:hover': {
        backgroundColor: theme.colors.red[7],
      },
      [theme.fn.smallerThan('sm')]: {
        width: '100%',
      },
    }
}))


export function DeleteButton(buttonProp: {onClick : ()=> void})  {
    const { classes } = useStyles()
    return (
      <Button className={classes.deleteButton}  leftIcon={<IconTrash/>} size='xs' {...buttonProp}>
          Delete
      </Button>
    )
}
