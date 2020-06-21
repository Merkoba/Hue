// Handles actions after a copy event
Hue.copypaste_events = function () {
  $(document).bind("copy", function (e) {
    if (window.getSelection().toString() !== "") {
      setTimeout(function () {
        if (Hue.utilz.is_textbox(document.activeElement)) {
          let se = document.activeElement.selectionEnd;
          document.activeElement.setSelectionRange(se, se);
        } else {
          window.getSelection().removeAllRanges();
          Hue.focus_input();
        }
      }, 200);
    }
  });
};
