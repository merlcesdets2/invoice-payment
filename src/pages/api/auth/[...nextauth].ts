import NextAuth from 'next-auth'
import userFromBE from '../../../../docs/mockDataUser.json'

const checkPermission = async (email: string | undefined | null) =>
  userFromBE.find((beUser) => beUser.email === email)?.role

export default NextAuth({
  providers: [
    {
      id: 'jasmine',
      name: 'Jasmine',
      type: 'oauth',
      authorization: {
        url: 'https://api.jasmine.com/authen1/oauth/authorize',
        params: {
          response_type: 'code',
          scope: 'user-information',
        },
      },
      token: 'https://api.jasmine.com/authen1/oauth/token',
      userinfo: 'https://api.jasmine.com/authen1/me',
      async profile(profile) {
        const userProfile = profile[0]
        return {
          id: userProfile.employee_id,
          fullname: userProfile.eng_fullname,
          email: userProfile.email,
        }
      },
      clientId: process.env.JAS_OAUTH_CLIENT_ID,
      clientSecret: process.env.JAS_OAUTH_CLIENT_SECRET,
    },
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email
      const permission = await checkPermission(email)

      if (!permission) return '/auth/unauthorized'

      user.role = permission
      return true
    },
    async jwt({ token, user, account }) {
      if (account) token.accessToken = account.access_token
      if (user) token.user = user
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user
        session.user.image = `https://intranet.jasmine.com/hr/office/Data/${token.user.id}.jpg`
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
