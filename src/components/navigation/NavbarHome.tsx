import { getRandomVinyls } from "@/app/actions/getRandomVinyls"
import { ClientHeader } from "./ClientHeader"


export default async function Header() {
  const vinyls = await getRandomVinyls()

  return (
    <div className="bg-custom-black text-white">
      <ClientHeader vinyls={vinyls} />
    </div>
  )
}
