import { Button, createStyles } from '@mantine/core'
import { IconEdit } from '@tabler/icons';
import { useCheckPermission } from '@/util/helper'

const useStyles = createStyles((theme) => ({
    button: {
        backgroundColor: theme.colors.yellow[9],
      '&:hover': {
        backgroundColor: theme.colors.yellow[8],
      },
      [theme.fn.smallerThan('sm')]: {
        width: '100%'
      },
    }
}))


export function EditButton(buttonProp: {onClick: () => void}) {
    const { classes } = useStyles()
    const isAdmin = useCheckPermission()
    
    if(!isAdmin) return null

    return (
        <Button className={classes.button} leftIcon={<IconEdit/>} size='xs' {...buttonProp} >
            Edit
        </Button>
    )
}
