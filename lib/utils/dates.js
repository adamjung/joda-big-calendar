'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint no-fallthrough: off */


var _jodaDateArithmetic = require('joda-date-arithmetic');

var _jodaDateArithmetic2 = _interopRequireDefault(_jodaDateArithmetic);

var _localizer = require('../localizer');

var _localizer2 = _interopRequireDefault(_localizer);

var _jsJoda = require('js-joda');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MILLI = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24
};

var MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

var dates = _extends({}, _jodaDateArithmetic2.default, {
  monthsInYear: function monthsInYear(year, timezone) {
    var datetime = _jsJoda.LocalDateTime.of(year, 1, 1);
    var date = _jsJoda.ZonedDateTime.of(datetime, timezone || _jsJoda.ZoneId.SYSTEM);

    return MONTHS.map(function (i) {
      return dates.month(zdt, i);
    });
  },
  firstVisibleDay: function firstVisibleDay(date, culture) {
    var firstOfMonth = dates.startOf(date, 'month');

    return dates.startOf(firstOfMonth, 'week', _localizer2.default.startOfWeek(culture));
  },
  lastVisibleDay: function lastVisibleDay(date, culture) {
    var endOfMonth = dates.endOf(date, 'month');

    return dates.endOf(endOfMonth, 'week', _localizer2.default.startOfWeek(culture));
  },
  visibleDays: function visibleDays(date, culture) {
    var current = dates.firstVisibleDay(date, culture),
        last = dates.lastVisibleDay(date, culture),
        days = [];

    while (dates.lte(current, last, 'day')) {
      days.push(current);
      current = dates.add(current, 1, 'day');
    }

    return days;
  },
  ceil: function ceil(date, unit) {
    var floor = dates.startOf(date, unit);

    return dates.eq(floor, date) ? floor : dates.add(floor, 1, unit);
  },
  range: function range(start, end) {
    var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'day';

    var current = start,
        days = [];

    while (dates.lte(current, end, unit)) {
      days.push(current);
      current = dates.add(current, 1, unit);
    }

    return days;
  },
  merge: function merge(date, time, timezone) {
    var tz = timezone || _jsJoda.ZoneId.SYSTEM;
    if (time == null && date == null) return null;

    if (time == null) time = _jsJoda.ZonedDateTime.now(tz);
    if (date == null) date = _jsJoda.ZonedDateTime.now(tz);

    date = dates.startOf(date, 'day');
    date = dates.hours(date, dates.hours(time));
    date = dates.minutes(date, dates.minutes(time));
    date = dates.seconds(date, dates.seconds(time));
    return dates.milliseconds(date, dates.milliseconds(time));
  },
  eqTime: function eqTime(dateA, dateB) {
    return dates.hours(dateA) === dates.hours(dateB) && dates.minutes(dateA) === dates.minutes(dateB) && dates.seconds(dateA) === dates.seconds(dateB);
  },
  isJustDate: function isJustDate(date) {
    return dates.hours(date) === 0 && dates.minutes(date) === 0 && dates.seconds(date) === 0 && dates.milliseconds(date) === 0;
  },
  duration: function duration(start, end, unit, firstOfWeek) {
    if (unit === 'day') unit = 'date';
    start = dates.nativeTime(dates[unit](start, undefined, firstOfWeek));
    end = dates.nativeTime(dates[unit](end, undefined, firstOfWeek));

    return Math.abs(start - end);
  },
  diff: function diff(dateA, dateB, unit) {
    var start = void 0,
        end = void 0;

    if (!unit || unit === 'milliseconds') {
      start = dates.nativeTime(dateA);
      end = dates.nativeTime(dateB);
      return Math.abs(start - end);
    }

    start = dates.nativeTime(dates.startOf(dateA, unit)) / MILLI[unit];
    end = dates.nativeTime(dates.startOf(dateB, unit)) / MILLI[unit];

    // the .round() handles an edge case
    // with DST where the total won't be exact
    // since one day in the range may be shorter/longer by an hour
    return Math.round(Math.abs(start - end));
  },
  total: function total(date, unit) {
    var ms = date.getTime(),
        div = 1;

    switch (unit) {
      case 'week':
        div *= 7;
      case 'day':
        div *= 24;
      case 'hours':
        div *= 60;
      case 'minutes':
        div *= 60;
      case 'seconds':
        div *= 1000;
    }

    return ms / div;
  },
  week: function week(date) {
    return date.get(_jsJoda.IsoFields.WEEK_OF_WEEK_BASED_YEAR);
  },
  today: function today(timezone) {
    return dates.startOf(_jsJoda.ZonedDateTime.now(timezone || _jsJoda.ZoneId.SYSTEM), 'day');
  },
  yesterday: function yesterday(timezone) {
    return dates.add(dates.startOf(_jsJoda.ZonedDateTime.now(timezone || _jsJoda.ZoneId.SYSTEM), 'day'), -1, 'day');
  },
  tomorrow: function tomorrow(timezone) {
    return dates.add(dates.startOf(_jsJoda.ZonedDateTime.now(timezone || _jsJoda.ZoneId.SYSTEM), 'day'), 1, 'day');
  }
});

exports.default = dates;
module.exports = exports['default'];