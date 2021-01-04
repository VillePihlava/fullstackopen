const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        const result = blogs.reduce((favorite, blog) => favorite.likes < blog.likes ? blog : favorite)
        delete result._id
        delete result.__v
        delete result.url
        return result
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        let authors = {}
        blogs.forEach((blog) => {
            if (blog.author in authors) {
                authors[blog.author] += 1
            } else {
                authors[blog.author] = 1
            }
        })

        return Object.keys(authors).map(key => {
            return { author: key, blogs: authors[key] }
        }).reduce((most, author) => most.blogs < author.blogs ? author : most)
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        let authors = {}
        blogs.forEach((blog) => {
            if (blog.author in authors) {
                authors[blog.author] += blog.likes
            } else {
                authors[blog.author] = blog.likes
            }
        })

        return Object.keys(authors).map(key => {
            return { author: key, likes: authors[key] }
        }).reduce((most, author) => most.likes < author.likes ? author : most)
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}