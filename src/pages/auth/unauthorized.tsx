import { createStyles, Text, Title } from '@mantine/core';
import Image from 'next/image'
import logo from "@/public/assets/images/3bblogo.png"


const useStyles = createStyles((theme) => ({

  wrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.xl * 2,
    borderRadius: theme.radius.md,
    backgroundColor: theme.white,
    border: `1px solid ${theme.colors.gray[3]}`,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'column-reverse',
      padding: theme.spacing.xl,
    },
  },

  image: {
    maxWidth: '40%',
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  body: {
    paddingRight: theme.spacing.xl * 3,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      paddingRight: 0,
      marginTop: theme.spacing.xl,
    },
  },

  title: {
    color: theme.black,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },

}))

const Unauthorized = () => {
  const { classes } = useStyles();
  return (
    <>
    <div style={{position: 'fixed',top: '50%',left: '50%', transform: 'translate(-50%, -50%)'}}>
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Title size={25} className={classes.title}>Wait a minute...</Title>
        <Text weight={500} size="lg" mb={5}>
            กรุณาติดต่อ Support เพื่อเข้าสู่ระบบ
        </Text>
        <Text size="sm" color="dimmed">
            Please Contact Support For Login
        </Text>
      </div>
      <Image width={200} src={logo} alt="logo" className={classes.image} />
    </div>
    </div>
    </>
  )
}

export default Unauthorized
