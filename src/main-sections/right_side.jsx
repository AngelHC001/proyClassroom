import React, { useContext } from "react";

import EditSection from "../genUser-sections/edit_profile";
import PostContainer from "../genUser-sections/get_posts";
import CommentPost from "../genUser-sections/comment_post";
import { ViewContext } from "../components/viewContext";

//posts
//my_posts
//my_profile 
function RightSide(){
    const { activeView } = useContext(ViewContext);

    return(
        <div className="col-md-8 right-side">
            {activeView.type === 'feed' && <PostContainer/> }
            {activeView.type === 'my_posts' &&  <PostContainer/>}
            {activeView.type === 'comment' && <CommentPost/>}
            {activeView.type === 'my_profile' && <EditSection/>}
        </div>
    )
}

export default RightSide;