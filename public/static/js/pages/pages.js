const utilz = Utilz()

const msg_info = Msg.factory({
	id: "info",
	class: "black",
	after_close: msg_info_after_close
})

function msg_info_after_close(instance) {
	$("form").eq(0).find("input").eq(0).trigger("focus")
}

function set_message(s) {
	msg_info.show(s)
}

$(document).on("keydown", function (e) {
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