/* global message:readonly */

const utilz = Utilz()

const msg_info = Msg.factory({
	id: "info",
	class: "black",
	after_close: msg_info_after_close,
	enable_titlebar: true
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

function msg_info_after_close (instance) {
	Hue.el("form").querySelector("input").focus()
}

function show_info (s) {
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

window.onload = function () {
	try {
		if (message && message !== "undefined") {
			show_info(message)
		}
	} catch (err) {}

	msg_info.set_title("Info")
}