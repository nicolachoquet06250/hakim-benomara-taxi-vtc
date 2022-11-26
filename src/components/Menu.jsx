import { useState } from "react";
import Navbar from "./Navbar/Navbar.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";

export default function Menu() {
    const [isSidebarOpened, setIsSidebarOpened] = useState(false);

    return (<>
        <Navbar onToggleSidebar={() => setIsSidebarOpened(s => !s)} />

	    <Sidebar opened={isSidebarOpened} onClose={() => setIsSidebarOpened(false)} />
    </>);
};