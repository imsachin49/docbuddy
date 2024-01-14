import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'

const Page = async () => {
  const { getUser } = getKindeServerSession()
  const user = getUser()
  console.log("user", user);
  if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id
    }
  })

  console.log("dbUser", dbUser);

  if(!dbUser) redirect('/auth-callback?origin=dashboard')

  return <div>hello Guys+{user?.email}</div>
}

export default Page