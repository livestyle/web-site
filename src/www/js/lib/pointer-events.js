/**
 * Модуль, обеспечивающий абстракцию над устройством указания (мышь, тач-скрин).
 * Позволяет использовать одно и тоже наименование событий (pointerdown, 
 * pointermove и т.д.) для привязки обработчиков к элементам, а также эмулировать
 * некоторые touch-события для устройств, которые их не поддерживают.
 */
'use strict';

var hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
var emulateMouse = true;
var swipeThreshold = 20;
var tapDelay = 250;
var longTapDelay = 750;
var longTapTimeout = null;

/** Информация об обрабатываемом событии */
var pointerData = null;

var eventMap = hasTouch || !emulateMouse ? {
	pointerstart: 'touchstart',
	pointermove: 'touchmove',
	pointerend: 'touchend'
} : {
	pointerstart: 'mousedown',
	pointermove: 'mousemove',
	pointerend: 'mouseup'
};

// aliases
eventMap.start = eventMap.pointerstart;
eventMap.end = eventMap.pointerend;
eventMap.move = eventMap.pointermove;

var specialEvents = {};
specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

export function on(ctx, name, callback) {
	getElem(ctx).addEventListener(eventMap[name] || name, callback, false);
}

export function off(elem, name, callback) {
	getElem(elem).removeEventListener(eventMap[name] || name, callback, false);
}

/**
 * Инициирует событие longTap
 */
function longTap() {
	longTapTimeout = null;
	if (pointerData) {
		dispatchEvent('pointerlongtap', pointerData.initialEvent);
		dispatchEvent('pointerend', pointerData.initialEvent);
	}
	pointerData = null;
}

/**
 * Отменяет запуск события longTap
 */
function cancelLongTap() {
	if (longTapTimeout) {
		clearTimeout(longTapTimeout);
	}
	longTapTimeout = null;
}

function getPointerCoords(evt) {
	if (evt.touches && evt.touches.length) {
		return {
			x: evt.touches[0].pageX,
			y: evt.touches[0].pageY
		};
	}
	
	if (evt.data && 'x' in evt.data) {
		return {
			x: evt.data.x,
			y: evt.data.y
		};
	}
	
	return {
		x: evt.pageX,
		y: evt.pageY
	};
}

function getSwipeSpeed(coords) {
	var coords = coords.slice(Math.max(0, coords.length - 7)).reverse();

	for (var i = 0, sumX = 0, sumY = 0, il = coords.length - 1; i < il; i++) {
		sumX += coords[i].x - coords[i + 1].x;
		sumY += coords[i].y - coords[i + 1].y;
	}
	
	return {
		x: sumX / il,
		y: sumY / il
	};
}

function isSingleTouch(evt) {
	return !evt.touches || evt.touches.length == 1;
}

function getElem(query) {
	if (typeof query === 'string') {
		return document.querySelector(query);
	}

	return query;
}

function createEvent(type, props) {
	if (typeof type !== 'string') {
		props = type;
		type = props.type;
	}
	var event = document.createEvent(specialEvents[type] || 'Events');
	var bubbles = true;
	if (props) {
		for (var name in props) {
			if (name == 'bubbles') {
				bubbles = !!props[name];
			} else {
				event[name] = props[name];
			}
		}
	}

	event.initEvent(type, bubbles, true);
	return event;

}

function dispatchEvent(name, originalEvent, options) {
	var evtData = {
		pageX: pointerData.end.x,
		pageY: pointerData.end.y,
		
		pageStartX: pointerData.start.x,
		pageStartY: pointerData.start.y,
		
		moved: pointerData.moved
	};
	
	var evt = createEvent(name, evtData);
	try {
		originalEvent.target.dispatchEvent(evt);
	} catch (e) {}
	
	var isPrevented = 'isDefaultPrevented' in evt 
		? evt.isDefaultPrevented() 
		: evt.defaultPrevented;
		
	if (isPrevented) {
		originalEvent.preventDefault();
	}

	return evt;
}

on(document, 'pointerstart', function(evt) {
	// let's see if we're able to handler this event
	if (!isSingleTouch(evt)) 
		return;
	
	var coords = getPointerCoords(evt);
	pointerData = {
		start: coords, 
		end: coords,
		initialEvent: evt,
		timestamp: Date.now(),
		moveCoords: []
	};
	
//		longTapTimeout = setTimeout(longTap, longTapDelay);
	
	dispatchEvent('pointerstart', evt);
});

on(document, 'pointermove', function(evt) {
	if (!pointerData) {
		return;
	}
	
	cancelLongTap();
	
	pointerData.end = getPointerCoords(evt);
	pointerData.moved = true;
	pointerData.moveCoords.push(pointerData.end);
	
	if (!isSingleTouch(evt)) {
		dispatchEvent('pointerend', evt);
		pointerData = null;
	} else {
		dispatchEvent('pointermove', evt);
	}
});

on(document, 'pointerend', function(evt) {
	cancelLongTap();
	if (pointerData) {
		if (!pointerData.moved) {
			var now = Date.now();
			dispatchEvent('pointerend', evt);
			if (now - pointerData.timestamp <= tapDelay) {
				dispatchEvent('pointertap', evt);
			}
		} else {
			// handle swipe, if possible
			if (pointerData.moveCoords.length > 1) {
				var delta, dir;
				var swipeSpeed = getSwipeSpeed(pointerData.moveCoords);
				if (Math.abs(swipeSpeed.y) > Math.abs(swipeSpeed.x)) {
					delta = swipeSpeed.y;
					dir = ['down', 'up'];
				} else {
					delta = swipeSpeed.x;
					dir = ['right', 'left'];
				}
				
				if (Math.abs(delta) > swipeThreshold) {
					dispatchEvent('pointerswipe', evt, {
						swipeDirection: delta > 0 ? dir[0] : dir[1],
						swipeSpeed: delta
					});
					swipeHandled = true;
				}
			}
			
			dispatchEvent('pointerend', evt);
		}
		
		pointerData = null;
	}
});