// import { AppConfig } from '@/AppConfig'
import { configProduct } from '@/components/lov/config'
import { InferGetServerSidePropsType } from 'next'
// import axiosConfig from '@/util/axiosConfig'

// const { apiUrl } = AppConfig

export const getServerSideProps = async () => {

  // const listData = await axiosConfig.get(`${apiUrl}/product/service/product`)
  const listData = {a: 'prince'}
  const data = listData.a
  const config = {
    ...configProduct, 
    // action: { del: {url: String(`${apiUrl}/product/service/product`)}} 
  }
  return { props: { listData: data, config } }
}

// const User = ({listData, config}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const User = ({listData, config}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(listData, config)
  return (
    <>
      Manage user
    </>
  )
}

export default User
