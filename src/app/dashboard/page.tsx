import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import Dashboard from '@/components/Dashboard'

const Page = async () => {
  const { getUser } = getKindeServerSession()
  const user:any = getUser();
  
  if (!user || !user.id){
    return redirect('/auth-callback?origin=dashboard')
  } 

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id
    }
  })

  console.log("dbUser", dbUser);

  if(!dbUser) return redirect('/auth-callback?origin=dashboard')

  return <Dashboard />
}

export default Page