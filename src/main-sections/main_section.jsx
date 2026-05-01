import React from "react";
import { useState } from "react";

import { ViewContext } from "../components/viewContext";
import { ProfileArea, PostArea } from "./left_side";
import RightSide from "./right_side";   //POSTS AREA


function MainSection(){
    const [activeView, setActiveView] = useState({type: 'feed'});
    const [refreshKey, setRefreshKey] = useState(0);

    return(
        <ViewContext.Provider value={{activeView, setActiveView}}>
            <main className="container-fluid">
                <div className="row">
                    <div className="col-md-4 left-side">
                        <ProfileArea/>
                        <PostArea onPost={() => setRefreshKey(k => k + 1)}/>
                    </div>

                    <div className="col-md-8 right-side">
                        <RightSide refreshKey={refreshKey}/>
                    </div>
                </div>
            </main>
        </ViewContext.Provider>
    )
}

export default MainSection;