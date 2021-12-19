/**
 * Parse the "date" metadata tag from year-month-day to add two new properties
 * to the markdown object, dateString and dateObject.
 *
 * Additionally, parse the list of tags into an array object
 *
 * Finally, sort the list of posts by date, with the most recent first.
 */
export function sortAndParsePostsByDate(posts) {
  for (let post of posts) {
    parseDate(post)
    splitTags(post)
  }

  posts.sort(function(md1, md2) {
    let date1 = new Date(...md1.dateYearMonthDay)
    let date2 = new Date(...md2.dateYearMonthDay)

    // Note: this is a descending order sort
    if (date1 < date2) return +1
    if (date1 > date2) return -1
    return 0
  })

  return posts
}

function parseDate(md) {
  if (!md.date) return
  let monthStrs = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  let [date, time] = md.date.split('T')
  let [year, month, day] = date.split('-')

  md.dateYearMonthDay = [year, month, day]
  md.dateString = `${monthStrs[month - 1]} ${day}, ${year}`
}

function splitTags(post) {
  let tagstr = post.tags
  if (!tagstr) return []
  let tagsArr = tagstr.split(',').map(tag => {
    if (tag) return tag.trim()
  })
  post.tags = tagsArr
}
