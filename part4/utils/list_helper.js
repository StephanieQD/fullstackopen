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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  let counts = {}
  for (let index = 0; index < blogs.length; index++) {
    const author = blogs[index].author
    if ( ! counts[author] ) {
      counts[author] = 1
    } else {
      counts[author]++
    }
  }

  let sorted = Object.entries(counts).sort((prev, next) => prev[1] - next[1])

  const largest = sorted.pop()

  return {
    'author' : largest[0],
    'blogs' : largest[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  let counts = {}
  for (let index = 0; index < blogs.length; index++) {
    const author = blogs[index].author
    const likes = blogs[index].likes
    if ( ! counts[author] ) {
      counts[author] = likes
    } else {
      counts[author] += likes
    }
  }

  let sorted = Object.entries(counts).sort((prev, next) => prev[1] - next[1])

  const largest = sorted.pop()

  return {
    'author' : largest[0],
    'likes' : largest[1]
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}