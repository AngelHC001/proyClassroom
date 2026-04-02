import React from "react";
//import { useAuth } from "../genUser-sections/AuthContext";
import { useState } from "react";

import LeftSide from "./left_side";     //PROFILE AND POST-SUBMIT
import RightSide from "./right_side";   //POSTS AREA

function MainSection(){
    const [section, setSection] = useState('dashboard')

  

    //const {user} = useAuth();

    //RIGHT SIDE ADQUIERE EL NOMBRE
    //RIGHT SIDE TIENE EL DICT DE NOMBRES QUE RENDERIZAR

    //dashboard
    //mypost
    //edit


    return(
        <main>
            <div className="container-fluid">
                <div className="row">
                    <LeftSide/>
                    <RightSide/>
                </div>
            </div>
        </main>
    )
}

export default MainSection;