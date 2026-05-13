import React, { useContext } from "react";

import EditSection from "../genUser-sections/edit_profile";
import PostContainer from "../genUser-sections/get_posts";
import CommentPost from "../genUser-sections/comment_post";
import { ViewContext } from "../components/viewContext";

//posts
//my_posts
//my_profile 
function RightSide({refreshKey}){
    const { activeView } = useContext(ViewContext);

    return(
        <div className="container-fluid ">
            {activeView.type === 'feed' && <PostContainer refreshKey={refreshKey}/> }
            {activeView.type === 'my_posts' &&  <PostContainer refreshKey={refreshKey} />}
            {activeView.type === 'comment' && <CommentPost/>}
            {activeView.type === 'my_profile' && <EditSection/>}
        </div>
    )
}

export default RightSide;