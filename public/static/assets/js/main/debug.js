// Shows the time elapsed between load stages
// Between file loaded and init ready
// Between init ready and join
// Between join and everything ready
Hue.compare_load_dates = () => {
  let time_1 = Hue.utilz.nice_time(Hue.load_date_1, Hue.load_date_2)
  let time_2 = Hue.utilz.nice_time(Hue.load_date_2, Hue.load_date_3)
  let time_3 = Hue.utilz.nice_time(Hue.load_date_3, Hue.load_date_4)

  Hue.loginfo(`Time from load to init ready: ${time_1}`)
  Hue.loginfo(`Time from init ready and join: ${time_2}`)
  Hue.loginfo(`Time from join to everything ready: ${time_3}`)
}