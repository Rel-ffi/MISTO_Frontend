import {useNavigate} from "react-router-dom";
import "./MainPage.css"
import {useDocumentTitle} from "../../hooks/UseDocumentTitle.ts";


export const MainPage = () => {

    const navigate = useNavigate();
    useDocumentTitle("MISTO | Main Page");

    return (
        <div className="mainpage-wrapper">
            <div className="mainpage-text-wrapper">
                <h1>PIYACHOK</h1>
                <p>The ultimate social catalyst.
                    Find your company, set the vibe, and never drink alone.</p>
            </div>
            <div className="mainpage-featurecard-wrapper">
                <div className="mainpage-featurecard">
                    <span>01</span>
                    <h4>Define Context</h4>
                    <p>Select establishment, date, and time.
                        Set the stage for the meeting.</p>
                </div>
                <div className="mainpage-featurecard">
                    <span>02</span>
                    <h4>Set Criteria</h4>
                    <p>Filter by company size,
                        payment preferences (split/treat), and budget.</p>
                </div>
                <div className="mainpage-featurecard">
                    <span>03</span>
                    <h4>Engage</h4>
                    <p>Direct messaging and instant invites.
                        Connect immediately.</p>
                </div>
            </div>
            {localStorage.getItem("accessToken") ?
                (<button onClick={() => navigate("/features")}>Go to Features</button>)
                : (<button onClick={() => navigate("/auth")}>Try it!</button>)
            }
        </div>
    );
};

