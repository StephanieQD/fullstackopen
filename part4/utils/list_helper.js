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
    const element = blogs[index].author
    if ( ! counts[element] ) {
      counts[element] = 1
    } else {
      counts[element]++
    }
  }

  let sorted = Object.entries(counts).sort((prev, next) => prev[1] - next[1])

  const largest = sorted.pop()

  return {
    'author' : largest[0],
    'blogs' : largest[1]
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}