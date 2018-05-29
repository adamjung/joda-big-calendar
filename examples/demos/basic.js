import React from 'react'
import BigCalendar from 'react-big-calendar'
import { ZonedDateTime, nativeJs } from 'js-joda'
import events from '../events'

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let Basic = () => (
  <BigCalendar
    events={events}
    views={allViews}
    step={60}
    showMultiDayTimes
    defaultDate={ZonedDateTime.from(nativeJs(new Date(2018, 4, 1)))}
  />
)

export default Basic
