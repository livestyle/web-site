/**
 * Timeline is a virtual video tape: it is able to render a scene
 * for a specific time code (this is very important). Timeline consists 
 * of Clips: a small animation with start position and duration that controls
 * animation of specific object.
 */
'use strict';
import 'es6-collections';
import EventEmitter from './event-emitter';

export default class Timeline extends EventEmitter {
	constructor(elem) {
		super();

		if (typeof elem === 'string') {
			elem = document.querySelector(elem);
		}

		this.elem = elem;
		this.clips = [];
		this._timecode = -1;
		this._duration = null;
		this._state = 'pause';
		this._prevTime = 0;

		// we can create multiple clips for a single element. In order to 
		// render those clips properly, we have to create a special lookup
		// that will help us pick appropriate clip for given timecode
		// and render it only
		this._elemLookup = new Map();
		this._loop = (time) => {
			if (!this._prevTime) {
				this._prevTime = time;
			}

			var delta = time - this._prevTime;
			if (this.state === 'play' && this.timecode + delta < this.duration) {
				requestAnimationFrame(this._loop);
			} else {
				this.pause();
			}

			this.timecode += delta;
			this._prevTime = time;
		};
	}

	play() {
		if (this.state !== 'play') {
			this._state = 'play';
			this._prevTime = 0;
			requestAnimationFrame(this._loop);
			this.emit('state', 'play');
		}
	}

	pause() {
		if (this.state !== 'pause') {
			this._state = 'pause';
			this.emit('state', 'pause');
		}
	}

	stop() {
		this.pause();
		this.timecode = 0;
	}

	toggle() {
		if (this.state === 'play') {
			this.pause();
		} else {
			if (this.timecode === this.duration) {
				this.timecode = 0;
			}
			this.play();
		}
	}

	get duration() {
		if (this._duration === null) {
			this._duration = this.clips
			.reduce((prev, clip) => Math.max(clip.start + clip.duration, prev), 0);
		}
		return this._duration;
	}

	get timecode() {
		return this._timecode;
	}

	set timecode(value) {
		value = Math.min(Math.max(+value, 0), this.duration);
		if (value !== this.timecode) {
			this.render(this._timecode = value);
		}
	}

	get state() {
		return this._state;
	}

	_ix(clip, entries=this.clips) {
		for (var i = 0, il = this.clips.length; i < il; i++) {
			if (this.clips[i].clip === clip) {
				return i;
			}
		}
		return -1;
	}

	add(start, clip) {
		if (typeof start === 'object') {
			clip = start;
			start = 0;
		}

		if (this._ix(clip) === -1) {
			var duration = clip.duration;
			var entry = {clip, start, duration};
			this.clips.push(entry);
			this._duration = null;

			if (clip.elem) {
				// element-base clip, create lookup for it
				var elemClips = this._elemLookup.get(clip.elem) || [];
				elemClips.push(entry);
				elemClips.sort((a, b) => a.start - b.start);
				this._elemLookup.set(clip.elem, elemClips);
			}

			this.emit('update');
		}
	}

	remove(clip) {
		var ix = this._ix(clip);
		if (ix !== -1) {
			this.clips.splice(ix, 1);
			this._duration = null;

			if (clip.elem) {
				var lookupEntry = this._elemLookup.get(clip.elem);
				ix = this._ix(clip, lookupEntry);
				if (ix !== -1) {
					lookupEntry.splice(ix, 1);
				}
				if (!lookupEntry.length) {
					this._elemLookup.delete(clip.elem);
				} else {
					this._elemLookup.set(clip.elem, lookupEntry);
				}
			}

			this.emit('update');
		}
	}

	render(timecode) {
		var lookup = new Map();
		var render = entry => renderEntry(timecode, entry);
		this.clips.forEach(item => {
			var elem = item.clip.elem;
			if (elem) {
				// element-based clip, in order to properly restore state,
				// render best matching clip in last place
				if (!lookup.has(elem)) {
					lookup.set(elem, bestElementClipForTime(timecode, this._elemLookup.get(elem)));
				}
				if (lookup.get(elem) === item) {
					return;
				}
			}

			render(item);
		});
		lookup.forEach(render);
		lookup.clear();
		this.emit('render', timecode);
	}

	clipDuration(clip) {
		if (typeof clip === 'object') {
			clip = this._ix(clip);
		}

		var item = this.clips[clip];
		return item ? item.clip.duration || 0 : -1;
	}
};

function renderEntry(time, entry) {
	var absClipTime = time - entry.start;
	var clipTime = Math.max(0, absClipTime);
	if (entry.duration) {
		clipTime = Math.min(entry.duration, clipTime);
	}
	entry.clip.render(clipTime, absClipTime);
}

function bestElementClipForTime(time, entries) {
	return entries.reduce((prev, cur) => cur.start <= time ? cur : prev, entries[0]);
}