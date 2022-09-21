import { Button, createStyles } from '@mantine/core'
import { IconArrowBack } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
    backButton: {
        backgroundColor: theme.colors.gray[6],
      '&:hover': {
        backgroundColor: theme.colors.gray[5],
      },
      [theme.fn.smallerThan('sm')]: {
        width: '100%',
      },
    }
}))


export function BackButton(buttonProp: {onClick: () => void}) {
    const { classes } = useStyles()
    return (
      <Button className={classes.backButton} leftIcon={<IconArrowBack/>} size='xs' {...buttonProp}>
          Back
      </Button>
    )
}
