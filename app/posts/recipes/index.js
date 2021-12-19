import {sortAndParsePostsByDate} from '../posts/sortAndParsePostsByDate'
import {breakfast} from './breakfast'
import {dinner} from './dinner'
import {sides} from './sides'

let sortedBreakfast = sortAndParsePostsByDate(breakfast)
let sortedDinner = sortAndParsePostsByDate(dinner)
let sortedSides = sortAndParsePostsByDate(sides)

export {
  sortedBreakfast as breakfast,
  sortedDinner as dinner,
  sortedSides as sides,
}
