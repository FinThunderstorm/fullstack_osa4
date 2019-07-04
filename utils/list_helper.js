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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}