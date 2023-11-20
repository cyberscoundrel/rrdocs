"use client"

import React, { Component, useEffect } from 'react'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './counters.module.css'


type Foo = {
    chartCode: string;
    options: object;
  };


const symbolregex = /([a-zA-Z0-9]+)\=\>([a-zA-Z0-9]+)(?>: ([a-zA-Z0-9 ]+)(?>(?>\|([a-zA-Z0-9]+))|(\?)?))/
const seqregex = /([a-zA-Z0-9]+)(?:\(([a-zA-Z0-9]+)\)|)(->)?/

  

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



interface fcsymbol {
  name: string,
  type: string,
  text: string,
  opts: Map<string, fcsymbol>
  back: fcsymbol[]
  link: string
}



function parseFlowChart(s: string): Map<string, fcsymbol> {
  

  let symmap = new Map()
  let matches = s.match(symbolregex)

  let co: fcsymbol = undefined
  let ct = 0

  

  for(let match of matches) {
    if(symbolregex.test(s)) {
      if(co) {
        symmap.set(co.name, co)
      }

      co = {} as fcsymbol
      ct = 1
      continue
    }
    switch(ct) {
      case 1:
        
        co.name = match
        break
      case 2:
        co.type = match
        break
      case 3:
        co.text = match
        break
      default:


    }
    
    
    
    ct += 1
    




  }

  console.log(symmap)

  return symmap

}

function parseRules(s: string, smap: Map<string, fcsymbol>) {
  let matches = s.match(seqregex)

  let ct = 0
  let opt : string = undefined
  let last, curr : fcsymbol = null
  

  for(let match of matches) {

    if(seqregex.test(match)) {
      ct = 0
      continue
    }

    switch(ct) {
      case 1:
        if(smap.has(match)) {
          curr = smap[match]
        }
        if(last && opt) {
          curr.back.push(curr)
          last.opts.add(opt)
        }
      case 3:
        last = curr




    }




  }


}








function NoSSRFlowchart(props) {

    const [count, setCount] = useState(0)
    const [symmap, setSymmap] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  setSymmap(parseFlowChart(props.code))

  









  






  return (
    <div>
        <ComponentWithNoSSR chartCode={code} options={opt}/>
        <button onClick={() => setCount(count + 1)} className={styles.counter}>Clicked {count} times</button>
        <button onClick={() => setCount(count + 1)} className={styles.counter}>Clicked {count} times</button>
    </div>
  )
}

export default NoSSRFlowchart