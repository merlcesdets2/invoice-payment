import { Button, createStyles } from '@mantine/core'
import { IconPencilPlus } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
    button: {
        backgroundColor: '#2B8A3E',
      '&:hover': {
        backgroundColor: '#2F9E44',
      },
      [theme.fn.smallerThan('sm')]: {
        width: '100%',
      },
    },
}))

export function CreateButton() {
    const { classes } = useStyles()
    return (
        <Button  className={classes.button} leftIcon={<IconPencilPlus/>} size='xs' type="submit">
            Create
        </Button>
    )
}