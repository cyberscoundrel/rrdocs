"use client"

import React, { Component, useEffect } from 'react'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './counters.module.css'


type Foo = {
    chartCode: string;
    options: object;
  };


//const symbolregex = /([a-zA-Z0-9]+)\=\>([a-zA-Z0-9]+)(?>: ([a-zA-Z0-9 ]+)(?>(?>\|([a-zA-Z0-9]+))|(\?)?))/
const symbolregex = /([a-zA-Z0-9]+)\=\>([a-zA-Z0-9]+)(?:: ([?a-zA-Z0-9 ]+)|)(?:\|([a-zA-Z0-9]+)|)(?::>(\S+)|)/g
const seqregex = /([a-zA-Z0-9]+)(?:\(([a-zA-Z0-9]+)\)|(->)?)(->)?/g

  

const code =
      `st=>start: Begin
e=>end: End
op1=>operation: Operation 1|department1
op2=>operation: Operation 2|department2
sub=>subroutine: Go To Google|external:>http://www.google.com
cond=>condition: Google?
st(bottom)->op1(bottom)->op2(right)->cond(yes)->sub(bottom)
cond(no)->e`;
const layout = `st(bottom)->op1(bottom)->op2(right)->cond(yes)->sub(bottom)
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
  let matches = [...s.matchAll(symbolregex)].flat()

  let co: fcsymbol = undefined
  let ct = 0

  console.log(matches)

  

  for(let match of matches) {
    if(symbolregex.test(match)) {
      if(co) {
        symmap.set(co.name, co)
      }

      co = {
        opts: new Map<string, fcsymbol>(),
        back: [],
      } as fcsymbol
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

function parseRules(s: string, smap: Map<string, fcsymbol>): Map<string, fcsymbol> {
  let matches = [...s.matchAll(seqregex)].flat()

  let ct = 0
  //let opt : string = undefined
  let last, curr : fcsymbol = null

  console.log(matches)
  

  for(let match of matches) {
    //console.log(match)

    if(seqregex.test(match)) {
      console.log(`match ${match}`)
      ct = 1
      continue
    }

    switch(ct) {
      case 1:
        if(smap.has(match)) {
          console.log("match")
          curr = smap[match]
          if(last) {
            console.log("last")
            curr.back.push(last)
            last.opts.add(curr)
          }
        }
        break
        
      case 3:
        last = match ? curr : undefined
        break
      default:
        




    }
    console.log(ct)

    ct += 1




  }
  console.log(smap)
  return smap


}








function NoSSRFlowchart(props) {

    const [count, setCount] = useState(0)
    const [symmap, setSymmap] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  
  

  useEffect(() => {
    setSymmap(parseRules(layout, parseFlowChart(code)))
    console.log(symmap)

  },[])

  









  






  return (
    <div>
        <ComponentWithNoSSR chartCode={props.code} options={opt}/>
        <button onClick={() => setCount(count + 1)} className={styles.counter}>Clicked {count} times</button>
        <button onClick={() => setCount(count + 1)} className={styles.counter}>Clicked {count} times</button>
    </div>
  )
}

export default NoSSRFlowchart