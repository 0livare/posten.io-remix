import s2013 from './slides-2013'
import s2015 from './slides-2015'
import s2016 from './slides-2016'

let all = [
  ...s2013,
  ...s2015,
  ...s2016,
]

let byTitle = all.reduce(
  (accum, currValue) => {
    accum[currValue.title] = currValue
    return accum
  }, {})

export default [
  byTitle['Christmas Light'],
  byTitle['America the Beautiful'],
  byTitle['River Walk'],
  byTitle['Outside Wrigly'],
  byTitle['Blue Dock'],
  byTitle['Streamers'],
  byTitle['Sparklers'],
  byTitle['Jumping in puddles'],
  byTitle['Cold spring'],
  byTitle['Dam splashing water'],
  byTitle['The Misty Veils'],
  byTitle['Ahhhdorable'],
  byTitle['Trees'],
]
