import React from "react";

import LeftSide from "./left_side";     //PROFILE AND POST-SUBMIT
import RightSide from "./right_side";   //POSTS AREA

function MainSection(){
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