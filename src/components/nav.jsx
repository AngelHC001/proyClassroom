import React from "react";

import community from '../assets/community.png';

function MainNav(){
    return(
        <nav className="navbar navbar-primary bg-primary text-light border-bottom ">
            <div className="container">
                <img src={community} width="60" height="60" className="align-top" alt=""/>
                <h2>Inicio</h2>
            </div>    
        </nav>
    )
}

export default MainNav;