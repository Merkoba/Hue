// Shows the time elapsed between load stages
// Between file loaded and init ready
// Between init ready and join
// Between join and everything ready
App.compare_load_dates = () => {
  let time_1 = App.utilz.nice_time(App.load_date_1, App.load_date_2)
  let time_2 = App.utilz.nice_time(App.load_date_2, App.load_date_3)
  let time_3 = App.utilz.nice_time(App.load_date_3, App.load_date_4)

  App.loginfo(`Time from load to init ready: ${time_1}`)
  App.loginfo(`Time from init ready and join: ${time_2}`)
  App.loginfo(`Time from join to everything ready: ${time_3}`)
}