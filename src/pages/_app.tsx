import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { SessionProvider } from "next-auth/react"
import { AplicationContainer }  from '@/components/layout/template'
export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const primary = 'base'

  return (
    <>
      <Head>
        <link rel="icon" href="" />
        <title>Invoce Payment Management.</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          breakpoints: {
            xs: 500,
            sm: 768,
            md: 1079,
            lg: 1200,
            xl: 1400,
          },
          components: {
            NumberInput: {
              defaultProps:{
                precision: 2,
                parser: (value:number) => String(value).replace(/\$\s?|(,*)/g, ''),
                formatter: (value:number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              },
              styles: () => ({
                input: {
                  textAlign: 'right'
                }
              })
            }
          },
          colors: {
            base: ['#FBE9E7','#FFCCBC','#FFAB91','#FF8A65','#FF7043','#FF5722','#164a80','#2d5e91','#0f253a','#0f253a',] // button:'#164a80' header:'#0f253a' hover: button :#2d5e91
          },
          primaryColor: primary,
          fontFamily:  'Noto Sans'
        }}
      > 
        <ModalsProvider>
          <SessionProvider refetchOnWindowFocus={false}>
            <AplicationContainer>
              <Component {...pageProps} />
            </AplicationContainer>
          </SessionProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}