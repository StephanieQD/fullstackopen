const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const compareFavs = (prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  }

  const fave = blogs.reduce(compareFavs)

  return {
    title: fave.title,
    author: fave.author,
    likes: fave.likes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}