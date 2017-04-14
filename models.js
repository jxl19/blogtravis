
// It should support the four CRUD operations for a blog posts resource.
// GET and POST requests should go to /blog-posts.
// DELETE and PUT requests should go to /blog-posts/:id.
// Use Express router and modularize routes to /blog-posts.
// MAKE TWO DIFFERENT JS FILES -- BLOG POST(GET POST) BLOGPOSTSID(DELETE PUT)

const uuid = require('uuid'); //universal unique identifier

// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.

// function return custom error message 
function StorageException(message) {
  this.message = message;
  this.name = "StorageException";
}


const BlogPosts = {
  create: function (title, content, author, publishDate) { //defining content needed in each create function
    const post = {
      id: uuid.v4(), //creates a universal unique identifier
      title: title,
      content: content,
      author: author,
      publishDate: publishDate || Date.now()
    };
    this.posts.push(post);
    return post;
  },
  get: function (id = null) {
    // if id passed in, return post.id that is equal to id
    // otherwise return all posts.
    if (id !== null) {
      return this.posts.find(post => post.id === id);
    }
    // return posts sorted (descending) by
    // publish date
    return this.posts.sort(function (a, b) {
      return b.publishDate - a.publishDate
    });
  },
  //delete post equal to that id
  delete: function (id) {
    //findIndex returns index of given id here, if that id isn't there it will return -1
    const postIndex = this.posts.findIndex(
      post => post.id === id);
    // splice it at the index if findIndex > -1 bc -1 will only happen when id did not exist
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    }
  },
  update: function (updatedPost) {
    const { id } = updatedPost;
    //update post requires all four categories, this is finding the correct post using id
    const postIndex = this.posts.findIndex(
      post => post.id === updatedPost.id);
      //creating custom error using throw 
    if (postIndex === -1) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    //copies values of from a target object
    this.posts[postIndex] = Object.assign(
      this.posts[postIndex], updatedPost); //postindex has the original properties, copying values from updatedpost and returns it
    return this.posts[postIndex];
  }
};
 
function createBlogPostsModel() {
  //creating a blotpost object and puts it in an array
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}

// modulating blogpost
module.exports = { BlogPosts: createBlogPostsModel() };