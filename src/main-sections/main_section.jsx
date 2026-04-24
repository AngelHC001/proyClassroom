import React from "react";
import { useState } from "react";

import { ProfileArea, PostArea } from "./left_side";
import RightSide from "./right_side";   //POSTS AREA

function MainSection(){
    const [activeView, setActiveView] = useState('posts');
    const [refreshKey, setRefreshKey] = useState(0);

    return(
        <main className="container-fluid">
            <div className="row">
                <div className="col-md-4 left-side">
                    <ProfileArea activeView={activeView} setActiveView={setActiveView}/>
                    <PostArea onPost={() => setRefreshKey(k => k + 1)}/>
                </div>

                <div className="col-md-8 right-side">
                    <RightSide activeView={activeView} refreshKey={refreshKey}/>
                </div>
            </div>
        </main>
    )
}

export default MainSection;