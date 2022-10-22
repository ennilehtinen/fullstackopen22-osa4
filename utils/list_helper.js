const totalLikes = blogs => {
  return blogs.reduce((accr, current) => accr + current.likes, 0)
}

module.exports = {
  totalLikes
}
