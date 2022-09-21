import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import router from 'next/router';

import { configInvoice, configCustomer, configProduct } from '@/components/lov/config'
import { ListOfValue } from '@/components/lov/listOfValue'
import { AddButton } from '@/components/button/add';
import { Custom500 } from '@/components/error/500';
import { AppConfig } from '@/AppConfig'
import { Group, Loader, Center  } from '@mantine/core'

import axiosConfig from '@/util/axiosConfig'
import useSWR from 'swr'

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

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { query } = context
  const { list } = query
  const payload = await mapPageData(String(list))

  if (!payload[1]) {
    return {
      notFound: true,
    }
  }

  return { props: { key: list, payload } }
}

const fetcher = (url:string) => axiosConfig.get(url).then(res => res.data)

const List = ({payload}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [ api, config ] = payload
  const { data, error } = useSWR(api, fetcher, {revalidateOnFocus: false})

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
