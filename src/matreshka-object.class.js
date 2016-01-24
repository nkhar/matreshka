define([
	'matreshka_dir/matreshka.class',
	'matreshka_dir/matreshka-object/dynamic',
	'matreshka_dir/matreshka-object/iterator',
	'matreshka_dir/core/var/sym-iterator'
], function(MK, dynamic, iterator, symIterator) {
	"use strict";
	if (!MK) {
		throw new Error('Matreshka is missing');
	}
	var sym = MK.sym,
		i,

		prototype = {
			'extends': MK,
			isMKObject: true,
			renderer: null,
			constructor: function MatreshkaObject(object) {
				if(!(this instanceof MatreshkaObject)) {
					throw new TypeError('Cannot call a class as a function');
				}

				return this.jset(object);
			},

			_initMK: function() {
				var _this = this,
					addedEvents;

				if (_this[sym]) return _this;

				MK.prototype._initMK.call(_this);

				_this[sym].keys = {};

				MK._fastAddListener(_this, 'addevent:modify', function(evt) {
					if (!addedEvents) {
						MK._fastAddListener(_this, 'change', function(evt) {
							if (evt && (evt.key in _this[sym].keys) && !evt.silent) {
								MK._fastTrigger(_this, 'modify', evt);
							}
						});

						MK._fastAddListener(_this, 'delete', function(evt) {
							if (evt && (evt.key in _this[sym].keys)) {
								delete _this[sym].keys[evt.key];

								if (!evt.silent) {
									MK._fastTrigger(_this, 'remove', evt);
									MK._fastTrigger(_this, 'modify', evt);
								}
							}
						});

						addedEvents = true;
					}
				});

				return _this;
			},

			hasOwnProperty: function(key) {
				return this._initMK()[sym].keys.hasOwnProperty(key);
			}
		};

	MK.extend(prototype, dynamic);

	prototype[symIterator] = iterator;

	return MK.Object = MK.Class(prototype);
});
