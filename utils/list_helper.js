

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((a,b) => {
    return a + b.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  blogs.sort((a,b) => b.likes-a.likes)
  const favorite = blogs.filter(a => a.likes === blogs[0].likes)
  return favorite[0]
}

const mostBlogs = (blogs) => {
  const writers = []
  blogs.map((a) => {
    var loytyyko = []
    for(const writer of writers){
      if(writer.author === a.author){
        loytyyko.push(true)
      }
    }
    if(loytyyko.length === 0){
      const talleta = {
        author: a.author,
        blogs: 1
      }
      writers.push(talleta)
    } else{
      const id = writers.findIndex(b => a.author === b.author)
      writers[id].blogs = writers[id].blogs + 1
    }
  })
  writers.sort((a,b) => b.blogs-a.blogs)
  const most = writers.filter(a => a.blogs === writers[0].blogs)
  return most[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}