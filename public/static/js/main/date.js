// Shows feedback with the current date in the nice date format
Hue.show_current_date = function()
{
    Hue.feedback(Hue.utilz.nice_date())
}

// Gets a 'time ago' string from a given date
Hue.get_timeago = function(date)
{
    return Hue.utilz.capitalize_words(timeago.format(date))
}