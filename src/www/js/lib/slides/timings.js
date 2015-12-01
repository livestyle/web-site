/**
 * Key slide timings. Time marks created with durations,
 * not absolute times, for easier tuning
 */
'use strict';
var t = 100;

export default {
	slide1:  time(0),
	slide2:  time(5900),
	slide3:  time(7000),
	slide4:  time(12000),
	slide5:  time(19000),
	slide6:  time(19000),
	slide7:  time(12000),
	slide8:  time(13000),
	slide9:  time(4000),
	slide10: time(13000),
	slide11: time(11000)
};

function time(duration) {
	return (t += duration);
}
