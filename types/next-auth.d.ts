/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
      id: string
      email: string
      fullname: string
      image?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: Users | null
  }
}
