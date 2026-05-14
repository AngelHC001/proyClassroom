import React from "react";
import { useState } from "react";

import { ViewContext } from "../components/viewContext";
import LeftSide from "./left_side";
import RightSide from "./right_side";   //POSTS AREA


function MainSection(){
    const [activeView, setActiveView] = useState({type: 'feed'});
   
    return(
        <ViewContext.Provider value={{activeView, setActiveView}}>
            <main className="container-fluid">
                <div className="row">
                    <LeftSide/>
                    <RightSide/>
                </div>
            </main>
        </ViewContext.Provider>
    )
}

export default MainSection;