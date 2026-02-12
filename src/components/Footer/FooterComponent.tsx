import {NavLink} from "react-router-dom";
import "./FooterComponent.css"


const FooterComponent = () => {

    return (
        <div className="footer-wrapper">
            <div className="footeritems-wrapper">
                <div className="footertext">
                    <h4>MISTO</h4>
                    <p>© 2026 Misto App. All rights reserved.</p>
                </div>
                <div className="footernavlink">
                    <NavLink to="/privacy">Privacy</NavLink>
                    <NavLink to="/terms">Terms</NavLink>
                    <NavLink to="/support">Support</NavLink>
                </div>
            </div>
        </div>
    );
};

export default FooterComponent;