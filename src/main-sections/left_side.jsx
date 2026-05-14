import React from "react";
import ProfileArea from "../genUser-actions/area_profile";
import PostArea from "../genUser-actions/area_post";


function LeftSide(){
    return(
        <div className="col-md-4 left-side">
            <ProfileArea/>
            <PostArea/>
        </div>
    )
}

export default LeftSide;