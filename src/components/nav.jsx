import React from "react";
import community from '../assets/community.png';
import '../assets/dashboard.css';


function MainNav(){
    return(
        <nav className="navbar nav-classroom text-light">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img className="navbar-brand img-fluid" src={community} width={80} height={80} alt=""/>
                </a>
                
                <h6 className="display-6">Habilidades del Pensamiento</h6>
                <h6 className="display-6">Chat Virtual</h6>
            </div>    
        </nav>
    )
}

export default MainNav;