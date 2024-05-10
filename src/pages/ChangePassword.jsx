import "../scss/ChangePassword.scss";
import { Link } from "react-router-dom";

function ChangePassword() {
    return (
        <div className="ChangePassword flex a-center j-ceenter">
            <div className="container">
                <div className="ChangePassword_main">
                    <div className="ChangePassword_logo flex a-center">
                        <img src="public\logo.png" alt="" />
                        <h1>DHKH Student Infomation Exchange</h1>
                    </div>
                    <form action="">
                        <span>Change Password</span>
                        <div className="input-group">
                            <label htmlFor="enter-old-password">Enter Old Password</label>
                            <input type="password" id="enter-old-password" placeholder="Enter Old Password" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="enter-new-password">Enter New Password</label>
                            <input type="password" id="enter-new-password" placeholder="Enter Password" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirm-new-password">Confirm New Password </label>
                            <input type="password" id="confirm-new-password" placeholder="Confirm New Password" />
                        </div>
                    </form>
                    <div className="ChangePassword_btns">
                        <Link to="/profiledetail" className="confirm-btn">Confirm</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword