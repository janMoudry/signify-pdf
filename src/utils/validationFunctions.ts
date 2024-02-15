// eslint-disable-next-line no-unused-vars
import React from 'react'

class ValidationFunctionClass {
  speed: number
  time: number
  presure: number
  timeStart: number
  timeEnd: number
  numberOfPoints: number
  setValidationInfo: React.Dispatch<
    React.SetStateAction<{
      speed: number
      time: number
      presure: number
    }>
  >

  constructor({ setValidationInfo }: ValidationFunctionInterface) {
    this.speed = 0
    this.time = 0
    this.presure = 0
    this.timeStart = 0
    this.timeEnd = 0
    this.numberOfPoints = 0
    this.setValidationInfo = setValidationInfo
  }

  setSpeed(speed: number) {
    this.speed = speed
  }

  setTime(time: number) {
    this.time = this.time + time

    this.setValidationInfo((prevState) => {
      return {
        ...prevState,
        time: this.time
      }
    })
  }

  setNumberOfPoints(numberOfPoints: number) {
    this.numberOfPoints = this.numberOfPoints + numberOfPoints

    this.setValidationInfo((prevState) => {
      return {
        ...prevState,
        numberOfPoints: this.numberOfPoints
      }
    })
  }

  setValNumberOfPoints() {
    this.setValidationInfo((prevState) => {
      return {
        ...prevState,
        speed: this.speed,
        numberOfPoints: this.numberOfPoints
      }
    })
  }

  setPresure(presure: number) {
    this.presure = presure
  }

  countTime = () => {
    const time = this.timeEnd - this.timeStart

    this.setTime(time)
    this.setValNumberOfPoints()
  }

  countTimeStart = () => {
    this.timeStart = new Date().getTime()
  }

  countTimeEnd = () => {
    this.timeEnd = new Date().getTime()

    this.countTime()
  }
}

interface ValidationFunctionInterface {
  setValidationInfo: React.Dispatch<
    React.SetStateAction<{
      speed: number
      time: number
      presure: number
    }>
  >
}

export default ValidationFunctionClass
