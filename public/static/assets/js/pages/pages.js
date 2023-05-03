/* global message:readonly */

const utilz = Utilz()

const msg_info = Msg.factory({
	id: "info",
	class: "black",
	after_close: msg_info_after_close,
	enable_titlebar: true
})

function msg_info_after_close (instance) {
	DOM.el("form").querySelector("input").focus()
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