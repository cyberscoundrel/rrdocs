"use client"

import React, { Component, useEffect } from 'react'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './counters.module.css'


type Foo = {
    chartCode: string;
    options: object;
  };


const symbolregex = /([a-zA-Z0-9]+)\=\>([a-zA-Z0-9]+): ([a-zA-Z0-9 ]+)\|([a-zA-Z0-9]+)/
const seqregex = /([a-zA-Z0-9]+)\(([a-zA-Z0-9]+)\)/

  

const code =
      `st=>start: Begin
e=>end: End
op1=>operation: Operation 1|department1
op2=>operation: Operation 2|department2
sub=>subroutine: Go To Google|external:>http://www.google.com
cond=>condition: Google?
st(bottom)->op1(bottom)->op2(right)->cond(yes)->sub(bottom)
cond(no)->e`;

    const opt = {
      x: 0,
      y: 0,
      'line-width': 2,
      'line-length': 50,
      'text-margin': 10,
      'font-size': 14,
      'font-color': 'black',
      'line-color': 'black',
      'element-color': 'black',
      fill: 'white',
      'yes-text': 'yes',
      'no-text': 'no',
      'arrow-end': 'block',
      scale: 1,
      symbols: {
        start: {
          'font-color': 'red',
          'element-color': 'green',
          'font-weight': 'bold',
        },
        end: {
          'font-color': 'red',
          'element-color': 'green',
          'font-weight': 'bold',
        },
      },
      flowstate: {
        department1: { fill: 'pink' },
        department2: { fill: 'yellow' },
        external: { fill: 'green' },
      },
    };
    

    

const ComponentWithNoSSR = dynamic<Foo>(
  () => import('../node_modules/react-simple-flowchart/lib/index.js'),
  { ssr: false }
  
)





function NoSSRFlowchart() {

    const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }





  






  return (
    <div>
        <ComponentWithNoSSR chartCode={code} options={opt}/>
        <button onClick={() => setCount(count + 1)} className={styles.counter}>Clicked {count} times</button>
        <button onClick={() => setCount(count + 1)} className={styles.counter}>Clicked {count} times</button>
    </div>
  )
}

export default NoSSRFlowchart