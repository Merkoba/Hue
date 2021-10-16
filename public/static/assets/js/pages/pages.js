const utilz = Utilz()

const msg_info = Msg.factory({
	id: "info",
	class: "black",
	after_close: msg_info_after_close
})

const Hue = {}

// Select a single element
Hue.el = function (query) {
  return document.querySelector(query)
}

// Select an array of elements
Hue.els = function (query) {
  return Array.from(document.querySelectorAll(query))
}

function msg_info_after_close(instance) {
	Hue.el("form").querySelector("input").focus()
}

function set_message(s) {
	msg_info.show(s)
}

document.addEventListener("keydown", function (e) {
	if (msg_info.is_open()) {
		if (e.key === "Enter") {
			msg_info.close()
			e.preventDefault()
		} else if (e.key !== "Escape") {
			e.preventDefault()
		}
	}
})

$(function () {
	try {
		if (message && message !== "undefined") {
			set_message(message)
		}
	} catch (err) {}
})