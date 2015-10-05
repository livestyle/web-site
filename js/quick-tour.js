import quickTour from 'quick-tour';

var startBtn = document.querySelector('.quick-tour__btn');
var qtDownloadBtn = document.querySelector('.qt-download__btn');
var tour = quickTour('.qt-screen');
var startTime = location.hash.replace('#', '');

startBtn.addEventListener('click', evt => {
	evt.preventDefault();
	evt.stopPropagation();

	startBtn.className += ' quick-tour__btn_hidden';
	setTimeout(() => {
		setup();
		tour.play();
	}, 1000);
});

qtDownloadBtn.addEventListener('click', evt => {
	document.querySelector('.download').scrollIntoView();
});

if (startTime && /^\d+$/.test(startTime)) {
	setup();
	tour.timecode = +startTime;
}

function setup() {
	startBtn.style.display = 'none';
	tour.elem.addEventListener('click', evt => {
		var elem = evt.target;
		if (!elem.classList.contains('qt-play-again') && elem !== qtDownloadBtn) {
			tour.toggle();
		}
	});
}