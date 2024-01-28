
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/User";
import useGetBalance from "../hooks/GetBalance";
export const Dashboard = ()=>{
    const balance = useGetBalance();
    return <div>
    <Appbar/>
    <div className="m-8">
        <Balance value={balance} />
        <Users/>
    </div>
    </div>
}