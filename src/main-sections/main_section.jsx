import React from "react";
//import { useAuth } from "../genUser-sections/AuthContext";
import { useState } from "react";

import { ProfileArea, PostArea } from "./left_side";
import RightSide from "./right_side";   //POSTS AREA

function MainSection(){
    const [activeView, setActiveView] = useState('posts');

    return(
        <main className="container-fluid">
            <div className="row">
                <div className="col-md-4 left-side">
                    <ProfileArea activeView={activeView} setActiveView={setActiveView}/>
                    <PostArea/>
                </div>

                <div className="col-md-8 right-side">
                    <RightSide activeView={activeView}/>
                </div>
            </div>
        </main>
    )
}

export default MainSection;