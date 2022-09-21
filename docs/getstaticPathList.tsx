import { GetStaticPaths, GetStaticProps , InferGetStaticPropsType } from 'next'
import router from 'next/router';

import { ListOfValue } from '@/components/lov/listOfValue'
import { AddButton } from '@/components/button/add';
// import { Custom500 } from '@/components/error/500';
import { AppConfig } from '@/AppConfig'
import { Center, Group, Loader } from '@mantine/core'
import axiosConfig from '@/util/axiosConfig'
import { configInvoice, configCustomer, configProduct } from '@/components/lov/config'
import useSWR from 'swr';
import { Custom500 } from '@/components/error/500';

const { apiUrl } = AppConfig


const mapPageData = async (list: string) => {

  const config = {
      invoice: configInvoice,
      customer: configCustomer,
      product: configProduct
  }

  const api = `${apiUrl}/${list}/service/${list}`
  return [api, config[list as keyof typeof config]]
}

export const getStaticPaths:GetStaticPaths = async () => {
  return {
    paths: [{ params: { list: 'invoice' } }, { params: { list: 'customer' }}, {params: { list: 'product' }}],
    fallback: false
  }
}


export const getStaticProps:GetStaticProps = async ({ params }) => {
    const list  = params?.list
    const payload = await mapPageData(String(list))
    return { props: { key: list, payload } }

}

const fetcher = (url:string) => axiosConfig.get(url).then(res => res.data)

const List = ({payload}: InferGetStaticPropsType <typeof getStaticProps>) => {

  const [ api, config ] = payload
  const { data, error } = useSWR(api, fetcher)

  if (error || data?.error) return <Custom500/>
  if (!data) return (
    <Center pt={'20vh'}>
      <Loader />
    </Center>
  )


  return (
    <>
      <Group position="left" style={{ marginBottom: 10 }}>
        <AddButton onClick={() => router.push(`/form/${config.nameTable}/add`)}/>
      </Group>
      <ListOfValue listData={data} config={config} edit/>
    </>
  )

}

export default List
