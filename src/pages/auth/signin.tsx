import { Text,Button, Grid, Card } from "@mantine/core"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import Image from 'next/image'
import logo from "@/public/assets/images/jaslogo.jpg"
import istyle from '../../../styles/login.module.css'


export default function Component() {
  const router = useRouter()
  const urlCallback:string = router.query.callbackUrl ? router.query.callbackUrl.toString() : '/'
  const { data: session, status } = useSession()

  const massage = {
    detail: session ? `Signed in as ${session.user?.email}` : 'Version : 1.0.0',
    sign: session ? 'SIGN OUT' : 'SIGN IN WITH JASMINE.'
  }

  if (status === "loading") return

    return <>
      <Grid className={istyle.background}>
        <Grid.Col sm={4} offsetSm={4} xs={12} style={{alignSelf: 'center'}}>
          <Card shadow="sm" p="xl" radius='md' style={{textAlign:'center'}}>
              <Text weight={700} size="xl">Invoice Payment System</Text>
              <Text> {massage.detail} </Text>
              <Card.Section mt={20}>
                <Image 
                  src={logo}
                  alt="logo"
                />
              </Card.Section>
              <Button color="blue" className={istyle.button} p="xs" onClick={() => {
                  {session ? signOut() : signIn('jasmine',  { callbackUrl: urlCallback })}
                }} >
                {massage.sign}
              </Button>
          </Card>
        </Grid.Col>
      </Grid>
    </>
}