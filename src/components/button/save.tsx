import { Button, createStyles } from '@mantine/core'
import { IconChecks } from '@tabler/icons';

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


export function SaveButton() {
    const { classes } = useStyles()
    return (
        <Button className={classes.button} leftIcon={<IconChecks/>} type="submit" size='xs' >
            Save
        </Button>
    )
}
