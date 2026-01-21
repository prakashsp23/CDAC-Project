import { Outlet } from "react-router-dom"
// import { ModeToggle } from "../mode-toggle"

export default function AuthLayout() {
  return (
    <>
      {/* <header className="flex justify-between items-center p-4">
        <div className="text-xl font-bold">App</div>
        <ModeToggle />
      </header> */}
      <main className="w-full mx-auto">
        <Outlet />
      </main>
    </>
  )
}
