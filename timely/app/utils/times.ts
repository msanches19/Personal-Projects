function generateTimes(): {id: number, time: string}[] {
  const timeSlots = []
  let id = 0
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      timeSlots.push({ id, time: hour.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0") })
      id++
    }
  }
  return timeSlots
}

export const times = generateTimes()