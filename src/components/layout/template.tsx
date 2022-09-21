import { AppShell, Container } from '@mantine/core';
import { Headbar } from './headbar'
import { Footer } from './footer'

type Props = {
    title?: string
    children: React.ReactNode,
  };

export const AplicationContainer = ({children}: Props) => {
    return (
        <AppShell
        header={<Headbar/>}
        footer={<Footer/>}
        >
        <Container px={20} size={1280}>
            {children}
        </Container>
        </AppShell>
    );
}