import {Outlet} from "react-router-dom";
import {HeaderComponent} from "../Header/HeaderComponent";
import FooterComponent from "../Footer/FooterComponent.tsx";

export const MainLayout = () => {
    return (
        <>
            <HeaderComponent />
            <main>
                <Outlet />
            </main>
            <FooterComponent/>
        </>
    );
};
