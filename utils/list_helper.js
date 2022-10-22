const totalLikes = blogs => {
  return blogs.reduce((accr, current) => accr + current.likes, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((accr, current) => {
    return current.likes > (accr.likes ?? 0) ? current : accr
  }, {})
}

module.exports = {
  totalLikes,
  favoriteBlog
}
