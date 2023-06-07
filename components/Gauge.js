'use client';

import React, { useEffect, useRef } from 'react';
import styles from "../styles/Gauge.module.css";


const GaugeChart = ({ value , textValue}) => {
  return (
    <>
    <div className={styles.gauge}>
        <div className={styles.gauge__body}>

            <div className={styles.gauge__fill}
            style={{
                transform: `rotate(${value/2}turn)`
            }}
            >

            </div>
            <div className={styles.gauge__cover}>
                {textValue}
            </div>  

        </div>
    </div>
    </>
  )
};

export default GaugeChart;
