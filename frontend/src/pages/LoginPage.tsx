import { useSearchParams } from "react-router-dom"
import { Login } from "../components/Auth/Login"
// Changed this so we can send people to /login?view=sign_up or /login?view=sign_in
const LoginPage = () => {
    const [searchParams] = useSearchParams()
    const view = searchParams.get("view") === "sign_up" ? "sign_up" : "sign_in"

    return (
        <Login view={view} />
    )
}

export default LoginPage