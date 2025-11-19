import { LoginForm } from "../../components/login-form"
import Image from "next/image"
import { BackgroundBeams } from "@workspace/ui/components/ui/background-beams"

export default function Page() {
  return (
    <>
      <BackgroundBeams />
      <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <LoginForm />
        </div>
      </div>
    </>
  )
}
