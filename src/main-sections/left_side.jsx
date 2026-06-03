import React from "react";
import ProfileArea from "../genUser-actions/area_profile";
import PostArea from "../genUser-actions/area_post";
import { useView } from "../components/viewContext";

function LeftSide(){
    const { activeView } = useView();
    const isPostUI = (activeView.type === 'feed') || (activeView.type === 'comment');

    return(
        <div className="col-md-4 left-side">
            <ProfileArea/>
            { isPostUI && (<PostArea/>)}
        </div>
    )
}

export default LeftSide;