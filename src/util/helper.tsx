// import { useSession } from "next-auth/react"
import dayjs from 'dayjs'

export function useCheckPermission() {
  return true
  // const { data, status } = useSession()
  // if(status === 'loading') return null
  // return data?.user.role === 'ADMIN'
}

export const dateToString = (date: Date) => dayjs(date).format('YYYY-MM-DD')