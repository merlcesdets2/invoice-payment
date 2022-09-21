import { Button, createStyles } from '@mantine/core'
import { IconPlaylistAdd } from '@tabler/icons';
import { useCheckPermission } from '@/util/helper'

const useStyles = createStyles((theme) => ({
    bottom: {
      [theme.fn.smallerThan('sm')]: {
        width: '100%'
      },
    },
  }));

export function AddButton(buttonProp: {onClick: () => void}) {
  const { classes } = useStyles();
  const isAdmin = useCheckPermission()
  if(!isAdmin) return null

  return (
    <Button  className={classes.bottom} leftIcon={<IconPlaylistAdd/>} size='xs' {...buttonProp}>
      Add
    </Button>
  )
}