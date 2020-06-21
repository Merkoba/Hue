// Does a math calculation using math.js
// Includes controls to make a calculation public
Hue.do_math_calculation = async function (arg) {
  if (!arg) {
    Hue.feedback("You must provide a math calculation");
    return false;
  }

  if (Hue.math === undefined) {
    if (Hue.math_loading) {
      return false;
    }

    Hue.math_loading = true;

    await Hue.load_script("/static/js/libs2/math.min.js");

    Hue.math = math.create({
      number: "BigNumber",
      precision: 64,
    });
  }

  let r;

  try {
    r = Hue.math.round(Hue.math.eval(arg), Hue.calc_round_places).toString();
  } catch (err) {
    Hue.feedback("Error");
    return false;
  }

  let s = `${arg} = **${r}**`;
  let id = `calc_${Date.now()}`;

  let f = function () {
    Hue.process_message({
      message: s,
      to_history: false,
      callback: function (success) {
        if (success) {
          $(`#${id}`).remove();
          Hue.goto_bottom(false, false);
        }
      },
    });
  };

  Hue.feedback(s, {
    comment: "Make Public",
    comment_icon: false,
    comment_onclick: f,
    replace_markdown: true,
    container_id: id,
  });
};
