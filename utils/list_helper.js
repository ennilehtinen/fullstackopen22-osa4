const totalLikes = blogs => {
  return blogs.reduce((accr, current) => accr + current.likes, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((accr, current) => {
    return current.likes > (accr.likes ?? 0) ? current : accr
  }, {})
}

const mostBlogs = blogs => {
  const blogsByAuthor = []
  blogs.map(blog => {
    const authorIndex = blogsByAuthor.findIndex(a => a.author === blog.author)
    if (authorIndex > -1) {
      blogsByAuthor[authorIndex].blogs++
    } else {
      blogsByAuthor.push({
        author: blog.author,
        blogs: 1
      })
    }
  })

  return blogsByAuthor.sort((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = blogs => {
  const blogsByAuthor = []
  blogs.map(blog => {
    const authorIndex = blogsByAuthor.findIndex(a => a.author === blog.author)
    if (authorIndex > -1) {
      blogsByAuthor[authorIndex].likes += blog.likes
    } else {
      blogsByAuthor.push({
        author: blog.author,
        likes: blog.likes
      })
    }
  })

  return blogsByAuthor.sort((a, b) => b.likes - a.likes)[0]
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
