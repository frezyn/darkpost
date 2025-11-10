import { DataTable } from "../../components/data-table"
import { DashboardCards } from "../../components/section-cards"
import { SCHEDULED_POSTS_INITIAL_DATA } from "./data"



export default function Page() {
  return (

    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DashboardCards />
          <DataTable data={SCHEDULED_POSTS_INITIAL_DATA} />
        </div>
      </div>
    </div>


  )
}
