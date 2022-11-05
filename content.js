let _volume;

try {
	_volume = JSON.parse(JSON.parse(localStorage.getItem("yt-player-volume")).data).volume
} catch (e) {
	_volume = 5;
}

window.addEventListener('load', () => {   
	hook();
	const observer = new MutationObserver(() => hook());
	observer.observe(
		document,
		{ subtree: true, childList: true }
	);
});

const hook = () => {
	if (!window.location.href.includes("shorts")) {
		return;
	}

	const volumeIcons = document.querySelectorAll('[d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"');

	for (const volumeIcon of volumeIcons) {
		const volumeControl = volumeIcon
			.parentElement
			.parentElement
			.parentElement
			.parentElement
		;
		const $volumeControl = $(volumeControl);

		if (volumeControl.nodeName !== "BUTTON") {
			continue;
		}

		if ($._data(volumeControl, "events")) {
			continue;
		}

		const $slider = $(
			`<input
				type="range"
				min="0"
				max="100"
				value="${_volume}"
				class="yt-shorts-vol-ext"
			>`
		).on('input', () => changeVolume($slider.val()));

		const $volumeSlider = $(`<div class="yt-shorts-vol-ext yt-shorts-vol-ext-parent"></div>`)
			.append(
				`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16">
					<path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
					<path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
					<path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
				</svg>`
			)
			.append($slider)
		;

		$volumeControl.click(() => false);
		$volumeControl.find('yt-icon').remove();
		$volumeControl.parent().find('yt-interaction').remove();
		$volumeControl.append($volumeSlider);
	}

	changeVolume(_volume);
}

const changeVolume = (volume) => {
	const time = new Date().getTime();
	const videos = document.getElementsByClassName("video-stream");

	for (const video of videos) {
		video.volume = volume / 100;
	}

	$("input[type='range'].yt-shorts-vol-ext").val(volume);

	_volume = volume;

	localStorage.setItem(
		'yt-player-volume',
		JSON.stringify({
			data: JSON.stringify({ volume: volume, muted: false }),
			creation: time,
			expiration: time + 2592000000
		})
	)
}
