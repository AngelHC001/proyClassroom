import React from "react";

import EditSection from "../genUser-sections/edit_profile";
import PostContainer from "../genUser-sections/get_posts";

function RightSide({activeView = ''}){
    //posts
    //my_posts
    //my_profile
    
    return(
        <div className="container-fluid ">
            {activeView === 'posts' && <PostContainer mode={'all_posts'}/> }
            {activeView === 'my_posts' &&  <PostContainer mode={'my_posts'}/>}
            {activeView === 'my_profile' && <EditSection/>}
        </div>
    )
}

export default RightSide;