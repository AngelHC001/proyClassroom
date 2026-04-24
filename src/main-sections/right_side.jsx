import React from "react";

import EditSection from "../genUser-sections/edit_profile";
import PostContainer from "../genUser-sections/get_posts";
import CommentPost from "../genUser-sections/comment_post";

//posts
//my_posts
//my_profile 
//comment
function RightSide({activeView = '', refreshKey}){
    return(
        <div className="container-fluid ">
            {activeView === 'posts' && <PostContainer mode={'all_posts'} refreshKey={refreshKey}/> }
            {activeView === 'my_posts' &&  <PostContainer mode={'my_posts'} refreshKey={refreshKey} />}
            {activeView === 'comment' && <CommentPost/>}
            {activeView === 'my_profile' && <EditSection/>}
        </div>
    )
}

export default RightSide;