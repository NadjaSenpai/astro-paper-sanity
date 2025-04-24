import postFilter from "./postFilter";

const getSortedPosts = (posts: any[]) =>{
  return posts
    .filter(postFilter)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
};

export default getSortedPosts;