import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'

import dates from './utils/dates'
import { elementType, dateFormat } from './utils/propTypes'
import { convertToTimezone } from './utils/dayViewLayout/event'
import BackgroundWrapper from './BackgroundWrapper'
import TimeSlotGroup from './TimeSlotGroup'

export default class TimeColumn extends Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
    culture: PropTypes.string,
    timezone: PropTypes.string.isRequired,
    timeslots: PropTypes.number.isRequired,
    getNow: PropTypes.func.isRequired,
    min: PropTypes.object.isRequired,
    max: PropTypes.object.isRequired,
    showLabels: PropTypes.bool,
    timeGutterFormat: dateFormat,
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    resource: PropTypes.string,

    slotPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    dayWrapperComponent: elementType,
  }
  static defaultProps = {
    step: 30,
    timeslots: 2,
    showLabels: false,
    type: 'day',
    className: '',
    dayWrapperComponent: BackgroundWrapper,
  }

  renderTimeSliceGroup(key, isNow, date, resource) {
    const {
      dayWrapperComponent,
      timeslots,
      showLabels,
      step,
      slotPropGetter,
      dayPropGetter,
      timeGutterFormat,
      culture,
      timezone,
    } = this.props

    return (
      <TimeSlotGroup
        key={key}
        isNow={isNow}
        value={date}
        timezone={timezone}
        step={step}
        slotPropGetter={slotPropGetter}
        dayPropGetter={dayPropGetter}
        culture={culture}
        timeslots={timeslots}
        resource={resource}
        showLabels={showLabels}
        timeGutterFormat={timeGutterFormat}
        dayWrapperComponent={dayWrapperComponent}
      />
    )
  }

  render() {
    const {
      timezone,
      className,
      children,
      style,
      getNow,
      min,
      max,
      step,
      timeslots,
      resource,
    } = this.props
    const totalMin = dates.diff(min, max, 'minutes')
    const numGroups = Math.ceil(totalMin / (step * timeslots))
    const renderedSlots = []
    const groupLengthInMinutes = step * timeslots

    let date = convertToTimezone(min, timezone)
    let next = date
    let now = getNow()
    let isNow = false

    for (var i = 0; i < numGroups; i++) {
      isNow = dates.inRange(
        now,
        date,
        dates.add(next, groupLengthInMinutes - 1, 'minutes'),
        'minutes'
      )

      next = dates.add(date, groupLengthInMinutes, 'minutes')
      renderedSlots.push(this.renderTimeSliceGroup(i, isNow, date, resource))

      date = next
    }

    return (
      <div className={cn(className, 'rbc-time-column')} style={style}>
        {renderedSlots}
        {children}
      </div>
    )
  }
}
