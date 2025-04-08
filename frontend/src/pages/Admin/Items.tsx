import Items from "../../components/Admin/Items";
import { useAuth } from "../../hooks/useAuth";

const AdminItems = () => {
const { role} = useAuth();
    if (role !== "Head Admin") return

    return (
        <>
        <Items />
        </>
    );
};

export default AdminItems;