import React from 'react'
import styles from '../styles.module.css'

interface CloseIconProps {
  onClick: () => void
}

const CloseIcon: React.FC<CloseIconProps> = ({ onClick }) => (
  <svg width='24' height='24' className={styles.closeIcon} onClick={onClick}>
    <line
      x1='24'
      y1='0'
      x2='0'
      y2='24'
      color='#fff'
      stroke='#fff'
      strokeWidth={2}
    />
    <line
      x1='0'
      y1='0'
      x2='24'
      y2='24'
      color='#fff'
      stroke='#fff'
      strokeWidth={2}
    />
  </svg>
)

export default CloseIcon
